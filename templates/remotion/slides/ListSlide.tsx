// 불릿 목록 슬라이드 — 제목 + 포인트 순차 페이드인 (테마 + 9-grid 지원)
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

export function ListSlide({ data, theme }: { data: SlideData; theme: ThemeConfig }) {
  const frame = useCurrentFrame();
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });

  const positionStyle = getPositionStyle(data.textPosition ?? 4);
  const hasImage = !!data.imageUrl;
  const titleColor = hasImage ? '#FFFFFF' : theme.accent;
  const textColor = hasImage ? 'rgba(255,255,255,0.9)' : theme.foreground;
  const bulletColor = hasImage ? '#FFFFFF' : theme.accent;

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg }}>
      {hasImage && (
        <>
          <Img
            src={data.imageUrl!}
            style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)' }} />
        </>
      )}
      <div style={{ ...positionStyle, position: 'relative', zIndex: 1 }}>
        <h2 style={{
          fontSize: 48,
          fontWeight: 700,
          fontFamily: theme.fontHeading,
          color: titleColor,
          opacity: titleOpacity,
          marginBottom: 40,
        }}>
          {data.title}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {data.points.map((point, i) => {
            const delay = 15 + i * 10;
            const opacity = interpolate(frame, [delay, delay + 10], [0, 1], { extrapolateRight: 'clamp' });
            const translateX = interpolate(frame, [delay, delay + 10], [30, 0], { extrapolateRight: 'clamp' });

            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 16,
                  opacity,
                  transform: `translateX(${translateX}px)`,
                }}
              >
                <div style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: bulletColor,
                  marginTop: 10,
                  flexShrink: 0,
                }} />
                <p style={{
                  fontSize: 28,
                  fontFamily: theme.fontBody,
                  color: textColor,
                  lineHeight: 1.5,
                }}>
                  {point}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
}
