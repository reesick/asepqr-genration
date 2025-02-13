import React, { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { MapPin, Users, Clock } from "lucide-react";

interface StatusPanelProps {
  sessionDuration?: string;
  studentCount?: number;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

const StatusPanel = ({
  sessionDuration = "00:00:00",
  studentCount = 0,
  coordinates = { latitude: 0, longitude: 0 },
}: StatusPanelProps) => {
  const [currentTime, setCurrentTime] = useState(sessionDuration);

  useEffect(() => {
    setCurrentTime(sessionDuration);
  }, [sessionDuration]);

  return (
    <Card className="p-4 bg-white w-full max-w-[300px] space-y-4">
      <div className="flex items-center space-x-3 text-slate-700">
        <Clock className="h-5 w-5" />
        <div>
          <p className="text-sm font-medium">Session Duration</p>
          <p className="text-lg font-bold">{currentTime}</p>
        </div>
      </div>

      <div className="flex items-center space-x-3 text-slate-700">
        <Users className="h-5 w-5" />
        <div>
          <p className="text-sm font-medium">Students Present</p>
          <p className="text-lg font-bold">{studentCount}</p>
        </div>
      </div>

      <div className="flex items-center space-x-3 text-slate-700">
        <MapPin className="h-5 w-5" />
        <div>
          <p className="text-sm font-medium">Location</p>
          <p className="text-sm">
            {coordinates.latitude.toFixed(6)},{" "}
            {coordinates.longitude.toFixed(6)}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default StatusPanel;
