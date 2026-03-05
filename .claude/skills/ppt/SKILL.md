---
description: 유튜브 스크립트를 PPT 슬라이드(MP4)로 변환합니다. 8가지 디자인 테마, 9칸 그리드 텍스트 배치, Remotion 애니메이션 지원.
triggers:
  - PPT
  - ppt
  - 슬라이드
  - slide
  - 프레젠테이션
  - presentation
  - MP4
globs:
  - "src/**/*.tsx"
  - "src/remotion/**/*"
  - "src/templates/**/*"
---

# PPT Slide Generation Skill

유튜브 스크립트를 PPT 슬라이드(MP4)로 변환한다.
**스크립트 입력 → 테마 선택 → AI 분할 → 미리보기 편집 → Remotion 렌더링 → MP4 내보내기** 6단계로 진행한다.

## 설치 경로 확인

이 스킬의 파일 위치를 확인한다:

```
SKILL_ROOT = 이 SKILL.md가 있는 디렉토리의 상위 경로
             (예: .claude/skills/ppt/)
```

에셋 파일 위치:
- `ppt-preview.html`: `[SKILL_ROOT]/../../ppt-preview.html` 또는 `.claude/ppt-preview.html`
- 슬라이드 템플릿: `[SKILL_ROOT]/templates/slide-templates.json`
- Remotion 참조 컴포넌트: `[SKILL_ROOT]/templates/remotion/`

---

## STEP 1 — 스크립트 입력

사용자에게 유튜브 스크립트를 입력받는다.

```
PPT로 만들 유튜브 스크립트를 입력해 주세요.
- 텍스트 직접 붙여넣기
- 파일 경로 지정 (예: ~/scripts/episode-42.txt)
```

스크립트가 입력되면 길이와 예상 슬라이드 수를 안내한다:
```
스크립트 분석:
- 글자 수: [N]자
- 예상 슬라이드: [N]장 (약 200~300자 당 1장)
- 예상 영상 길이: [N]초 (슬라이드당 5초)
```

---

## STEP 2 — 테마 선택

8가지 디자인 테마 중 하나를 선택하게 안내한다.

```
어떤 디자인 테마를 원하시나요?

A. Tech Precision
   데이터가 미학이다. 모노스페이스, 딥 다크, 그리드선, 색 최소화.

B. Neon Flux
   미래에서 온 UI. 네온 glow, 글래스모피즘, 다크 배경, 그라데이션.

C. Editorial Authority
   절제된 권위감. 세리프 헤드라인, 넓은 여백, 모노크롬 + 포인트 1색.

D. Organic Warm
   손의 온기. 종이 질감, 크림 톤, 둥근 곡선, 아날로그 타이포.

E. Luxury Minimal
   침묵이 럭셔리. 극단적 여백, 얇은 세리프, 골드/실버 포인트.

F. Brutalist Raw
   날것의 충격. Hard shadow, 굵은 border, 강한 대비, 직각.

G. Retro Analog
   카세트테이프 향수. 빛바랜 색감, CRT 노이즈, 모노스페이스.

H. Playful Pop
   컬러풀한 팝아트. 둥근 모서리, 밝은 배경, 3색 이상.
```

또는 `.claude/ppt-preview.html`이 존재하면 안내:
```
ppt-preview.html을 브라우저에서 열어 실시간 미리보기로 테마를 선택할 수도 있습니다.
  -> open .claude/ppt-preview.html
선택 후 하단의 JSON을 복사해서 붙여넣어 주세요.
```

### THEMES 테이블

