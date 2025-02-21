# QR Code-Based Attendance Management System

## Overview
A web application for managing student attendance using dynamically generated QR codes. Each session creates a unique Google Sheet and generates QR codes that students can scan to mark their attendance.

## Features
- Dynamic QR code generation that refreshes every 5 seconds
- Automatic Google Sheets creation for each session
- Location-based validation
- Real-time attendance tracking
- Session management with customizable parameters

## Tech Stack
- Frontend: React + TypeScript + Vite
- Backend: Express.js
- UI Components: shadcn/ui
- QR Code: qrcode.react
- Styling: Tailwind CSS
- Google Sheets API for attendance records

## Project Structure
```
├── backend/
│   ├── server.js          # Express server
│   └── .env              # Backend environment variables
└── src/
    ├── components/       # React components
    │   ├── QRCodeDisplay.tsx
    │   ├── SessionControls.tsx
    │   ├── StatusPanel.tsx
    │   └── AttendanceList.tsx
    └── lib/
        └── utils/
            ├── qr.ts     # QR code generation logic
            └── sheets.ts  # Google Sheets integration
```

## Setup Instructions

1. Install Dependencies:
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
```

2. Configure Google Sheets API:
- Create a Google Cloud Project
- Enable Google Sheets API
- Create a service account and download credentials
- Add credentials to `backend/.env`:
```env
GOOGLE_CLIENT_EMAIL=your-service-account-email
GOOGLE_PRIVATE_KEY="your-private-key"
```

3. Start the Application:
```bash
# Start backend server (from backend directory)
node server.js

# Start frontend development server (from project root)
npm run dev
```

## QR Code Format
The QR codes follow this format:
```
{subject}_{lecturetype}_{batch}_{timestart}-{timeend}_{Year}_{Month}_{day}_{qr code no}_{google sheet link}
```
Example:
```
SRM_Lab_Batch1_17-18_2024_03_21_372_https://docs.google.com/spreadsheets/d/...
```

## Features in Detail

### Session Controls
- Subject selection
- Lecture type (Theory/Lab/Tutorial)
- Batch selection (for Lab/Tutorial)
- Date and time slot selection
- QR code generation count
- Session start/end controls

### QR Code Display
- Auto-refreshing QR codes (5-second intervals)
- Progress indicator for refresh timing
- Loading states

### Status Panel
- Session duration tracking
- Student count
- Current location coordinates

### Attendance List
- Real-time attendance updates
- Location validation status
- Timestamp tracking

## API Endpoints

### POST /api/spreadsheet
Creates a new Google Sheet for attendance tracking.

**Request Body:**
```json
{
  "subject": "string",
  "lectureType": "string",
  "batch": "string",
  "timeStart": "string",
  "timeEnd": "string",
  "date": "YYYY-MM-DD"
}
```

**Response:**
```json
{
  "url": "https://docs.google.com/spreadsheets/d/{spreadsheetId}/edit#gid=0"
}
```

## Contributing
Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License
This project is licensed under the MIT License - see the LICENSE file for details.
