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
index.html          # SPA (6탭)
css/style.css
js/app.js           # 메인 로직
js/nutrient-db.js   # 영양 DB·성장도표·철분 가이드
manifest.json       # PWA
scripts/deploy.ps1  # 배포 스크립트
wrangler.toml
```

## 최근 완료 (2026-06-10)

- 큐브 계산기 ml/g 단위 분리, 300ml÷5끼=60ml/끼 재산정
- 철분 1끼 목표 = 월령별 끼 수 반영
- 성능: debounce, Chart.js lazy load, DB 캐시
- UX: 철분 등급, 복사/인쇄, 폼 상태 localStorage

## 다음 작업 후보

- [ ] Cloudflare ↔ GitHub 자동 배포 연동
- [ ] AdSense client ID 적용 (승인 후)
- [ ] Service Worker (오프라인 PWA)

## 브랜치

- `main` — 프로덕션 (배포 대상)