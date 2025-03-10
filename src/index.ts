import * as core from "@actions/core";
import { updateGoogleSheet } from "./googleSheets";

async function run() {
  try {
    const project = core.getInput("project") || "프로젝트명";
    const environment = core.getInput("environment") || "실행환경";
    const commitMessage = core.getInput("commit_message") || "커밋 메시지";
    const branch = process.env.GITHUB_REF_NAME || "배포 브랜치";
    const deployer = process.env.GITHUB_ACTOR || "배포자";
    const spreadsheetId =
      process.env.SPREADSHEET_ID ||
      "1nOstjlAkVG0hSLJbcOkePzde2c2Oa-JzGQG87wqodBM";

    if (!spreadsheetId) {
      throw new Error("SPREADSHEET_ID가 설정되지 않았습니다.");
    }

    await updateGoogleSheet({
      spreadsheetId,
      project,
      environment,
      branch,
      deployer,
      commitMessage,
    });
  } catch (error: any) {
    core.setFailed(`❌ 작업 실패: ${error.message}`);
  }
}

run();
