# Claude PPT Skill

Claude Code 스킬 -- 유튜브 스크립트를 PPT 슬라이드(MP4)로 자동 변환합니다.

## 주요 기능

- **8가지 디자인 테마**: Tech Precision, Neon Flux, Editorial Authority, Organic Warm, Luxury Minimal, Brutalist Raw, Retro Analog, Playful Pop
- **9-Grid 텍스트 배치**: 3x3 그리드 기반 텍스트 위치 제어 (좌상단~우하단 9개 포지션)
- **Remotion MP4 렌더링**: 1920x1080, 30fps, 슬라이드당 5초 애니메이션
- **YouTube 스타일 미리보기**: 브라우저에서 슬라이드를 YouTube 플레이어 프레임 안에서 확인
- **인라인 편집**: 제목, 포인트, 색상, 위치를 실시간 편집
- **이미지 배경 지원**: URL 직접 입력 또는 DALL-E/Unsplash 프롬프트
- **JSON 내보내기**: 편집 결과를 Claude Code에 바로 붙여넣기

## 7가지 슬라이드 템플릿

| 템플릿 | 용도 | 설명 |
|--------|------|------|
| **title-default** | 제목 슬라이드 | 중앙 정렬 제목 + 부제목. 첫/끝 슬라이드에 사용 |
| **list-default** | 불릿 목록 | 제목 + 순차 페이드인 불릿 포인트 |
| **chart-default** | 차트/데이터 | 제목 + 데이터 시각화 영역 |
| **comparison-default** | 비교 | 좌우 2컬럼 비교 레이아웃 |
| **quote-default** | 인용문 | 큰 인용문 + 출처 (강조색 배경) |
| **image-default** | 이미지 중심 | 이미지 배경 + 오버레이 텍스트 |
| **timeline-default** | 타임라인 | 순서/단계별 흐름 (번호 매기기) |

## 설치

### 방법 1: install.sh (권장)

```bash
git clone https://github.com/YOUR_USERNAME/claude-ppt-skill /tmp/claude-ppt-skill
cd your-project
bash /tmp/claude-ppt-skill/install.sh
rm -rf /tmp/claude-ppt-skill
```

### 방법 2: 수동 복사

```bash
git clone https://github.com/YOUR_USERNAME/claude-ppt-skill /tmp/claude-ppt-skill

# 스킬 복사
cp -r /tmp/claude-ppt-skill/.claude/skills/ppt .claude/skills/

# 미리보기 복사 (선택)
cp /tmp/claude-ppt-skill/assets/ppt-preview.html .claude/

# 템플릿 복사
mkdir -p .claude/skills/ppt/templates/remotion/slides
cp /tmp/claude-ppt-skill/templates/slide-templates.json .claude/skills/ppt/templates/
cp -r /tmp/claude-ppt-skill/templates/remotion/* .claude/skills/ppt/templates/remotion/

rm -rf /tmp/claude-ppt-skill
```

## 사용법

### Claude Code에서

```
PPT 만들어줘
```

또는

```
이 스크립트를 슬라이드로 변환해줘. 테마는 Neon Flux.
```

### 실행 흐름

```
STEP 1 → 스크립트 입력 (텍스트 또는 파일)
STEP 2 → 테마 선택 (8가지 중 1개)
STEP 3 → AI 분할 (GPT-4o-mini → 슬라이드 JSON)
STEP 4 → 미리보기 편집 (YouTube 프레임 + 9-grid + 인라인 편집)
STEP 5 → Remotion 렌더링 (npx remotion render → MP4)
STEP 6 → 내보내기 (MP4 파일 출력)
```

### ppt-preview.html 사용 (선택)

브라우저에서 슬라이드를 실시간 미리보기하고 편집할 수 있습니다:

```bash
open .claude/ppt-preview.html
```

편집 후 하단의 JSON을 Claude Code에 붙여넣으면 자동으로 적용됩니다.

## 생성되는 파일

```
.claude/skills/ppt/
├── SKILL.md                          # 스킬 정의 (Claude Code가 읽음)
├── templates/
│   ├── slide-templates.json          # 7가지 슬라이드 템플릿 정의
│   └── remotion/
│       ├── PptComposition.tsx        # Remotion 시퀀스 래퍼
│       ├── Root.tsx                  # Composition 등록
│       ├── utils.ts                  # 9-grid 유틸리티
│       └── slides/
│           ├── SlideRouter.tsx       # templateId 라우터
│           ├── TitleSlide.tsx        # 제목 슬라이드
│           ├── ListSlide.tsx         # 불릿 목록
│           ├── QuoteSlide.tsx        # 인용문
│           ├── ComparisonSlide.tsx   # 비교
│           └── GenericSlide.tsx      # 범용 (chart, image, timeline)
```

## 호환성

- **렌더링**: Remotion v4+ (`@remotion/cli`, `@remotion/renderer`)
- **UI 프레임워크**: React 18+
- **스타일링**: Tailwind CSS v4 (선택), Inline Styles (기본)
- **AI**: Vercel AI SDK + OpenAI GPT-4o-mini
- **이미지**: DALL-E 3 (기본), Unsplash (fallback)
- **Claude Code**: 최신 버전 권장

## 디자인 시스템 연동

`claude-design-system` 스킬이 설치되어 있으면 자동으로 감지합니다:

```
.claude/skills/design-rules/ 존재 시
→ design-rules의 색상/폰트를 PPT 테마에 자동 적용
```

## 라이선스

MIT
