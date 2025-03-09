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
  // const credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS || "{}");

  const credentials = {
    type: "service_account",
    project_id: "ssm-pc-web-dev-1718859559166",
    private_key_id: "e93be5b663a6a269cb81c2b192b240ba58dab149",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDJMyA/u/tK3Cqw\nSscGdBbepPD1yxnneSUdt6GOBtMqxnNheXrA15f+8s65o9s3gtD6GuiHkWLQERaT\nVD8AGDj0NGTPAXOpNBBOSIUh247WvqjTsIIxKK9QJR56GcerlaFUYcdmSSJ+i7ks\nFqfE6/KScIUShiunkjXBlCF/dXKdhv2EGKBWs7eZ4BY5moYi3/7ltedkmHq1sNK8\nijQwG3HbAVBJNSuqf6joNFdhqlPKwkybQtFxjLXQEpzB+acTiw+pw0ZtVBMv9mRW\nTZM40dAm6Dg1VrRzlbswd45HQY8gg0QS9zcHR62mbrqrMbKmcbbZVgjwgXsYh5yx\nt8URxGMfAgMBAAECggEAExld1dRVOe7QGeph8zcLlrinQQXgdcyBB/hPBzRBpmgD\n5ZG1DopIskRqoveuzxmwFxXSffqrRnS2JRJ/D9YSI1MNQL3ytJytxuiebq+GDdTi\nd4SOufY9PMk77Tug7HpTQAyEyQJnRQZOySR2FOeQSsi7RnNjFdCiIWKbksWw4CAY\naIVGmurSPfJoTU1vNttHDZHqXvqDPlviEx57B5qH/Np7s9Oi1BShyBkc54TF3dDm\n5wMWV4Fj7s72HYdNe8rAMe6xA7fbfeHSp+bLIRP22XeF+aZCTHV3E+6gZnPcLGgD\neSGL0wufYJ8E0QlHdyR1RPoNEtgPeAeXqcLqwtf93QKBgQDle0Ug3YA6WLdxqgEt\nDt0NEDYPUzNPKgMprNFPWR+I1dOdNuRhxhNI/gbI7p8zKjbvHTdmn59E/QtzKxiw\nPuaJH7ASIokwFcxw5cilbnqtWKyH+F40asu1TydKXORWHhT678eXQHsu+giFlngL\nb3wGdOHLXefYENFttdEBVU6ePQKBgQDgczKhlef6yOfq56EeI76qxkS1D4cVBzm8\nt5x+kLRXDYM2oqmCFzJvO82RRsXNMvOKbnhFfkmqukmdoB7Kk7LW4HsKjKM1xOw5\ngGl7DKLCNY1KezF+qtxThvlwbfNcC2MMxYO1c69nsedkmZLSRjx/cMPnj2KLft2H\nT6+hNuXYiwKBgFYoyDWktGYztPxqFfLy56/l7EYouNT6MyHMjvG5xos7rS4T0/+Z\nvNfk+GssnH07VlDEqW5QdB4U292ryqMxmqDVUugcK2HwbUfeHk1ug4TeDDko2UXY\n6w7x3xCee+SRetMUf92cCiQDIHv3mK7CdtB9xeDzKv8GoXsNjqFvhAsJAoGAOLwl\n0j6IUxYxuWkviuTSL2zKtVHlfWVELPXkswF09IRP5KGdY2rlrsRZJB3Vphb5BMcD\n090mVeec8CEnZ2GKVVKNB4+hOdg7NhXFk/sPsTPEMU2Op0wdQWfe6ZKBb4TZVsMe\nleFWN0n7CazgNhLW/AfPHVtbN5Or/6Ye6Qttch0CgYAo0/3dY56FzUZGf00Ql37J\nbFdPZyTJxC5GDxPL6bp/U/rLa4zU680JPBhj4yiGNiYSVKv01wmgiFmryCxqsJuq\nzzt/IH3HNm8TiPvaLK9weJ5VasxMKkBtZvOrPXp4fuJTFjTVVhbMaIhp+hDcCPcD\nsxxGfgaQM8p2khqW1dN6vw==\n-----END PRIVATE KEY-----\n",
    client_email: "web-fe@ssm-pc-web-dev-1718859559166.iam.gserviceaccount.com",
    client_id: "110671227614435123842",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
      "https://www.googleapis.com/robot/v1/metadata/x509/web-fe%40ssm-pc-web-dev-1718859559166.iam.gserviceaccount.com",
    universe_domain: "googleapis.com",
  };
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