| Theme | bg | foreground | accent | font-heading | font-body | 기본 모드 |
|-------|-----|------------|--------|-------------|-----------|:---------:|
| Tech Precision | #0A0E17 | #F9FAFB | #00FF41 | JetBrains Mono | Inter | Dark |
| Neon Flux | #05050F | #F0F0FF | #00F0FF | Space Grotesk | Inter | Dark |
| Editorial Authority | #F8F9FA | #111827 | #1A1AFF | Cormorant Garamond | Inter | Light |
| Organic Warm | #FAF7F2 | #2C1810 | #C26B3B | Lora | Source Sans 3 | Light |
| Luxury Minimal | #FFFFFF | #171717 | #B8860B | Cormorant | Inter | Light |
| Brutalist Raw | #FFFFFF | #000000 | #FF0000 | Oswald | Inter | Light |
| Retro Analog | #F2E8D5 | #2A2218 | #D45B3A | Space Mono | IBM Plex Sans | Light |
| Playful Pop | #FFF8E7 | #2B2D42 | #EF476F | Fredoka | Nunito | Light |

### 테마 통합 로직

design-rules가 이미 존재하는 경우 (`/.claude/skills/design-rules/`):
```
1. design-rules/02-color.md에서 색상 팔레트를 읽는다
2. design-rules/01-typography.md에서 폰트 설정을 읽는다
3. 해당 값을 테마 기본값 대신 사용한다
4. 사용자에게 "기존 디자인 시스템이 감지되었습니다. 해당 테마를 적용합니다." 안내
```

design-rules가 없는 경우:
```
1. 위 THEMES 테이블의 기본값을 사용한다
2. 사용자가 테마를 선택하면 해당 행의 값을 적용한다
```

---

## STEP 3 — AI 분할 (GPT-4o-mini)

선택된 테마와 스크립트를 GPT-4o-mini에 전달하여 슬라이드 JSON을 생성한다.

### Zod 스키마

```typescript
import { z } from 'zod';

const slideSchema = z.object({
  title: z.string().describe('슬라이드 제목 (최대 40자)'),
  points: z.array(z.string()).describe('핵심 포인트 목록 (각 최대 80자)'),
  visualType: z.enum([
    'title', 'list', 'chart', 'comparison', 'quote', 'image', 'timeline'
  ]).describe('시각화 유형'),
  templateId: z.string().describe('사전 정의 템플릿 ID'),
  notes: z.string().nullable().describe('발표자 노트 (원본 스크립트 구간)'),
  textPosition: z.number().min(1).max(9).default(5)
    .describe('9-grid 텍스트 위치 (1~9, 기본 5=중앙)'),
  imageUrl: z.string().nullable().describe('배경 이미지 URL (있는 경우)'),
  imagePrompt: z.string().nullable()
    .describe('DALL-E/Unsplash 이미지 검색 프롬프트'),
});

const pptOutputSchema = z.object({
  slides: z.array(slideSchema).min(3).describe('슬라이드 배열 (최소 3장)'),
  metadata: z.object({
    totalSlides: z.number(),
    estimatedDuration: z.number().describe('예상 시간(초)'),
  }),
});
```

### 7가지 슬라이드 템플릿

| templateId | 이름 | visualType | 설명 | 기본 textPosition |
|-----------|------|-----------|------|:-----------------:|
| title-default | 제목 슬라이드 | title | 중앙 정렬 제목 + 부제목 | 5 |
| list-default | 불릿 목록 | list | 제목 + 불릿 포인트 목록 | 4 |
| chart-default | 차트/데이터 | chart | 제목 + 데이터 시각화 영역 | 5 |
| comparison-default | 비교 | comparison | 좌우 2컬럼 비교 | 5 |
| quote-default | 인용문 | quote | 큰 인용문 + 출처 | 5 |
| image-default | 이미지 중심 | image | 이미지 배경 + 오버레이 텍스트 | 7 |
| timeline-default | 타임라인 | timeline | 순서/단계별 흐름 | 5 |

### AI 프롬프트 가이드라인

