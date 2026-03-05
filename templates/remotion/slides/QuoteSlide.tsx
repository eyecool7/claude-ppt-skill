// 인용문 슬라이드 — 큰 인용문 + 출처 (테마 + 9-grid 지원)
import { AbsoluteFill, Img, useCurrentFrame, interpolate } from 'remotion';
import { getPositionStyle } from '../utils';

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
  textPosition?: number;
  imageUrl?: string | null;
}

export function QuoteSlide({ data, theme }: { data: SlideData; theme: ThemeConfig }) {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
  const scale = interpolate(frame, [0, 20], [0.95, 1], { extrapolateRight: 'clamp' });

  const positionStyle = getPositionStyle(data.textPosition ?? 5);
  const hasImage = !!data.imageUrl;

  return (
    <AbsoluteFill style={{ backgroundColor: hasImage ? '#000' : theme.accent }}>
      {hasImage && (
        <>
          <Img
            src={data.imageUrl!}
            style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)' }} />
        </>
      )}
      <div style={{ ...positionStyle, position: 'relative', zIndex: 1, padding: 100 }}>
        <div style={{ opacity, transform: `scale(${scale})` }}>
          <div style={{ fontSize: 80, color: 'rgba(255,255,255,0.3)', marginBottom: -20 }}>&ldquo;</div>
          <p style={{
            fontSize: 36,
            fontFamily: theme.fontHeading,
            color: '#fff',
            lineHeight: 1.6,
            fontWeight: 500,
          }}>
            {data.title}
          </p>
          {data.points[0] && (
            <p style={{
              fontSize: 22,
              fontFamily: theme.fontBody,
              color: 'rgba(255,255,255,0.7)',
              marginTop: 24,
            }}>
              &mdash; {data.points[0]}
            </p>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
}
