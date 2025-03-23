# gh-deploy-sheet-updater

웹 배포현황 시트를 업데이트해주는 커스텀 액션입니다.

워크플로우에서 `uses:`로 액션을 호출하고, 필요한 값을 `with:`로 전달합니다:

- project: 배포 프로젝트 명입니다. (소매, 도매, 웹뷰, ...)
- environment: 배포환경 입니다. (DEV-1, DEV-2, QA, STAGE, ...)
- message: 배포 시트에 입력될 용도 메시지입니다.
- github_ref_name : 배포 브랜치 입니다.
- github_actor : 배포자입니다.
- spreadsheet_id : 구글시트 id 입니다.
- google_sheets_credentials : 구글 콘솔에서 생성한 서비스 사용자 인증 credentials 키입니다.

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
          spreadsheet_id: ${{ vars.SPREADSHEET_ID }}
          google_sheets_credentials: ${{ secrets.GOOGLE_SHEETS_CREDENTIALS }}
```
