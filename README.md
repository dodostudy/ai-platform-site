# 행복플러스 분당발전본부 안전관리실 AI 플랫폼

> 안전을 위한 인공지능 서비스 포털 - AI 기반 안전관리 업무 지원 플랫폼

## 📋 개요

행복플러스 분당발전본부 안전관리실에서 개발한 AI 서비스들을 임직원들이 한 곳에서 쉽게 접근할 수 있도록 구축한 포털 사이트입니다.

- **GPTs 안전누리**: ChatGPT 기반 위험성평가 자동화 도구
- **노트북LM**: Google NotebookLM 기반 안전관리 지식베이스
- **Guidde 교육자료**: 각 서비스 활용법 동영상 및 매뉴얼

## 🚀 기능

- ✨ 반응형 웹 디자인 (모바일/태블릿/데스크톱)
- 🎯 직관적인 AI 서비스 접근 (클릭 한 번으로 이동)
- 📚 교육 자료 통합 (Guidde 링크)
- 🎨 남동발전 브랜드 컬러 적용 (블루/화이트 테마)
- ⚡ 가볍고 빠른 로딩 (순수 HTML/CSS/JavaScript)
- 🔍 SEO 최적화

## 📁 프로젝트 구조

```
ai-platform-site/
├── index.html              # 메인 페이지 (SPA)
├── css/
│   └── style.css           # 커스텀 CSS 스타일
├── js/
│   └── main.js             # JavaScript 인터랙션
├── assets/                 # 이미지, 아이콘 디렉토리
│   ├── images/
│   └── icons/
├── .gitignore
├── README.md               # 이 파일
└── .git/                   # Git 저장소
```

## 🛠 기술 스택

- **HTML5**: 시맨틱 마크업
- **CSS3**: TailwindCSS CDN (유틸리티 기반 스타일링)
- **JavaScript**: Vanilla JS (순수 JavaScript, 라이브러리 없음)
- **폰트**: Google Fonts (Inter)

## 🏠 섹션 구성

| 섹션 | 설명 |
|------|------|
| **Hero** | 조직소개, 슬로건, CTA 버튼 |
| **소개** | 안전관리실 역할, 플랫폼 현황 |
| **AI 서비스** | GPTs 안전누리, 노트북LM 카드 (외부 링크) |
| **교육자료** | Guidde 교육 영상 링크 |
| **이용안내** | 4단계 사용 가이드 + 주의사항 |
| **Footer** | 바로가기 링크, 외부 서비스 |

## 🔗 주요 링크

### AI 서비스
- [GPTs 안전누리](https://chatgpt.com/g/g-68d9ea4687d881919dc5d8c7aa65c776-bundang-anjeonnuri-koen-for-wiheomseongpyeongga) - ChatGPT 기반 위험성평가
- [노트북LM](https://notebooklm.google.com/notebook/2a65cd74-5062-411a-8eaa-057953920304) - 안전관리 지식베이스

### 교육자료
- [안전누리 활용법](https://app.guidde.com/share/playbooks/hr8GgLUK3uJ3MgnkuecH9V?origin=WsIqNikVeiZSE6b1baGljoCN5EH3) - 동영상 & 문서
- [노트북LM 활용법](https://app.guidde.com/share/playbooks/hM65mMqte8n93XRznKvLjk?origin=WsIqNikVeiZSE6b1baGljoCN5EH3) - 동영상 & 문서

## 💻 개발 명령어

### 로컬 서버 실행

```bash
cd /Users/kimjihwan/workspace/ai-platform-site
python3 -m http.server 8000
```

방문 주소: `http://localhost:8000`

## ✅ 체크리스트

배포 전 확인사항:

- [x] 네비게이션 모바일 햄버거 메뉴 동작
- [x] 각 섹션 앵커 링크 스크롤
- [x] AI 서비스 카드 외부 링크 정상 작동
- [x] Guidde 교육 자료 링크 정상 작동
- [x] 모바일 반응형 레이아웃 확인
- [x] IntersectionObserver 섹션 애니메이션
- [x] 모든 외부 링크 `target="_blank"` 처리

## 📊 성능 최적화

- TailwindCSS CDN Play 모드로 불필요한 CSS 자동 제거
- Vanilla JS 사용으로 번들 크기 최소화
- Google Fonts Inter는 필수 가중치만 로드 (300, 400, 500, 600, 700, 800)
- IntersectionObserver로 섹션 애니메이션 성능 최적화

## 🎨 디자인 특징

- **색상 팔레트**:
  - Primary: #1e3a8a (kepco-blue)
  - Mid: #1d4ed8 (kepco-mid)
  - Light: #2563eb (kepco-light)
  - Secondary: 인디고/퍼플 (노트북LM용)

- **애니메이션**: fadeInUp, slideInLeft, slideInRight 키프레임
- **다크모드**: 지원 안 함 (공공기관 라이트 전용)

## 📱 반응형 브레이크포인트

| 기기 | 너비 | 특징 |
|------|------|------|
| 모바일 | < 640px | 햄버거 메뉴, 1열 그리드 |
| 태블릿 | 640px ~ 1024px | 2열 그리드 |
| 데스크톱 | > 1024px | 풀 너비, 4단계 스텝 카드 |

## 🔐 접근성 (A11y)

- 시맨틱 HTML5 태그 사용
- 모든 이미지에 적절한 `alt` 텍스트
- 충분한 색상 대비 (WCAG AA 기준)
- 키보드 네비게이션 지원
- Focus 상태 시각적 표시

## 📝 Git 커밋 규칙

```
<type>: <description>

<body (optional)>
<footer (optional)>
```

**Type 종류:**
- `feat`: 새로운 기능
- `fix`: 버그 수정
- `style`: 스타일 개선
- `refactor`: 코드 리팩토링
- `docs`: 문서
- `chore`: 유지보수

## 🤝 기여

내부 개발 프로젝트이므로 변경사항은 팀 리더와 협의 후 진행해주세요.

## 📧 문의

- **안전관리실**: [내부 연락처]
- **개발 담당**: Kim Jihwan

## 📄 라이선스

Internal Project - 행복플러스 분당발전본부 (2026)

---

**마지막 수정**: 2026-03-26
