// Single fixed Google Sheet URL
const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1E_kRtcamEk6lxwxEEJulmTCvDOBrCXvoSahepIMqgDc/edit?gid=0";

export async function getSheetUrlForSession(): Promise<string> {
  return SHEET_URL;
}

export function resetSessionUrl(): void {
  // No need to reset anything when using a single sheet
  return;
}
