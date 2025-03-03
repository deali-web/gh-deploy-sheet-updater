import * as core from "@actions/core";
import { updateGoogleSheet } from "./googleSheets";

async function run() {
  try {
    const project = core.getInput("project");
    const environment = core.getInput("environment");
    const branch = process.env.GITHUB_REF_NAME || ""; // 실행 중인 브랜치 가져오기
    const deployer = process.env.GITHUB_ACTOR || ""; // GitHub Actions 실행한 사용자 가져오기
    const spreadsheetId = process.env.SPREADSHEET_ID || "";

    if (!spreadsheetId) {
      throw new Error("SPREADSHEET_ID가 설정되지 않았습니다.");
    }

    await updateGoogleSheet(
      spreadsheetId,
      project,
      environment,
      branch,
      deployer
    );
    core.info("✅ Google Sheets 업데이트 완료!");
  } catch (error: any) {
    core.setFailed(`❌ 작업 실패: ${error.message}`);
  }
}

run();
