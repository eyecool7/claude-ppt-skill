// 제목 슬라이드 — 중앙 정렬 제목 + 부제목 (테마 + 9-grid + 이미지 배경 지원)
import { AbsoluteFill, Img, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
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

export function TitleSlide({ data, theme }: { data: SlideData; theme: ThemeConfig }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  const titleY = spring({ frame, fps, config: { damping: 20 } }) * 30 - 30;
  const subtitleOpacity = interpolate(frame, [20, 35], [0, 1], { extrapolateRight: 'clamp' });

  const positionStyle = getPositionStyle(data.textPosition ?? 5);
  const hasImage = !!data.imageUrl;
  const textColor = hasImage ? '#FFFFFF' : theme.accent;
  const subtitleColor = hasImage ? 'rgba(255,255,255,0.7)' : theme.foreground;

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
        <h1 style={{
          fontSize: 64,
          fontWeight: 700,
          fontFamily: theme.fontHeading,
          color: textColor,
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          lineHeight: 1.2,
        }}>
          {data.title}
        </h1>
        {data.points[0] && (
          <p style={{
            fontSize: 28,
            fontFamily: theme.fontBody,
            color: subtitleColor,
            marginTop: 24,
            opacity: subtitleOpacity,
          }}>
            {data.points[0]}
          </p>
        )}
      </div>
    </AbsoluteFill>
  );
}
