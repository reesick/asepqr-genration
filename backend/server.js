const express = require("express");
const cors = require("cors");
const { google } = require("googleapis");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/drive",
];

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  },
  scopes: SCOPES,
});

const sheets = google.sheets({ version: "v4", auth });
const drive = google.drive({ version: "v3", auth });

// Endpoint to rename a sheet
app.post("/api/rename-sheet", async (req, res) => {
  try {
    const { spreadsheetId, newTitle } = req.body;

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            updateSpreadsheetProperties: {
              properties: {
                title: newTitle,
              },
              fields: "title",
            },
          },
        ],
      },
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Error renaming sheet:", error);
    res.status(500).json({ error: "Failed to rename sheet" });
  }
});

app.post("/api/spreadsheet", async (req, res) => {
  try {
    const { subject, lectureType, batch, timeStart, timeEnd, date } = req.body;
    const [year, month, day] = date.split("-");

    // Create the spreadsheet
    const spreadsheet = await sheets.spreadsheets.create({
      requestBody: {
        properties: {
          title: `${subject}_${lectureType}_${batch}_${timeStart}-${timeEnd}_${year}_${month}_${day}`,
        },
        sheets: [
          {
            properties: {
              title: "Attendance",
              gridProperties: {
                rowCount: 1000,
                columnCount: 6,
              },
            },
            data: [
              {
                startRow: 0,
                startColumn: 0,
                rowData: [
                  {
                    values: [
                      { userEnteredValue: { stringValue: "Student ID" } },
                      { userEnteredValue: { stringValue: "Student Name" } },
                      { userEnteredValue: { stringValue: "Timestamp" } },
                      { userEnteredValue: { stringValue: "Location Valid" } },
                      { userEnteredValue: { stringValue: "Latitude" } },
                      { userEnteredValue: { stringValue: "Longitude" } },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    });

    // Format the header row
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: spreadsheet.data.spreadsheetId,
      requestBody: {
        requests: [
          {
            repeatCell: {
              range: {
                startRowIndex: 0,
                endRowIndex: 1,
                startColumnIndex: 0,
                endColumnIndex: 6,
              },
              cell: {
                userEnteredFormat: {
                  backgroundColor: { red: 0.2, green: 0.2, blue: 0.2 },
                  textFormat: {
                    bold: true,
                    foregroundColor: { red: 1, green: 1, blue: 1 },
                  },
                },
              },
              fields: "userEnteredFormat(backgroundColor,textFormat)",
            },
          },
        ],
      },
    });

    // Make the spreadsheet publicly accessible with view-only access
    await drive.permissions.create({
      fileId: spreadsheet.data.spreadsheetId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheet.data.spreadsheetId}/edit#gid=0`;
    res.json({ url: spreadsheetUrl });
  } catch (error) {
    console.error("Error creating spreadsheet:", error);
    res.status(500).json({ error: "Failed to create spreadsheet" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
