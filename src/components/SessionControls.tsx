import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Card } from "./ui/card";
import { Slider } from "./ui/slider";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon, QrCode, XCircle, Loader2 } from "lucide-react";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

interface SessionControlsProps {
  onEndSession?: () => void;
  onSubjectChange?: (subject: string) => void;
  onLectureTypeChange?: (type: string) => void;
  onBatchChange?: (batch: string) => void;
  onDateChange?: (date: Date) => void;
  onTimeChange?: (time: string) => void;
  onQRCountChange?: (count: number) => void;
  onCreateQR?: () => void;
  isLoading?: boolean;
}

const subjects = [
  "SRM",
  "CAS",
  "UHV",
  "GP-1",
  "PFE",
  "AE",
  "DA",
  "SA",
  "RAD-1",
];
const lectureTypes = ["Theory", "Lab", "Tutorial"];
const batches = ["Whole Class", "Batch 1", "Batch 2", "Batch 3"];
const timeSlots = Array.from({ length: 10 }, (_, i) => {
  const hour = i + 9;
  return `${hour}:00-${hour + 1}:00`;
});

const SessionControls = ({
  onEndSession = () => {},
  onSubjectChange = () => {},
  onLectureTypeChange = () => {},
  onBatchChange = () => {},
  onDateChange = () => {},
  onTimeChange = () => {},
  onQRCountChange = () => {},
  onCreateQR = () => {},
  isLoading = false,
}: SessionControlsProps) => {
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [subject, setSubject] = useState(subjects[0]);
  const [lectureType, setLectureType] = useState(lectureTypes[0]);
  const [batch, setBatch] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState(timeSlots[0]);
  const [qrCount, setQrCount] = useState([50]);

  const handleSubjectChange = (value: string) => {
    setSubject(value);
    onSubjectChange(value);
  };

  const handleLectureTypeChange = (value: string) => {
    setLectureType(value);
    onLectureTypeChange(value);
    // Set default batch to "Whole Class"
    setBatch("Whole Class");
    onBatchChange("Whole Class");
  };

  const handleBatchChange = (value: string) => {
    setBatch(value);
    onBatchChange(value);
  };

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
      onDateChange(newDate);
    }
  };

  const handleTimeChange = (value: string) => {
    setTime(value);
    onTimeChange(value);
  };

  const handleQRCountChange = (value: number[]) => {
    setQrCount(value);
    onQRCountChange(value[0]);
  };

  return (
    <Card className="p-6 bg-white w-[300px]">
      <div className="space-y-4">
        <Select value={subject} onValueChange={handleSubjectChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select Subject" />
          </SelectTrigger>
          <SelectContent>
            {subjects.map((sub) => (
              <SelectItem key={sub} value={sub}>
                {sub}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={lectureType} onValueChange={handleLectureTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select Lecture Type" />
          </SelectTrigger>
          <SelectContent>
            {lectureTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={batch} onValueChange={handleBatchChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select Batch" />
          </SelectTrigger>
          <SelectContent>
            {batches.map((b) => (
              <SelectItem key={b} value={b}>
                {b}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Select value={time} onValueChange={handleTimeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select Time Slot" />
          </SelectTrigger>
          <SelectContent>
            {timeSlots.map((slot) => (
              <SelectItem key={slot} value={slot}>
                {slot}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            QR Codes to Generate: {qrCount[0]}
          </label>
          <Slider
            min={0}
            max={150}
            step={1}
            value={qrCount}
            onValueChange={handleQRCountChange}
          />
        </div>

        <Button
          variant="default"
          className="w-full"
          onClick={() => setShowCreateDialog(true)}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <QrCode className="w-4 h-4 mr-2" />
              Create QR Codes
            </>
          )}
        </Button>

        <Button
          variant="destructive"
          className="w-full"
          onClick={() => setShowEndDialog(true)}
          disabled={isLoading}
        >
          <XCircle className="w-4 h-4 mr-2" />
          End Session
        </Button>

        <AlertDialog open={showEndDialog} onOpenChange={setShowEndDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>End Session</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to end the current session? This will stop
                QR code generation.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => {
                  onEndSession();
                  setShowEndDialog(false);
                }}
              >
                End Session
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Create QR Codes</AlertDialogTitle>
              <AlertDialogDescription>
                Generate {qrCount[0]} QR codes for {subject} {lectureType}
                {batch ? ` - ${batch}` : ""} at {time}?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  onCreateQR();
                  setShowCreateDialog(false);
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Card>
  );
};

export default SessionControls;
