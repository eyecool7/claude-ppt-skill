// Remotion Root — Composition 등록
import { Composition } from 'remotion';
import { PptComposition, calculateDuration } from './PptComposition';

export function RemotionRoot() {
  return (
    <Composition
      id="PptComposition"
      component={PptComposition}
      durationInFrames={150 * 10}
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
        durationInFrames: calculateDuration(props.slides.length || 1),
      })}
    />
  );
}
