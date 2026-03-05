// 9-grid 텍스트 배치 유틸리티
import type React from 'react';

/**
 * 9-grid position을 CSS flexbox 스타일로 변환한다.
 *
 * +---+---+---+
 * | 1 | 2 | 3 |
 * +---+---+---+
 * | 4 | 5 | 6 |
 * +---+---+---+
 * | 7 | 8 | 9 |
 * +---+---+---+
 */
export function getPositionStyle(position: number): React.CSSProperties {
  const row = Math.ceil(position / 3);
  const col = ((position - 1) % 3) + 1;

  const justifyMap: Record<number, string> = {
    1: 'flex-start',
    2: 'center',
    3: 'flex-end',
  };

  const alignMap: Record<number, string> = {
    1: 'flex-start',
    2: 'center',
    3: 'flex-end',
  };

  return {
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: justifyMap[row],
    alignItems: alignMap[col],
    textAlign: col === 1 ? 'left' : col === 2 ? 'center' : 'right',
    padding: 80,
    width: '100%',
    height: '100%',
  };
}
