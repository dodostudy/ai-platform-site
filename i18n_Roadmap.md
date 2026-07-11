# AI 플랫폼 사이트 한/영 다국어(i18n) 로드맵

> 목표: 안전관리실 AI 플랫폼 사이트(`ai-platform-site`)에 **한국어 / English** 전환 버튼을 추가하고,
> 화면의 모든 UI 텍스트를 영어로 제공한다. SIF 사이트의 검증된 i18n 런타임을 이식하되,
> **데이터(DB·범주값·서술문)가 없는 순수 정적 사이트**이므로 UI 번역 부분만 경량화해 적용한다.

## 확정된 방향 (2026-07-11)

| 항목 | 결정 |
|---|---|
| 참조 구현 | SIF `sif_Program/js/i18n.js` (룩업 계층 + `translateDOM` 자동치환) |
| 번역 범위 | **전체 UI 텍스트** — 네비 · Hero · 소개 · AI서비스(4카드) · 교육자료 · 이용안내 · 푸터 + `<title>`/`<meta>`/속성 |
| 저장 방식 | `localStorage['platform-lang']` (SIF의 `sif-lang`과 키 분리) 저장 후 `location.reload()` |
| 전담 에이전트 | `.claude/agents/platform-i18n-keeper.md` |

---

## 1. 현행 구조 분석 (SIF와의 차이)

| 항목 | SIF 프로그램 | AI 플랫폼 사이트 |
|---|---|---|
| 페이지 | 대시보드 + 6개 서브페이지 | **단일 페이지** `index.html`(648줄) + 빈 `con.html` |
| 데이터 | `db.json` 2,574건 + 범주값 + 서술문 | **없음 (순수 정적 UI 텍스트)** |
| 필요 API | `t` + `tCat` + `tText` + `overlayDb` + 번역 파이프라인 | **`t` + `translateDOM`만** |
| 번역 규모 | UI + 범주 298 + 서술 5,347문단 | **UI 문구 약 70개** |
| CDN 스택 | TailwindCSS/Chart.js/PapaParse | TailwindCSS (SIF와 호환) |

→ **결론**: SIF의 3-tier 중 데이터 관련(`tCat`/`tText`/`db_en.json`/`glossary_en.json`/스크립트)은 전부 불필요.
`t()` UI 사전 + `translateDOM()` 텍스트노드 자동치환 + 언어 토글 버튼, 이 세 가지만 이식하면 된다.

## 2. 타깃 아키텍처

### 2.1 파일 레이아웃
```
ai-platform-site/
  index.html                  # 한글 원본(단일 소스) — 지우지 않음, 표시할 때만 영어 치환
  js/
    i18n.js                   # (신규) SIF i18n.js에서 DB 메서드 제거한 경량판
    main.js                   # (수정) DOMContentLoaded에서 I18n.init→refresh 배선
  data/
    i18n/
      ui_en.json              # (신규) UI 문구 사전 { "소개":"About", ... } — 한글 원문이 키
  .claude/agents/
    platform-i18n-keeper.md   # (완료) i18n 전담 에이전트
```

### 2.2 런타임 모듈 `js/i18n.js` (경량판)
SIF `i18n.js`에서 이식 후 제거/유지:
```
유지: lang / init() / t(ko) / cases(n) / setLang() / translateDOM() /
      _buildFlat(간소화: glossary 병합부 제거) / _numUnits() / refresh() /
      installAutoTranslate(MutationObserver) / data-en 속성 처리 / <title> 번역
제거: tCat() / tText() / overlayDb() / _glossary / _dbText / glossary·db_en 로드
변경: localStorage 키 'sif-lang' → 'platform-lang', 리소스 경로 ui_en.json 하나만 로드
```

### 2.3 언어 토글 UI
- 위치: **sticky 네비 우측**, 데스크톱 메뉴(`이용안내`) 오른쪽에 `한국어 | EN` 세그먼트 버튼 인라인 배치.
  (SIF는 body 고정이었으나 이 사이트는 상단 sticky 네비가 있어 네비 내부가 자연스럽다.)
- **모바일 메뉴**에도 동일 토글 노출.
- 클릭 → `I18n.setLang('ko'|'en')`. 현재 언어 하이라이트.

## 3. 번역 대상 인벤토리 (실측)

