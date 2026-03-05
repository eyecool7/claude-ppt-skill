// PPT 컴포지션 — 슬라이드 시퀀스를 MP4로 렌더링 (테마 + 9-grid 지원)
import { Sequence } from 'remotion';
import { SlideRouter } from './slides/SlideRouter';

const SLIDE_DURATION_FRAMES = 150; // 5초 x 30fps

interface ThemeConfig {
  bg: string;
  foreground: string;
  accent: string;
  fontHeading: string;
  fontBody: string;
}

interface SlideData {
  title: string;
  points: string[];
  visualType: string;
  templateId: string;
  notes: string | null;
  textPosition?: number;
  imageUrl?: string | null;
  imagePrompt?: string | null;
}

interface PptCompositionProps {
  slides: SlideData[];
  theme: ThemeConfig;
}

export function PptComposition({ slides, theme }: PptCompositionProps) {
  return (
    <>
      {slides.map((slide, i) => (
        <Sequence key={i} from={i * SLIDE_DURATION_FRAMES} durationInFrames={SLIDE_DURATION_FRAMES}>
          <SlideRouter data={slide} theme={theme} />
        </Sequence>
      ))}
    </>
  );
}

export function calculateDuration(slideCount: number): number {
  return slideCount * SLIDE_DURATION_FRAMES;
}
