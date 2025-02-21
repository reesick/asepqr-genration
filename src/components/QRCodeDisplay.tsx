import React, { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Progress } from "./ui/progress";
import { Loader2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface QRCodeDisplayProps {
  qrCodeData: string | null;
  refreshInterval?: number;
  onRefresh?: () => void;
  isLoading?: boolean;
}

const QRCodeDisplay = ({
  qrCodeData,
  refreshInterval = 5000,
  onRefresh = () => {},
  isLoading = false,
}: QRCodeDisplayProps) => {
  const [timeLeft, setTimeLeft] = useState(refreshInterval / 1000);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!qrCodeData || isLoading) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onRefresh();
          return refreshInterval / 1000;
        }
        return prev - 1;
      });

      setProgress((prev) => {
        const newProgress = ((timeLeft - 1) / (refreshInterval / 1000)) * 100;
        return Math.max(0, Math.min(100, newProgress));
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [refreshInterval, onRefresh, timeLeft, isLoading, qrCodeData]);

  // Reset timer when loading completes or QR code changes
  useEffect(() => {
    if (!isLoading && qrCodeData) {
      setTimeLeft(refreshInterval / 1000);
      setProgress(100);
    }
  }, [isLoading, qrCodeData, refreshInterval]);

  return (
    <Card className="w-[400px] h-[500px] bg-white">
      <CardContent className="p-6 flex flex-col items-center justify-center space-y-6">
        <div className="relative w-[400px] h-[400px] flex items-center justify-center bg-gray-50 rounded-lg">
          {isLoading ? (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-16 h-16 animate-spin text-gray-400" />
              <p className="text-sm text-gray-500">Generating QR Code...</p>
            </div>
          ) : qrCodeData ? (
            <div className="flex flex-col items-center gap-4">
              <QRCodeSVG
                value={qrCodeData}
                size={300}
                level="H"
                includeMargin={true}
              />
              <p className="text-sm text-gray-500 break-all max-w-[300px] text-center">
                {qrCodeData}
              </p>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <p>No QR code generated</p>
              <p className="text-sm">Start a session to generate QR codes</p>
            </div>
          )}
        </div>

        {qrCodeData && !isLoading && (
          <div className="w-full space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Refreshing in {timeLeft}s</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QRCodeDisplay;
