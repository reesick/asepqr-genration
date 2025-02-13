import React, { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Progress } from "./ui/progress";
import { Loader2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface QRCodeDisplayProps {
  qrCodeData: string;
  refreshInterval?: number;
  onRefresh?: () => void;
}

const QRCodeDisplay = ({
  qrCodeData,
  refreshInterval = 5000,
  onRefresh = () => {},
}: QRCodeDisplayProps) => {
  const [timeLeft, setTimeLeft] = useState(refreshInterval / 1000);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onRefresh();
          return refreshInterval / 1000;
        }
        return prev - 1;
      });

      setProgress((prev) => {
        if (prev <= 0) {
          return 100;
        }
        return (timeLeft - 1) * (100 / (refreshInterval / 1000));
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [refreshInterval, onRefresh, timeLeft]);

  return (
    <Card className="w-[400px] h-[500px] bg-white">
      <CardContent className="p-6 flex flex-col items-center justify-center space-y-6">
        <div className="relative w-[400px] h-[400px] flex items-center justify-center bg-gray-50 rounded-lg">
          {qrCodeData ? (
            <QRCodeSVG
              value={qrCodeData}
              size={300}
              level="H"
              includeMargin={true}
              className="w-[300px] h-[300px]"
            />
          ) : (
            <Loader2 className="w-16 h-16 animate-spin text-gray-400" />
          )}
        </div>

        <div className="w-full space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Refreshing in {timeLeft}s</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      </CardContent>
    </Card>
  );
};

export default QRCodeDisplay;