| 영역 | 주요 문구 | 처리 방식 |
|---|---|---|
| `<head>` | `<title>`, meta description/keywords/author, og:title/description | 사전 키 + `init()` |
| 네비/로고 | 행복플러스 분당발전본부, 안전관리실 AI 플랫폼, 소개, AI 서비스, 교육자료, 이용안내 | 사전 키 (텍스트노드) |
| Hero | 배지, 안전관리실/AI 플랫폼, 슬로건, 부제(산문·`<br>`), CTA 2개 | 산문은 `data-en`, 나머지 사전 키 |
| 소개 | 우리의 역할, 문단 2개(산문), 핵심역량 4개(`[GPTs]/[LM]/[WEB]` 접두), 플랫폼 현황, 통계카드 4개(AI 서비스/SIF 재해 데이터/무료·이용료/기술공유·협력기업) | 산문 `data-en`, 나머지 사전 키 |
| AI 서비스 | 섹션 제목·부제, 카드 4개 각각(배지 2개·제목·설명 산문·불릿 3개·버튼) + 오버레이 라벨(GPTs/NotebookLM/법규검토 AI/SIF 데이터) | 설명 산문 `data-en`, 나머지 사전 키 |
| 교육자료 | 섹션 제목·부제, 카드 2개(제목·설명·"Guidde에서 보기 →") | 사전 키 |
| 이용안내 | 섹션 제목·부제, 스텝 4개(제목·설명), 주의사항 박스(제목·불릿 3개) | 사전 키 |
| 푸터 | 조직정보 3줄, 바로가기 4링크, AI서비스 링크 4개, 저작권 | 사전 키 |

> 이미 영어인 섹션 배지(`ABOUT`/`AI SERVICES`/`TRAINING`/`HOW TO USE`)와 URL은 대상 아님.
> **주의(gotcha)**: 같은 뜻이지만 표기가 달라 **키가 분리되는** 항목 —
> 네비 `교육자료`(공백없음) vs 섹션/푸터 `교육 자료`(공백있음), 네비/푸터 `이용안내` vs 섹션 `사용 안내`. 각각 사전에 등록.

## 4. 실행 단계 (Phases)

- **Phase 0 — 스캐폴딩** ✅ 완료 (커밋 `886d23c`): `js/i18n.js` 경량 이식(DB 메서드 제거, 키 `platform-lang`), 빈 `data/i18n/ui_en.json`, `index.html <head>`에 스크립트 로드, 토글 버튼(네비 우측, 데스크톱·모바일 공통), `main.js` 초기화 배선. KO 무영향 + EN 토글 전환 동작 검증 완료.
- **Phase 1 — UI 사전 작성 & 배선** ✅ 완료 (커밋 `f28e8d4`): §3 인벤토리 전량(81키) → `ui_en.json`(한글 원문=키). 서식 있는 산문 7곳(Hero 부제·소개 2문단·카드 4설명)에 `data-en` 속성. `<title>`·`<html lang>` 전환 배선. 헤드리스 Chrome EN 전체페이지 **한글 잔존 0**, KO 회귀 무영향 확인.
- **Phase 2 — 검증 & 마감** ✅ 대부분 완료: 헤드리스 KO/EN 전체 스크린샷 대조(한글 0)·모바일 토글 배치 확인. 모바일 가로 잘림은 **i18n과 무관한 기존 현상**(원본 main에서도 동일 — 헤드리스 에뮬레이션 아티팩트). ⏳ 잔여: ① 조직명 영문 공식표기 확정(잠정 KOEN Bundang), ② 실기기 모바일 확인, ③ GitHub Pages 배포(사용자 승인 후).

## 5. 검증 기준

1. **문법**: `node --check js/i18n.js`, `python3 -c "import json;json.load(open('data/i18n/ui_en.json'))"`
2. **한글 잔존 0**: EN 모드 스크린샷에서 화면 노출 한글이 한 글자도 없어야 함(브랜드 고유명사 예외는 §6 결정 따름).
3. **KO 회귀**: KO 모드는 원문 100% 보존, EN만 전환.
4. **반응형**: 데스크톱/모바일 양쪽에서 토글 동작 + 레이아웃 정상.

## 6. 번역 방침 / 결정 필요 항목

- **도메인 용어 일관성** (SIF 용어집과 통일): 위험성평가 Risk Assessment · 안전관리 Safety Management · 안전관리실 Safety Management Office · 교육자료 Training Materials · 이용안내 User Guide · 위험요인 Hazard · 감소대책 Risk Reduction Measure · 산업안전보건법 OSH Act.
- **결정 ① (확정)** — 서비스 브랜드명은 **로마자 유지**: `안전누리`→Anjeonnuri, `바로미`→Baromi. 고유명사는 로마자로 보존하고 서비스 설명만 영어로. 예: `GPTs, 안전누리`→`GPTs, Anjeonnuri`.
- **결정 ② (확정)** — 조직명 `행복플러스 분당발전본부`는 **영문 공식표기** 사용. 잠정값 `KOEN Bundang Power Generation HQ` (한국남동발전 분당발전본부). ⚠️ Phase 1에서 **공식 영문 명칭을 확인**해 확정(사용자 제공 시 그 값 우선). `행복플러스`(KOEN 브랜드 슬로건)는 로마자/공식 브랜드 표기 여부 함께 확정.
- **저작권/브랜드**: 로고 이미지는 그대로 유지. 저작권 문구(© 2026 …)의 조직명은 결정 ②를 따름.

## 7. 다음 액션

1. §6 결정 ①②를 확정한다.
2. `platform-i18n-keeper` 에이전트로 **Phase 0(스캐폴딩)** 착수 → KO 무영향 확인.
3. Phase 1 사전 작성 → Phase 2 스크린샷 검증 → 배포.
