"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const googleSheets_1 = require("./googleSheets");
async function run() {
    try {
        const project = core.getInput("project") || "프로젝트명";
        const environment = core.getInput("environment") || "실행환경";
        const branch = process.env.GITHUB_REF_NAME || "배포 브랜치"; // 실행 중인 브랜치 가져오기
        const deployer = process.env.GITHUB_ACTOR || "배포자"; // GitHub Actions 실행한 사용자 가져오기
        const spreadsheetId = process.env.SPREADSHEET_ID ||
            "1nOstjlAkVG0hSLJbcOkePzde2c2Oa-JzGQG87wqodBM";
        if (!spreadsheetId) {
            throw new Error("SPREADSHEET_ID가 설정되지 않았습니다.");
        }
        await (0, googleSheets_1.updateGoogleSheet)(spreadsheetId, project, environment, branch, deployer);
    }
    catch (error) {
        core.setFailed(`❌ 작업 실패: ${error.message}`);
    }
}
run();
