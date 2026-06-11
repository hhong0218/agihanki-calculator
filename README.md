# 아기한끼 계산기 (BabyMeal Calculator)

이유식 1끼 분량·영양·철분·성장곡선 정적 SPA. Cloudflare Pages 배포.

## 링크

| 항목 | URL |
|------|-----|
| 라이브 | https://agihanki-calculator.pages.dev |
| GitHub | https://github.com/hhong0218/agihanki-calculator |

## 다른 PC에서 이어하기

```bash
git clone https://github.com/hhong0218/agihanki-calculator.git
cd agihanki-calculator
```

로컬 미리보기 (정적 파일):

```bash
npx serve .
# 또는 index.html을 브라우저로 직접 열기
```

## 배포 (Cloudflare Pages)

**자동 배포**: main에 push하면 GitHub Actions가 자동 배포합니다 (`.github/workflows/deploy.yml`).
레포 Secrets에 `CLOUDFLARE_API_TOKEN`(필수)과 `CLOUDFLARE_ACCOUNT_ID`가 등록되어 있어야 합니다.

수동 배포:

```powershell
# Windows
.\scripts\deploy.ps1
```

```bash
# macOS/Linux
npx wrangler pages deploy . --project-name=agihanki-calculator --branch=main
```

사전 요건: `npx wrangler login` (Cloudflare 계정 연동)

## 프로젝트 구조

```
index.html          # SPA (6탭) — 정적 FAQ + FAQPage/WebApplication/HowTo JSON-LD
guide/              # SEO 가이드 3편 (철분/큐브/분량) — 인앱 데이터 기반
privacy.html        # 개인정보처리방침 (AdSense 고지 포함)
terms.html          # 이용약관 (YMYL 면책 특약)
404.html            # soft-404 방지
ads.txt             # AdSense pub ID placeholder
sw.js               # Service Worker (network-first + 오프라인 폴백)
css/style.css
js/app.js           # 메인 로직
js/nutrient-db.js   # 영양 DB·성장도표·철분 가이드
manifest.json       # PWA
og-image.png        # 1200×630 공유 썸네일
scripts/deploy.ps1  # 수동 배포 스크립트
.github/workflows/deploy.yml  # 자동 배포 (checkout@v6 + wrangler-action@v4)
```

## 최근 완료 (2026-06-11, 3차 — YMYL 수치·출처 검수)

- **철분 기준 교정 (중대)**: 기존 0.27/11/7mg는 미국 NIH 수치였음 → 2025 한국인 영양소 섭취기준(보건복지부·한국영양학회) 공식 요약표에서 직접 추출한 0.3(충분)/6/6mg(권장)으로 교체. 비표준 "체중×1.0mg 보정" 제거. 1끼 45% 배분은 "자체 가정"으로 명시
- **출처 정정**: 국가표준식품성분표 발행기관 식약처 → 농촌진흥청 국립농업과학원(제10개정) — 사이트 전체 7곳
- 단백질 권장 15/20g(공식값), 19~24개월 열량 1,100→900kcal, "정확 계산" 과장 표현 완화, 프리셋 알레르기 주의 고지 추가
- 검증: KDRI 계산 시뮬 4케이스 PASS, FAQ 정적=JSON-LD 일치, 콘솔 에러 0

## 이전 완료 (2026-06-10, 2차)

- fix: 최근 계산 기록 오염(타이핑·페이지 로드마다 저장) → 명시 액션 시에만 저장 + 중복 병합
- SEO: FAQ 정적 HTML화(+FAQPage JSON-LD를 head로), 가이드 3편 신설, sitemap 6 URL 확장, og-image
- AdSense 준비: privacy/terms/404/ads.txt, 문의 이메일(hhong0218@gmail.com), 패밀리 푸터(무료 도구 5종 크로스링크)
- PWA: Service Worker(오프라인 지원, network-first라 배포 후 stale 없음)
- 배포: GitHub Actions 자동 배포 워크플로 추가

## 다음 작업 후보

- [ ] `CLOUDFLARE_API_TOKEN` 레포 시크릿 등록 → Actions 자동 배포 활성화 (ACCOUNT_ID는 등록됨)
- [ ] 네이버 서치어드바이저·구글 서치콘솔 등록 + sitemap 제출
- [ ] AdSense 신청(콘텐츠·필수 페이지 충족됨) → 승인 후 ads.txt·index.html 주석의 pub ID 교체
- [ ] Cloudflare 오타 고아 프로젝트 `agihanki-calculato` 삭제 검토

## 브랜치

- `main` — 프로덕션 (배포 대상)