```
시스템 프롬프트에 포함할 내용:
1. 스크립트를 의미 단위로 분할 (200~300자 기준)
2. 첫 슬라이드는 반드시 title-default (영상 제목)
3. 마지막 슬라이드는 title-default (마무리/CTA)
4. 중간 슬라이드는 내용에 따라 적절한 templateId 배정
5. points는 핵심만 추출 (완성 문장 X, 키워드/구문 O)
6. 각 point는 최대 80자
7. notes에는 해당 구간의 원본 스크립트를 포함
8. textPosition은 이미지가 있는 슬라이드에서 텍스트 충돌을 피하도록 배치
```

---

## STEP 4 — 미리보기 에디터

AI가 생성한 슬라이드 JSON을 미리보기 화면에서 확인/편집한다.

### YouTube 프레임 미리보기

슬라이드를 YouTube 플레이어 프레임 안에 16:9 비율로 표시한다:
- 검은 배경 (#0f0f0f)
- 플레이어 크롬 (프로그레스 바, 컨트롤 영역)
- 영상 제목 영역
- 채널 정보 (아바타 + 이름 + 구독 버튼)

### 9-Grid 텍스트 배치 시스템

텍스트 위치를 9칸 그리드로 제어한다:

```
+-------+-------+-------+
|       |       |       |
|   1   |   2   |   3   |
|       |       |       |
+-------+-------+-------+
|       |       |       |
|   4   |   5   |   6   |
|       |       |       |
+-------+-------+-------+
|       |       |       |
|   7   |   8   |   9   |
|       |       |       |
+-------+-------+-------+
```

#### CSS Flexbox 매핑

| Position | justify-content | align-items | 용도 |
|:--------:|:--------------:|:-----------:|------|
| 1 | flex-start | flex-start | 좌상단 — 자막 스타일 |
| 2 | center | flex-start | 상단 중앙 — 제목 강조 |
| 3 | flex-end | flex-start | 우상단 — 워터마크 영역 |
| 4 | flex-start | center | 좌측 중앙 — 사이드 텍스트 |
| 5 | center | center | 정중앙 — 기본값, 제목 슬라이드 |
| 6 | flex-end | center | 우측 중앙 — 이미지 좌측에 텍스트 |
| 7 | flex-start | flex-end | 좌하단 — 출처/크레딧 |
| 8 | center | flex-end | 하단 중앙 — 자막 위치 |
| 9 | flex-end | flex-end | 우하단 — 페이지 넘버 |

#### textPosition → CSS 변환 함수

```typescript
function getPositionStyle(position: number): React.CSSProperties {
  const row = Math.ceil(position / 3);  // 1,2,3
  const col = ((position - 1) % 3) + 1; // 1,2,3

  const justifyMap: Record<number, string> = {
    1: 'flex-start', 2: 'center', 3: 'flex-end',
  };
  const alignMap: Record<number, string> = {
    1: 'flex-start', 2: 'center', 3: 'flex-end',
  };

  return {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: justifyMap[row],
    alignItems: justifyMap[col],
    textAlign: col === 1 ? 'left' : col === 2 ? 'center' : 'right',
    padding: '80px',
    width: '100%',
    height: '100%',
  };
}
```

### 편집 기능

미리보기에서 지원하는 편집 기능:
1. **제목 편집**: 클릭하여 인라인 편집
2. **포인트 편집**: 텍스트 영역에서 줄바꿈으로 구분
3. **textPosition 변경**: 3x3 그리드 클릭으로 위치 선택
4. **이미지 추가/교체**: URL 입력 또는 DALL-E/Unsplash 프롬프트
5. **테마 색상 미세 조정**: 배경색, 전경색, 강조색 커스텀
6. **슬라이드 순서 변경**: 드래그 앤 드롭 또는 화살표 버튼
7. **슬라이드 추가/삭제**: + 버튼으로 빈 슬라이드 추가, x 버튼으로 삭제

### 슬라이드 네비게이션

- 좌/우 화살표 키로 슬라이드 이동
- 하단 썸네일 바에서 클릭으로 이동
- 슬라이드 카운터 표시 (예: "3/12")

---

## STEP 5 — Remotion 렌더링

편집 완료된 슬라이드 JSON을 Remotion으로 MP4 렌더링한다.

### 렌더링 설정

```
- 해상도: 1920 x 1080 (16:9)
- FPS: 30
- 슬라이드당 프레임: 150 (= 5초)
- 총 프레임: 슬라이드 수 x 150
- 코덱: H.264
- 출력: MP4
```

### Remotion CLI 실행

Express 서버에서 child_process로 실행:

```typescript
import { spawn } from 'child_process';

function renderPpt(slidesJson: string, outputPath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const proc = spawn('npx', [
      'remotion', 'render',
      'src/remotion/index.ts',        // entry point
      'PptComposition',                // composition ID
      outputPath,                      // output file path
      '--props', slidesJson,           // JSON props
      '--codec', 'h264',
      '--image-format', 'jpeg',
    ]);

    proc.on('close', (code) => {
      if (code === 0) resolve(outputPath);
      else reject(new Error(`Remotion render failed with code ${code}`));
    });
  });
}
```

### Remotion 컴포넌트 구조

```
src/remotion/
├── index.ts              # registerRoot
├── Root.tsx              # Composition 등록
├── PptComposition.tsx    # 슬라이드 시퀀스
└── slides/
    ├── SlideRouter.tsx   # templateId → 컴포넌트 매핑
    ├── TitleSlide.tsx    # 제목 슬라이드
    ├── ListSlide.tsx     # 불릿 목록
    ├── QuoteSlide.tsx    # 인용문
    ├── ComparisonSlide.tsx # 비교
    └── GenericSlide.tsx  # chart, image, timeline 공통
```

### PptComposition 구조

```typescript
import { Sequence } from 'remotion';
import { SlideRouter } from './SlideRouter';

const SLIDE_DURATION_FRAMES = 150; // 5초 x 30fps

interface PptCompositionProps {
  slides: SlideData[];
  theme: ThemeConfig;
}

export function PptComposition({ slides, theme }: PptCompositionProps) {
  return (
    <>
      {slides.map((slide, i) => (
        <Sequence
          key={i}
          from={i * SLIDE_DURATION_FRAMES}
          durationInFrames={SLIDE_DURATION_FRAMES}
        >
          <SlideRouter data={slide} theme={theme} />
        </Sequence>
      ))}
    </>
  );
}
```

### SlideRouter 매핑

```typescript
export function SlideRouter({ data, theme }: SlideRouterProps) {
  switch (data.templateId) {
    case 'title-default':
      return <TitleSlide data={data} theme={theme} />;
    case 'list-default':
      return <ListSlide data={data} theme={theme} />;
    case 'quote-default':
      return <QuoteSlide data={data} theme={theme} />;
    case 'comparison-default':
      return <ComparisonSlide data={data} theme={theme} />;
    default:
      return <GenericSlide data={data} theme={theme} />;
  }
}
```

### 슬라이드 컴포넌트 공통 패턴

모든 슬라이드 컴포넌트는 다음 패턴을 따른다:

```typescript
interface SlideProps {
  data: SlideData;
  theme: ThemeConfig;
}

// ThemeConfig 인터페이스
interface ThemeConfig {
  bg: string;           // 배경색
  foreground: string;   // 전경색 (텍스트)
  accent: string;       // 강조색
  fontHeading: string;  // 헤딩 폰트
  fontBody: string;     // 본문 폰트
}
```

공통 규칙:
1. `AbsoluteFill`을 최외곽 컨테이너로 사용
2. `theme.bg`를 배경색으로 적용
3. `theme.accent`를 제목/강조 요소에 적용
4. `theme.foreground`를 본문 텍스트에 적용
5. `textPosition`으로 `getPositionStyle()` 호출하여 위치 결정
6. `imageUrl`이 있으면 배경 이미지로 표시 + 오버레이
7. 페이드인 애니메이션: `useCurrentFrame()` + `interpolate()`

### 애니메이션 가이드라인

```
- 제목: frame 0~15에 opacity 0→1, spring translateY
- 포인트: frame 15+ 부터 순차 페이드인 (i * 10 딜레이)
- 인용문: frame 0~20에 opacity + scale(0.95→1)
- 이미지: frame 0~20에 opacity, 텍스트는 frame 10~25
- 모든 extrapolateRight: 'clamp'
```

---

## STEP 6 — 내보내기

렌더링 완료 후 사용자에게 안내:

```
MP4 렌더링이 완료되었습니다.

출력 파일: [output-path]/presentation.mp4
슬라이드 수: [N]장
총 영상 길이: [N]초
테마: [Theme Name]

추가 작업:
- 다시 편집하려면 "슬라이드 편집" 입력
- 블로그로도 변환하려면 "블로그 변환" 입력
- 카드뉴스로도 변환하려면 "카드뉴스 변환" 입력
```

---

## Remotion 컴포넌트 생성 가이드라인

Claude Code가 프로젝트에 Remotion 컴포넌트를 생성할 때 따라야 하는 규칙:

### 필수 의존성

```json
{
  "remotion": "^4.0.0",
  "@remotion/cli": "^4.0.0",
  "@remotion/renderer": "^4.0.0"
}
```

### 파일 생성 순서

```
1. src/remotion/index.ts — registerRoot(Root)
2. src/remotion/Root.tsx — Composition 등록 (id, fps, width, height)
3. src/remotion/PptComposition.tsx — Sequence 래퍼
4. src/remotion/slides/SlideRouter.tsx — templateId 라우팅
5. src/remotion/slides/[Template].tsx — 개별 슬라이드 컴포넌트
```

### Root.tsx 템플릿

```typescript
import { Composition } from 'remotion';
import { PptComposition, calculateDuration } from './PptComposition';

export function RemotionRoot() {
  return (
    <Composition
      id="PptComposition"
      component={PptComposition}
      durationInFrames={150 * 10}  // 기본 10슬라이드
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{
        slides: [],
        theme: {
          bg: '#FFFFFF',
          foreground: '#111827',
          accent: '#3B82F6',
          fontHeading: 'Inter',
          fontBody: 'Inter',
        },
      }}
      calculateMetadata={({ props }) => ({
        durationInFrames: calculateDuration(props.slides.length),
      })}
    />
  );
}
```

### 이미지 배경 처리

```typescript
// imageUrl이 있는 경우
{data.imageUrl && (
  <>
    <Img
      src={data.imageUrl}
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      }}
    />
    <div style={{
      position: 'absolute',
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)',  // 오버레이
    }} />
  </>
)}
```

### 9-Grid와 이미지 조합

```
이미지 배경이 있는 슬라이드에서 textPosition 권장:
- 풍경 이미지 (하늘 위): textPosition 7, 8 (하단)
- 인물 이미지 (중앙): textPosition 1, 2, 3 (상단) 또는 7, 8, 9 (하단)
- 추상/패턴: textPosition 5 (중앙, 오버레이 강하게)
```

---

## 주의사항

- 스크립트가 없는 상태에서 PPT를 요청하면 STEP 1부터 안내한다
- 테마 선택 전에 "추천" 코멘트를 달지 않는다
- AI가 직접 스타일/레이아웃을 생성하지 않는다 — 반드시 templateId + 데이터 JSON 형태로 반환
- Remotion은 Vite dev server와 별도 프로세스. 포트 충돌 주의 (Remotion: 3001, Vite: 5173)
- 이미지 생성은 DALL-E 3 사용, 실패 시 Unsplash fallback
- 슬라이드당 텍스트는 제목 40자 + 포인트 각 80자 이내로 제한
- 한국어 폰트: Noto Sans KR (본문), Noto Serif KR (세리프 테마)
- 영문 폰트: 테마별 THEMES 테이블 참조
