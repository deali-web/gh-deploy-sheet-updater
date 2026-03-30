# gh-deploy-sheet-updater

웹 배포현황 시트를 업데이트해주는 커스텀 액션입니다.

워크플로우에서 `uses:`로 액션을 호출하고, 필요한 값을 `with:`로 전달합니다.

## Inputs

| Input | 필수 | 설명 |
|---|---|---|
| `project` | **O** | 배포 프로젝트명 (소매, 도매, 웹뷰, ...) |
| `environment` | **O** | 배포환경 (DEV-1, DEV-2, QA, STAGE, ...) |
| `spreadsheet_id` | **O** | 구글시트 ID |
| `google_sheets_credentials` | **O** | 서비스 사용자 인증 credentials 키 |
| `message` | | 배포 용도 (호출 워크플로우에서 연동) |
| `end_date` | | 사용기간 (호출 워크플로우에서 연동) |
| `github_ref_name` | | 배포 브랜치 (미입력 시 `GITHUB_REF_NAME`에서 자동 조회) |
| `github_actor` | | 배포자 (미입력 시 `GITHUB_ACTOR`에서 자동 조회) |
| `github_token` | | GitHub Token (기본값: `github.token` — 자동 주입) |
| `commit_message` | | 커밋 메시지 (미입력 시 GitHub API로 자동 조회) |
| `pr_number` | | PR 번호 (미입력 시 GitHub API로 자동 조회) |
| `pr_title` | | PR 제목 (미입력 시 GitHub API로 자동 조회) |

> `github_ref_name`, `github_actor`는 Actions 환경변수에서, `github_token`, `commit_message`, `pr_number`, `pr_title`은 GitHub API를 통해 자동 조회됩니다.
> Commit SHA, event name, repository, workflow run ID 등은 GitHub Actions context에서 자동으로 가져옵니다.

## 시트 컬럼 매핑

| 열 | 내용 | 비고 |
|---|---|---|
| B | 프로젝트명 | 조회용 (병합셀 대응) |
| C | 환경 | 조회용 |
| D | 브랜치 | 업데이트 |
| E | 배포자 | 업데이트 |
| F | 용도 | 업데이트 |
| G | 배포시간 | 업데이트 |
| H | 사용기간 | 업데이트 |
| I~K | 배포 workflows / 페이지 링크 / Git 저장소 | 기존 컬럼 (보존) |
| L | Commit SHA | 업데이트 (커밋 링크) |
| M | 커밋 메시지 | 업데이트 (첫 줄만) |
| N | PR 정보 | 업데이트 (PR 링크) |
| O | Actions 로그 | 업데이트 (워크플로우 링크) |
| P | 변경사항 비교 | 업데이트 (이전 배포 대비 diff 링크) |
| Q | 배포 트리거 | 업데이트 (push, pull_request 등) |

## 사용 예시

```yaml
jobs:
  update-deploy-sheet:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Update deploy sheet
        uses: deali-web/gh-deploy-sheet-updater@main
        with:
          # 필수
          project: 소매
          environment: DEV
          spreadsheet_id: ${{ vars.SPREADSHEET_ID }}
          google_sheets_credentials: ${{ secrets.GOOGLE_SHEETS_CREDENTIALS }}
          # 호출 워크플로우에서 연동
          message: ${{ github.event.inputs.message }}
          end_date: ${{ github.event.inputs.end_date }}
```

> 나머지 값(`github_ref_name`, `github_actor`, `github_token`, `commit_message`, `pr_number`, `pr_title`)은
> 자동 처리되므로 **넘기지 않아도 됩니다.** 명시적으로 넘기면 해당 값이 우선 사용됩니다.
