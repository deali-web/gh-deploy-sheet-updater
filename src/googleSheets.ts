import { google } from "googleapis";

interface UpdateGoogleSheetProps {
  spreadsheetId: string;
  project: string;
  environment: string;
  branch: string;
  deployer: string;
  commitMessage: string;
}

export async function updateGoogleSheet({
  spreadsheetId,
  project,
  environment,
  branch,
  deployer,
  commitMessage,
}: UpdateGoogleSheetProps) {
  const credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS || "{}");
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  const date = new Date()
    .toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })
    .replace(/\. /g, "-")
    .replace(" ", "T")
    .split(":")
    .slice(0, 2)
    .join(":");

  // 시트에서 전체 데이터를 가져와 특정 프로젝트/환경이 위치한 행을 찾음
  const range = "시트6!B:C"; // B열(프로젝트), C열(환경)
  const sheetData = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  const rows = sheetData.data.values || [];
  let targetRow = -1;
  let lastProject = "";

  for (let i = 0; i < rows.length; i++) {
    if (rows[i][0]) {
      lastProject = rows[i][0];
    }

    if (lastProject.includes(project) && rows[i][1] === environment) {
      targetRow = i + 1; // Google Sheets는 1-based index
      break;
    }
  }

  if (targetRow === -1) {
    console.error("❌ 해당 프로젝트와 실행환경을 찾을 수 없습니다.");
    return;
  }

  // 업데이트할 값 설정 (D, E, F, G 열에 해당하는 값)
  const values = [[branch, deployer, commitMessage, date]];

  // 찾은 행의 D:G 열을 업데이트
  const updateRange = `시트6!D${targetRow}:G${targetRow}`;
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: updateRange,
    valueInputOption: "RAW",
    requestBody: { values },
  });

  console.log(`✅ Google Sheets 업데이트 완료! (${updateRange})`);
}
