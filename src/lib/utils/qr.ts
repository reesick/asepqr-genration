export const generateQRCodeData = (
  subject: string,
  lectureType: string,
  batch: string,
) => {
  const now = new Date();
  const date = now.toISOString().split("T")[0].replace(/-/g, "_");
  const time = `${now.getHours()}-${now.getHours() + 1}`;
  const qrNumber = Math.floor(Math.random() * 1000);

  return `${subject}_${lectureType}_${batch}_${date}_${time}_${qrNumber}`;
};

export const isQRCodeValid = (qrData: string, timestamp: number) => {
  const now = Date.now();
  return now - timestamp <= 300000; // 5 minutes validity
};
