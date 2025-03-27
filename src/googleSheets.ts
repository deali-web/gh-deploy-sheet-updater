import { google } from "googleapis";

interface UpdateGoogleSheetProps {
  credentials: any;
  spreadsheetId: string;
  project: string;
  environment: string;
  branch: string;
  deployer: string;
  message: string;
}

export const updateGoogleSheet = async ({
  credentials,
  spreadsheetId,
  project,
  environment,
  branch,
  deployer,
  message,
}: UpdateGoogleSheetProps): Promise<void> => {
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth }); // 구글시트 v4 인스턴스

  const date = new Date()
    .toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })
    .replace(/\. /g, "-")
    .replace(" ", "T")
    .split(":")
    .slice(0, 2)
    .join(":");

  const SHEET_NAME = "웹 배포현황";

  // 시트에서 전체 데이터를 가져와 특정 프로젝트/환경이 위치한 행을 찾음
  const sheetData = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${SHEET_NAME}!B:C`, // B열(프로젝트), C열(환경),
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
    throw new Error(
      `입력한 프로젝트와 실행환경이 ${SHEET_NAME} 시트에 없습니다.`
    );
  }

  // 업데이트할 값 설정 (D, E, F, G 열에 해당하는 값)
  const values = [[branch, deployer, message, date]];

  // 찾은 행의 D:G 열을 업데이트
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${SHEET_NAME}!D${targetRow}:G${targetRow}`,
    valueInputOption: "USER_ENTERED", // RAW: 텍스트 그대로, USER_ENTERED: 사용자가 입력한 형태로 (수식, 날짜 포멧 적용됨)
    requestBody: { values },
  });

  console.log(`${SHEET_NAME} 업데이트 완료!`);
};
