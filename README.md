# DUX Growth Report v9

Vercel용으로 분리한 DUX 성장 리포트입니다. 기존 ChatGPT Sites v8 프로젝트와 저장소를 변경하지 않습니다.

## 기능

- 교사용 성장 리포트 작성 및 브라우저 로컬 저장
- PDF 다운로드와 PWA 설치
- `POST /api/reports`를 통한 리포트 JSON 저장
- `/r/{id}` 학부모용 읽기 전용 화면
- 48자리 무작위 ID와 비공개 Vercel Blob 저장소

## Vercel 설정

1. 이 저장소를 새 Vercel 프로젝트로 가져옵니다.
2. 프로젝트의 Storage에서 Private Blob store를 생성합니다.
3. 자동 생성된 `BLOB_READ_WRITE_TOKEN`이 Production, Preview에 연결되었는지 확인합니다.
4. 새 환경변수를 적용하기 위해 한 번 재배포합니다.

기존 v8 데이터와 발행 링크는 자동 이전되지 않습니다.
