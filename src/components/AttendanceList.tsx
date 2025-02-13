import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";

interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName?: string;
  timestamp: string;
  locationValid: boolean;
}

interface AttendanceListProps {
  records?: AttendanceRecord[];
}

const defaultRecords: AttendanceRecord[] = [
  {
    id: "1",
    studentId: "12345",
    studentName: "John Doe",
    timestamp: "2024-03-21 09:15:23",
    locationValid: true,
  },
  {
    id: "2",
    studentId: "12346",
    studentName: "Jane Smith",
    timestamp: "2024-03-21 09:16:45",
    locationValid: false,
  },
  {
    id: "3",
    studentId: "12347",
    studentName: "Mike Johnson",
    timestamp: "2024-03-21 09:17:30",
    locationValid: true,
  },
];

const AttendanceList = ({ records = defaultRecords }: AttendanceListProps) => {
  return (
    <Card className="w-full h-full bg-white p-4 overflow-hidden">
      <div className="h-full flex flex-col">
        <h2 className="text-xl font-semibold mb-4">Attendance Records</h2>
        <div className="flex-grow overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Location Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">
                    {record.studentName || record.studentId}
                  </TableCell>
                  <TableCell>{record.timestamp}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {record.locationValid ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700"
                          >
                            Valid
                          </Badge>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 text-red-500" />
                          <Badge
                            variant="outline"
                            className="bg-red-50 text-red-700"
                          >
                            Invalid
                          </Badge>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
};

export default AttendanceList;
