import React, { useState, useEffect } from "react";
import QRCodeDisplay from "./QRCodeDisplay";
import SessionControls from "./SessionControls";
import StatusPanel from "./StatusPanel";
import AttendanceList from "./AttendanceList";
import { Button } from "./ui/button";
import { FileDown } from "lucide-react";
import { generateQRCodeData } from "@/lib/utils/qr";

const Home = () => {
  const [subject, setSubject] = useState("SRM");
  const [lectureType, setLectureType] = useState("Theory");
  const [batch, setBatch] = useState("");
  const [qrCodeData, setQrCodeData] = useState("");
  const [sessionStartTime] = useState(new Date());
  const [studentCount, setStudentCount] = useState(0);
  const [coordinates, setCoordinates] = useState({ latitude: 0, longitude: 0 });
  const [sessionActive, setSessionActive] = useState(false);

  useEffect(() => {
    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      });
    }
  }, []);

  const handleQRRefresh = () => {
    if (sessionActive) {
      const newQRData = generateQRCodeData(subject, lectureType, batch);
      setQrCodeData(newQRData);
    }
  };

  const handleCreateQR = () => {
    setSessionActive(true);
    handleQRRefresh();
  };

  const handleEndSession = () => {
    setSessionActive(false);
    setQrCodeData("");
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
    handleQRRefresh();
  }, [subject, lectureType, batch]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Attendance Management Dashboard
          </h1>
          <Button variant="outline" className="flex items-center gap-2">
            <FileDown className="h-4 w-4" />
            Export Data
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-4 space-y-6">
            {sessionActive && (
              <QRCodeDisplay
                qrCodeData={qrCodeData}
                refreshInterval={5000}
                onRefresh={handleQRRefresh}
              />
            )}
            <SessionControls
              onSubjectChange={setSubject}
              onLectureTypeChange={setLectureType}
              onBatchChange={setBatch}
              onCreateQR={handleCreateQR}
              onEndSession={handleEndSession}
            />
          </div>

          {/* Right Column */}
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
