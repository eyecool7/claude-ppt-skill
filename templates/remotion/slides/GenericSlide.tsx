// 범용 슬라이드 — chart, image, timeline용 (테마 + 9-grid + 이미지 배경 지원)
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

export function GenericSlide({ data, theme }: { data: SlideData; theme: ThemeConfig }) {
  const frame = useCurrentFrame();
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });

  const positionStyle = getPositionStyle(data.textPosition ?? 5);
  const hasImage = !!data.imageUrl;
  const titleColor = hasImage ? '#FFFFFF' : theme.accent;
  const textColor = hasImage ? 'rgba(255,255,255,0.9)' : theme.foreground;
  const numberColor = hasImage ? '#FFFFFF' : theme.accent;

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
          fontSize: 44,
          fontWeight: 700,
          fontFamily: theme.fontHeading,
          color: titleColor,
          opacity: titleOpacity,
          marginBottom: 32,
        }}>
          {data.title}
        </h2>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          flex: 1,
          justifyContent: 'center',
        }}>
          {data.points.map((point, i) => {
            const delay = 15 + i * 8;
            const opacity = interpolate(frame, [delay, delay + 10], [0, 1], { extrapolateRight: 'clamp' });
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, opacity }}>
                <span style={{
                  fontSize: 20,
                  fontWeight: 700,
                  fontFamily: theme.fontHeading,
                  color: numberColor,
                  minWidth: 32,
                }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p style={{
                  fontSize: 26,
                  fontFamily: theme.fontBody,
                  color: textColor,
                  lineHeight: 1.4,
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
