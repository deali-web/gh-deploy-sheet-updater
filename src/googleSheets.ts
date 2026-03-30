import { google } from "googleapis";

interface UpdateGoogleSheetProps {
  credentials: any;
  spreadsheetId: string;
  project: string;
  environment: string;
  branch: string;
  deployer: string;
  message: string;
  endDate: string;
  commitSha: string;
  commitMessage: string;
  prNumber: string;
  prTitle: string;
  eventName: string;
  repository: string;
  serverUrl: string;
  runId: string;
}

export const updateGoogleSheet = async ({
  credentials,
  spreadsheetId,
  project,
  environment,
  branch,
  deployer,
  message,
  endDate,
  commitSha,
  commitMessage,
  prNumber,
  prTitle,
  eventName,
  repository,
  serverUrl,
  runId,
}: UpdateGoogleSheetProps): Promise<void> => {
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  const date = new Date()
    .toLocaleString("ko-KR", {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
    .replace(/\. /g, "-")
    .replace(".", "")
    .replace(",", "");

  const SHEET_NAME = "웹 배포현황";
  const repoUrl = `${serverUrl}/${repository}`;

  // B열(프로젝트), C열(환경) + L열(이전 배포 commit SHA)까지 읽어옴
  const sheetData = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${SHEET_NAME}!B:L`,
  });

  const rows = sheetData.data.values || [];
  let targetRow = -1;
  let lastProject = "";

  for (let i = 0; i < rows.length; i++) {
    if (rows[i][0]) {
      lastProject = rows[i][0];
    }

    if (lastProject.includes(project) && rows[i][1] === environment) {
      targetRow = i + 1;
      break;
    }
  }

  if (targetRow === -1) {
    throw new Error(
      `입력한 프로젝트와 실행환경이 ${SHEET_NAME} 시트에 없습니다.`
    );
  }

  // 이전 배포의 commit SHA (L열, index 10)
  const prevSha = rows[targetRow - 1]?.[10] || "";

  const shortSha = commitSha.substring(0, 7);
  const shaCell = commitSha
    ? `=HYPERLINK("${repoUrl}/commit/${commitSha}", "${shortSha}")`
    : "";

  const firstLineMessage = commitMessage.split("\n")[0].substring(0, 100);

  const escapedPrTitle = prTitle.replace(/"/g, '""');
  const prCell = prNumber
    ? `=HYPERLINK("${repoUrl}/pull/${prNumber}", "#${prNumber} ${escapedPrTitle}")`
    : "";

  const workflowCell = runId
    ? `=HYPERLINK("${repoUrl}/actions/runs/${runId}", "Actions 로그")`
    : "";

  const compareCell =
    prevSha && commitSha
      ? `=HYPERLINK("${repoUrl}/compare/${prevSha}...${shortSha}", "변경사항 보기")`
      : "";

  // D:H(기존 필드) + L:Q(Git 컨텍스트)를 한 번에 업데이트, I:K는 보존
  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId,
    requestBody: {
      valueInputOption: "USER_ENTERED",
      data: [
        {
          range: `${SHEET_NAME}!D${targetRow}:H${targetRow}`,
          values: [[branch, deployer, message, date, endDate]],
        },
        {
          range: `${SHEET_NAME}!L${targetRow}:Q${targetRow}`,
          values: [
            [shaCell, firstLineMessage, prCell, workflowCell, compareCell, eventName],
          ],
        },
      ],
    },
  });

  console.log(`${SHEET_NAME} 업데이트 완료!`);
};
