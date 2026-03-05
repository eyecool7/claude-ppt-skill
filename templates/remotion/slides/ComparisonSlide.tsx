// 비교 슬라이드 — 좌우 2컬럼 비교 (테마 + 9-grid 지원)
import { AbsoluteFill, Img, useCurrentFrame, interpolate } from 'remotion';

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

export function ComparisonSlide({ data, theme }: { data: SlideData; theme: ThemeConfig }) {
  const frame = useCurrentFrame();
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });

  const leftPoints = data.points.filter((_, i) => i % 2 === 0);
  const rightPoints = data.points.filter((_, i) => i % 2 === 1);

  const hasImage = !!data.imageUrl;
  const titleColor = hasImage ? '#FFFFFF' : theme.accent;
  const dividerColor = hasImage ? 'rgba(255,255,255,0.3)' : '#E2E8F0';

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg, padding: 80 }}>
      {hasImage && (
        <>
          <Img
            src={data.imageUrl!}
            style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', top: 0, left: 0 }}
          />
          <div style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', top: 0, left: 0 }} />
        </>
      )}
      <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%' }}>
        <h2 style={{
          fontSize: 44,
          fontWeight: 700,
          fontFamily: theme.fontHeading,
          color: titleColor,
          opacity: titleOpacity,
          marginBottom: 40,
          textAlign: 'center',
        }}>
          {data.title}
        </h2>
        <div style={{ display: 'flex', gap: 40, flex: 1 }}>
          <Column items={leftPoints} frame={frame} delay={15} color={theme.accent} font={theme.fontBody} />
          <div style={{ width: 2, backgroundColor: dividerColor }} />
          <Column items={rightPoints} frame={frame} delay={25} color={hasImage ? 'rgba(255,255,255,0.8)' : theme.foreground} font={theme.fontBody} />
        </div>
      </div>
    </AbsoluteFill>
  );
}

function Column({ items, frame, delay, color, font }: {
  items: string[];
  frame: number;
  delay: number;
  color: string;
  font: string;
}) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
      {items.map((item, i) => {
        const d = delay + i * 8;
        const opacity = interpolate(frame, [d, d + 10], [0, 1], { extrapolateRight: 'clamp' });
        return (
          <p key={i} style={{ fontSize: 24, fontFamily: font, color, opacity, lineHeight: 1.5 }}>
            {item}
          </p>
        );
      })}
    </div>
  );
}
