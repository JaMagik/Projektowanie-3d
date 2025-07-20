import React from 'react';
import { Layer, Line, Text } from 'react-konva';
import { CANVAS, GRID, PPM } from '../../constants';

const px = (m: number) => m * PPM;

export default function Rulers() {
  const marks: React.ReactElement[] = [];

  /* ── górny ruler (oś X) ── */
  for (let val = 0; val <= CANVAS / PPM; val += GRID) {
    const x = px(val);
    const long = val % (GRID * 5) === 0;

    marks.push(
      <Line
        key={`tick-x-${val}`}
        points={[x, 0, x, long ? 16 : 10]}
        stroke="#777"
        strokeWidth={1}
        listening={false}
      />,
    );

    if (long) {
      marks.push(
        <Text
          key={`label-x-${val}`}
          x={x + 2}
          y={2}
          text={`${val.toFixed(0)}m`}
          fontSize={10}
          fill="#555"
          listening={false}
        />,
      );
    }
  }

  /* ── lewy ruler (oś Y) ── */
  for (let val = 0; val <= CANVAS / PPM; val += GRID) {
    const y = px(val);
    const long = val % (GRID * 5) === 0;

    marks.push(
      <Line
        key={`tick-y-${val}`}
        points={[0, y, long ? 16 : 10, y]}
        stroke="#777"
        strokeWidth={1}
        listening={false}
      />,
    );

    if (long) {
      marks.push(
        <Text
          key={`label-y-${val}`}
          x={2}
          y={y + 2}
          text={`${val.toFixed(0)}m`}
          fontSize={10}
          fill="#555"
          listening={false}
        />,
      );
    }
  }

  return <Layer listening={false}>{marks}</Layer>;
}
