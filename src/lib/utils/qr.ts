let cachedPosition: GeolocationPosition | null = null;
let positionUpdateInterval: NodeJS.Timeout;

// Cache the position periodically
const startPositionUpdates = () => {
  // Set default position
  cachedPosition = {
    coords: {
      latitude: 18.464262,
      longitude: 73.867924,
      accuracy: 0,
      altitude: null,
      altitudeAccuracy: null,
      heading: null,
      speed: null,
    },
    timestamp: Date.now(),
  };

  // Update position every second
  positionUpdateInterval = setInterval(() => {
    // Keep using the default position
    cachedPosition.timestamp = Date.now();
  }, 1000);
};

// Start position updates immediately
startPositionUpdates();

// Cleanup function to clear interval
export const cleanup = () => {
  if (positionUpdateInterval) {
    clearInterval(positionUpdateInterval);
  }
};

export const generateQRCodeData = async (
  subject: string,
  lectureType: string,
  batch: string,
  timeSlot: string,
  selectedDate: Date,
  currentQRNumber: number,
): Promise<{ qrData: string; nextNumber: number }> => {
  // Use cached position if available, otherwise set default position
  if (!cachedPosition) {
    cachedPosition = {
      coords: {
        latitude: 18.464262,
        longitude: 73.867924,
        accuracy: 0,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      },
      timestamp: Date.now(),
    };
  }

  // Format date as YYYY-MM-DD
  const date = selectedDate.toISOString().split("T")[0];

  // Parse time slot
  const [timeStart, timeEnd] = timeSlot.split("-");

  // Get current timestamp
  const timestamp = Date.now();

  // Format: subject_lecturetype_batch_timestart-timeend_date_qrcodeno_lat-long_timestamp
  const qrData = `${subject}_${lectureType}_${batch}_${timeStart}-${timeEnd}_${date}_${currentQRNumber}_${cachedPosition.coords.latitude}-${cachedPosition.coords.longitude}_${Math.floor(timestamp / 1000)}`;

  // Increment QR number and reset if it exceeds 150
  currentQRNumber = (currentQRNumber % 150) + 1;

  const nextNumber = (currentQRNumber % 150) + 1;
  return { qrData, nextNumber };
};

export const isQRCodeValid = (qrData: string, timestamp: number) => {
  const now = Math.floor(Date.now() / 1000);
  return now - timestamp <= 300; // 5 minutes validity
};
