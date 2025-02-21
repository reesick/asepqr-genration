export const generateQRCodeData = async (
  subject: string,
  lectureType: string,
  batch: string,
  timeSlot: string,
  selectedDate: Date,
): Promise<string> => {
  // Format date as YYYY-MM-DD
  const date = selectedDate.toISOString().split("T")[0];

  // Parse time slot
  const [timeStart, timeEnd] = timeSlot.split("-");

  // Generate QR code data with the format:
  // subject_lecturetype_batch_timestart-timeend_year_month_day_qrcodeno
  const [year, month, day] = date.split("-");
  const qrNumber = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");

  const qrData = `${subject}_${lectureType}_${batch}_${timeStart}-${timeEnd}_${year}_${month}_${day}_${qrNumber}`;
  return qrData;
};

export const isQRCodeValid = (qrData: string, timestamp: number) => {
  const now = Date.now();
  return now - timestamp <= 300000; // 5 minutes validity
};
