// 슬라이드 라우터 — templateId에 따라 적절한 컴포넌트 렌더링 (테마 + 9-grid 지원)
import { TitleSlide } from './TitleSlide';
import { ListSlide } from './ListSlide';
import { QuoteSlide } from './QuoteSlide';
import { ComparisonSlide } from './ComparisonSlide';
import { GenericSlide } from './GenericSlide';

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

interface SlideRouterProps {
  data: SlideData;
  theme: ThemeConfig;
}

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
