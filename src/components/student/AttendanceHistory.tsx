import React from "react";
import { Card, CardContent } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import { CalendarClock, MapPin } from "lucide-react";

export interface AttendanceHistoryItem {
  id: string;
  subject: string;
  lectureType: string;
  date: string;
  time: string;
  locationValid: boolean;
}

interface AttendanceHistoryProps {
  history: AttendanceHistoryItem[];
}

const AttendanceHistory = ({ history }: AttendanceHistoryProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Attendance History</h2>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {history.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{item.subject}</h3>
                    <p className="text-sm text-gray-500">{item.lectureType}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      item.locationValid
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }
                  >
                    {item.locationValid ? "Valid" : "Invalid"} Location
                  </Badge>
                </div>
                <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <CalendarClock className="w-4 h-4" />
                    <span>
                      {item.date} {item.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {item.locationValid ? "Within Range" : "Out of Range"}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default AttendanceHistory;
