"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateGoogleSheet = updateGoogleSheet;
const googleapis_1 = require("googleapis");
async function updateGoogleSheet(spreadsheetId, project, environment, branch, deployer) {
    const credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS || "{}");
    const auth = new googleapis_1.google.auth.GoogleAuth({
        credentials,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const sheets = googleapis_1.google.sheets({ version: "v4", auth });
    const date = new Date().toISOString().split("T")[0];
    const values = [[project, environment, branch, deployer, date]];
    await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: "Deployments!A:E", // A: 프로젝트명, B: 환경, C: 브랜치, D: 배포자, E: 날짜
        valueInputOption: "RAW",
        insertDataOption: "INSERT_ROWS",
        requestBody: { values },
    });
    console.log("✅ Google Sheets 업데이트 완료!");
}
