import { google } from "googleapis";

export async function updateGoogleSheet(
  spreadsheetId: string,
  project: string,
  environment: string,
  branch: string,
  deployer: string
) {
  const credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS || "{}");
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  const date = new Date().toISOString().split("T")[0];

  const values = [[project, environment, branch, deployer, date]];

  /**
   * append props
   * @see https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/append
   * spreadsheetId: 업데이트할 스프레드시트 ID
   * range: 업데이트할 시트 이름과 업데이트할 범위 ("SheetName!A1:E")
   * valueInputOption: 입력 옵션 (RAW: 값 그대로, USER_ENTERED: 사용자가 입력한 형태)
   * insertDataOption: 데이터 삽입 옵션 (INSERT_ROWS: 새로운 행에 데이터 추가, OVERWRITE: 기존 데이터 덮어쓰기)
   * requestBody.value: 업데이트할 데이터 [[row1], [row2], ...]
   */
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "시트6!A:E", // A: 프로젝트명, B: 환경, C: 브랜치, D: 배포자, E: 날짜
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values },
  });

  console.log("✅ Google Sheets 업데이트 완료!");
}
