import React, { useState, useEffect } from "react";
import QRScanner from "./QRScanner";
import AttendanceHistory from "./AttendanceHistory";
import StudentAuth from "./StudentAuth";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { CheckCircle2, XCircle, MapPin } from "lucide-react";
import { isLocationValid } from "@/lib/utils/location";

interface AttendanceRecord {
  subject: string;
  lectureType: string;
  batch: string;
  date: string;
  time: string;
  timestamp: number;
  locationValid?: boolean;
}

interface StudentData {
  studentId: string;
  email: string;
}

const StudentDashboard = () => {
  const [lastScanned, setLastScanned] = useState<AttendanceRecord | null>(null);
  const [coordinates, setCoordinates] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [attendanceHistory, setAttendanceHistory] = useState<
    AttendanceRecord[]
  >([]);
  const [student, setStudent] = useState<StudentData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Get current location on component mount
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      });
    }
  }, []);

  const handleScan = async (data: string) => {
    try {
      // Parse QR code data
      const [subject, lectureType, batch, date, time, qrNumber] =
        data.split("_");

      // Get current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const studentLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };

          // Assuming teacher's location is stored in the QR code or available somewhere
          const teacherLocation = {
            latitude: 19.076, // Replace with actual teacher's location
            longitude: 72.8777,
          };

          const locationValid = isLocationValid(
            studentLocation.latitude,
            studentLocation.longitude,
            teacherLocation.latitude,
            teacherLocation.longitude,
          );

          const newAttendance = {
            subject,
            lectureType,
            batch,
            date,
            time,
            timestamp: Date.now(),
            locationValid,
          };

          setLastScanned(newAttendance);
          setAttendanceHistory((prev) => [newAttendance, ...prev]);
          setCoordinates(studentLocation);
        });
      }
    } catch (error) {
      console.error("Error parsing QR code:", error);
    }
  };

  const handleLogin = (data: {
    studentId: string;
    email: string;
    password: string;
  }) => {
    // In a real app, validate credentials against a backend
    setStudent({ studentId: data.studentId, email: data.email });
    setIsAuthenticated(true);
  };

  const handleRegister = (data: {
    studentId: string;
    email: string;
    password: string;
  }) => {
    // In a real app, send registration data to backend
    setStudent({ studentId: data.studentId, email: data.email });
    setIsAuthenticated(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {!isAuthenticated ? (
          <div className="flex justify-center items-center min-h-[80vh]">
            <StudentAuth onLogin={handleLogin} onRegister={handleRegister} />
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Student Attendance
            </h1>

            <QRScanner onScan={handleScan} />

            {lastScanned && (
              <Card className="bg-white">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Last Attendance</h2>
                    <Badge
                      variant="outline"
                      className={
                        lastScanned.locationValid
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      }
                    >
                      {lastScanned.locationValid ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Valid
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 mr-1" />
                          Invalid
                        </>
                      )}
                    </Badge>
                  </div>

                  <div className="grid gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Subject</p>
                      <p className="font-medium">{lastScanned.subject}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Type</p>
                      <p className="font-medium">{lastScanned.lectureType}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Batch</p>
                      <p className="font-medium">{lastScanned.batch}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Date & Time</p>
                      <p className="font-medium">
                        {lastScanned.date.replace(/_/g, "-")} {lastScanned.time}
                      </p>
                    </div>

                    {coordinates && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin className="w-4 h-4" />
                        <span>
                          {coordinates.latitude.toFixed(6)},{" "}
                          {coordinates.longitude.toFixed(6)}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            <AttendanceHistory
              history={attendanceHistory.map((record, index) => ({
                id: index.toString(),
                subject: record.subject,
                lectureType: record.lectureType,
                date: record.date.replace(/_/g, "-"),
                time: record.time,
                locationValid: record.locationValid || false,
              }))}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
