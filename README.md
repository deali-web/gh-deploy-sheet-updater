# gh-deploy-sheet-updater

웹 배포현황 시트를 업데이트해주는 커스텀 액션입니다.

워크플로우에서 `uses:`로 액션을 호출하고, 필요한 값을 `with:`로 전달합니다:

## Inputs

| Input | 필수 | 설명 |
|---|---|---|
| `project` | O | 배포 프로젝트명 (소매, 도매, 웹뷰, ...) |
| `environment` | O | 배포환경 (DEV-1, DEV-2, QA, STAGE, ...) |
| `message` | | 배포 시트에 입력될 용도 메시지 |
| `end_date` | | 사용기간 |
| `github_ref_name` | | 배포 브랜치 |
| `github_actor` | | 배포자 |
| `commit_message` | | 커밋 메시지 (미입력 시 head_commit에서 자동 추출) |
| `pr_number` | | PR 번호 (미입력 시 pull_request 이벤트에서 자동 추출) |
| `pr_title` | | PR 제목 (미입력 시 pull_request 이벤트에서 자동 추출) |
| `spreadsheet_id` | O | 구글시트 ID |
| `google_sheets_credentials` | O | 서비스 사용자 인증 credentials 키 |

> Commit SHA, event name, repository, workflow run ID 등은 GitHub Actions context에서 자동으로 가져옵니다.

## 시트 컬럼 매핑

| 열 | 내용 | 비고 |
|---|---|---|
| B | 프로젝트명 | 조회용 (병합셀 대응) |
| C | 환경 | 조회용 |
| D | 브랜치 | 업데이트 |
| E | 배포자 | 업데이트 |
| F | 용도 | 업데이트 |
| G | 배포일시 (KST) | 업데이트 |
| H | 사용기간 | 업데이트 |
| I | Commit SHA | 업데이트 (커밋 링크) |
| J | 커밋 메시지 | 업데이트 (첫 줄만) |
| K | PR 정보 | 업데이트 (PR 링크) |
| L | Actions 로그 | 업데이트 (워크플로우 링크) |
| M | 변경사항 비교 | 업데이트 (이전 배포 대비 diff 링크) |
| N | 배포 트리거 | 업데이트 (push, pull_request 등) |

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
          project: 소매
          environment: DEV
          message: "기능 배포"
          github_ref_name: ${{ github.ref_name }}
          github_actor: ${{ github.actor }}
          commit_message: ${{ github.event.head_commit.message }}
          pr_number: ${{ github.event.pull_request.number }}
          pr_title: ${{ github.event.pull_request.title }}
          spreadsheet_id: ${{ vars.SPREADSHEET_ID }}
          google_sheets_credentials: ${{ secrets.GOOGLE_SHEETS_CREDENTIALS }}
```
