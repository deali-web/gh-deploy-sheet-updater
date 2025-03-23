import * as core from "@actions/core";
import { updateGoogleSheet } from "./googleSheets";

async function run() {
  try {
    const project = core.getInput("project", { required: true }); // 프로젝트명
    const environment = core.getInput("environment", { required: true }); // 실행환경
    const message = core.getInput("message", { required: false }) || "";
    const branch =
      core.getInput("github_ref_name", { required: false }) || "배포 브랜치";
    const deployer =
      core.getInput("github_actor", { required: false }) || "배포자";
    const spreadsheetId = core.getInput("spreadsheet_id", { required: true });
    const googleSheetsCredentials = core.getInput("google_sheets_credentials", {
      required: true,
    });
    core.setSecret(googleSheetsCredentials); // credentials 마스킹 처리
    const credentials = JSON.parse(googleSheetsCredentials);

    if (!spreadsheetId) {
      throw new Error("SPREADSHEET_ID가 설정되지 않았습니다.");
    }

    if (!credentials) {
      throw new Error("GOOGLE_SHEETS_CREDENTIALS가 설정되지 않았습니다.");
    }

    await updateGoogleSheet({
      spreadsheetId,
      project,
      environment,
      branch,
      deployer,
      message,
      credentials,
    });

    core.summary.addLink(
      "웹 배포 현황 시트",
      "https://docs.google.com/spreadsheets/d/1nOstjlAkVG0hSLJbcOkePzde2c2Oa-JzGQG87wqodBM/edit?gid=0#gid=0"
    );
  } catch (error: any) {
    core.setFailed(`❌ 작업 실패: ${error.message}`); // 워크플로우에 실패 메시지 전달
  }
}

run();
