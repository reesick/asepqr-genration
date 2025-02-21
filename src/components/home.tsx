import React, { useState, useEffect } from "react";
import QRCodeDisplay from "./QRCodeDisplay";
import SessionControls from "./SessionControls";
import StatusPanel from "./StatusPanel";
import AttendanceList from "./AttendanceList";
import { Button } from "./ui/button";
import { FileDown } from "lucide-react";
import { generateQRCodeData } from "@/lib/utils/qr";
import { useToast } from "./ui/use-toast";

const Home = () => {
  const { toast } = useToast();
  const [subject, setSubject] = useState("SRM");
  const [lectureType, setLectureType] = useState("Theory");
  const [batch, setBatch] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState("9:00-10:00");
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [sessionStartTime] = useState(new Date());
  const [studentCount, setStudentCount] = useState(0);
  const [coordinates, setCoordinates] = useState({ latitude: 0, longitude: 0 });
  const [sessionActive, setSessionActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Location error:", error);
        },
      );
    }
  }, []);

  const handleQRRefresh = async () => {
    if (!sessionActive) return;

    setIsLoading(true);
    try {
      const newQRData = await generateQRCodeData(
        subject,
        lectureType,
        batch,
        selectedTime,
        selectedDate,
      );
      console.log("Generated QR Data:", newQRData);
      setQrCodeData(newQRData);
    } catch (error) {
      console.error("Failed to generate QR code:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateQR = async () => {
    setIsLoading(true);
    try {
      const newQRData = await generateQRCodeData(
        subject,
        lectureType,
        batch,
        selectedTime,
        selectedDate,
      );

      setSessionActive(true);
      setQrCodeData(newQRData);

      toast({
        title: "Session Started",
        description: "QR codes will refresh every 5 seconds",
      });
    } catch (error) {
      console.error("Failed to start session:", error);
      toast({
        title: "Error",
        description: "Failed to start session. Please try again.",
        variant: "destructive",
      });
      setSessionActive(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndSession = () => {
    setSessionActive(false);
    setQrCodeData(null);
    toast({
      title: "Session Ended",
      description: "QR code generation stopped",
    });
  };

  const calculateSessionDuration = () => {
    const now = new Date();
    const diff = now.getTime() - sessionStartTime.getTime();
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (!sessionActive) return;

    handleQRRefresh();
  }, [sessionActive]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Attendance Management Dashboard
          </h1>
          <Button variant="outline" className="flex items-center gap-2">
            <FileDown className="h-4 w-4" />
            Export Data
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-6">
            <QRCodeDisplay
              qrCodeData={qrCodeData}
              refreshInterval={5000}
              onRefresh={handleQRRefresh}
              isLoading={isLoading}
            />
            <SessionControls
              onSubjectChange={setSubject}
              onLectureTypeChange={setLectureType}
              onBatchChange={setBatch}
              onDateChange={setSelectedDate}
              onTimeChange={setSelectedTime}
              onCreateQR={handleCreateQR}
              onEndSession={handleEndSession}
              isLoading={isLoading}
            />
          </div>

          <div className="lg:col-span-8 space-y-6">
            <StatusPanel
              sessionDuration={calculateSessionDuration()}
              studentCount={studentCount}
              coordinates={coordinates}
            />
            <AttendanceList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
