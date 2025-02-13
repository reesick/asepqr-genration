import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Card, CardContent } from "../ui/card";
import { Alert, AlertDescription } from "../ui/alert";
import { isQRCodeValid } from "@/lib/utils/qr";

interface QRScannerProps {
  onScan?: (data: string) => void;
}

const QRScanner = ({ onScan = () => {} }: QRScannerProps) => {
  const [error, setError] = useState<string>("");
  const qrRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    qrRef.current = new Html5Qrcode("qr-reader");

    qrRef.current
      .start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          if (isQRCodeValid(decodedText, Date.now())) {
            onScan(decodedText);
            setError("");
          } else {
            setError("QR code has expired. Please scan a new one.");
          }
        },
        (errorMessage) => {
          console.log(errorMessage);
        },
      )
      .catch((err) => {
        setError(err?.message || "Failed to access camera");
      });

    return () => {
      if (qrRef.current) {
        qrRef.current
          .stop()
          .catch((err) => console.error("Failed to stop camera:", err));
      }
    };
  }, [onScan]);

  return (
    <Card className="w-full max-w-md mx-auto bg-white">
      <CardContent className="p-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-center">
            Scan Attendance QR Code
          </h2>

          <div
            id="qr-reader"
            className="relative aspect-square w-full max-w-[300px] mx-auto overflow-hidden rounded-lg"
          />

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QRScanner;
