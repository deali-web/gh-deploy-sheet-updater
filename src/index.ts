import { getInput, setSecret, setFailed, summary } from "@actions/core";
import { updateGoogleSheet } from "./googleSheets";

async function run() {
  try {
    const project = getInput("project", { required: true }); // 프로젝트명
    const environment = getInput("environment", { required: true }); // 실행환경
    const message = getInput("message", { required: false }) || "";
    const branch =
      getInput("github_ref_name", { required: false }) || "배포 브랜치";
    const deployer = getInput("github_actor", { required: false }) || "배포자";
    const spreadsheetId = getInput("spreadsheet_id", { required: true });
    const googleSheetsCredentials = getInput("google_sheets_credentials", {
      required: true,
    });
    setSecret(googleSheetsCredentials); // credentials 마스킹 처리
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

    const deployedAt = new Date().toLocaleString("ko-KR", {
      timeZone: "Asia/Seoul",
    });

    await summary
      .addHeading("웹 배포현황 시트 업데이트 성공")
      .addRaw(
        `[${project}] ${environment} : ${branch} ${message} ${deployedAt}\n\n`
      )
      .addLink(
        "웹 배포현황",
        "https://docs.google.com/spreadsheets/d/1nOstjlAkVG0hSLJbcOkePzde2c2Oa-JzGQG87wqodBM/edit?gid=0#gid=0"
      )
      .write();
  } catch (error: any) {
    setFailed(`❌ 작업 실패: ${error.message}`); // 워크플로우에 실패 메시지 전달
  }
}

run();
