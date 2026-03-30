import { getInput, setSecret, setFailed, summary } from "@actions/core";
import { context, getOctokit } from "@actions/github";
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
      getInput("github_ref_name", { required: false }) ||
      process.env.GITHUB_REF_NAME ||
      "";
    const deployer =
      getInput("github_actor", { required: false }) ||
      process.env.GITHUB_ACTOR ||
      "";
    const spreadsheetId = getInput("spreadsheet_id", { required: true });
    const googleSheetsCredentials = getInput("google_sheets_credentials", {
      required: true,
    });
    setSecret(googleSheetsCredentials);
    const credentials = JSON.parse(googleSheetsCredentials);

    const token = getInput("github_token", { required: false });
    const { owner, repo } = context.repo;

    let commitMessage =
      getInput("commit_message", { required: false }) ||
      context.payload.head_commit?.message ||
      "";
    let prNumber =
      getInput("pr_number", { required: false }) ||
      context.payload.pull_request?.number?.toString() ||
      "";
    let prTitle =
      getInput("pr_title", { required: false }) ||
      context.payload.pull_request?.title ||
      "";

    // input/payload에서 못 가져온 정보를 GitHub API로 보완
    if (token && (!commitMessage || !prNumber)) {
      const octokit = getOctokit(token);

      if (!commitMessage) {
        const { data } = await octokit.rest.repos.getCommit({
          owner,
          repo,
          ref: context.sha,
        });
        commitMessage = data.commit.message || "";
      }

      if (!prNumber) {
        const { data: prs } =
          await octokit.rest.repos.listPullRequestsAssociatedWithCommit({
            owner,
            repo,
            commit_sha: context.sha,
          });
        if (prs.length > 0) {
          prNumber = prs[0].number.toString();
          prTitle = prTitle || prs[0].title;
        }
      }
    }

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
