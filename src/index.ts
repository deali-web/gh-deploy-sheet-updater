import { getInput, setSecret, setFailed, summary } from "@actions/core";
import { context } from "@actions/github";
import { updateGoogleSheet } from "./googleSheets";

async function run() {
  try {
    const project = getInput("project", { required: true });
    const environment = (
      getInput("environment", { required: false }) || "PROD"
    ).toUpperCase();
    const message = getInput("message", { required: false }) || "";
    const endDate = getInput("end_date", { required: false }) || "";
    const branch =
      getInput("github_ref_name", { required: false }) || "배포 브랜치";
    const deployer = getInput("github_actor", { required: false }) || "배포자";
    const spreadsheetId = getInput("spreadsheet_id", { required: true });
    const googleSheetsCredentials = getInput("google_sheets_credentials", {
      required: true,
    });
    setSecret(googleSheetsCredentials);
    const credentials = JSON.parse(googleSheetsCredentials);

    const commitMessage =
      getInput("commit_message", { required: false }) ||
      context.payload.head_commit?.message ||
      "";
    const prNumber =
      getInput("pr_number", { required: false }) ||
      context.payload.pull_request?.number?.toString() ||
      "";
    const prTitle =
      getInput("pr_title", { required: false }) ||
      context.payload.pull_request?.title ||
      "";

    const { owner, repo } = context.repo;

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
      endDate,
      credentials,
      commitSha: context.sha,
      commitMessage,
      prNumber,
      prTitle,
      eventName: context.eventName,
      repository: `${owner}/${repo}`,
      serverUrl: context.serverUrl,
      runId: context.runId.toString(),
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
    setFailed(`❌ 작업 실패: ${error.message}`);
  }
}

run();
