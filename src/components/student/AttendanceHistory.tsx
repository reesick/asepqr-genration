import React from "react";
import { Card } from "@/components/ui/card";

const AttendanceHistory = () => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Attendance History</h2>
      <p className="text-gray-500">No attendance records found.</p>
    </Card>
  );
};

export default AttendanceHistory;
