import { Stage, Layer, Rect, Line } from 'react-konva';
import { GRID, HALF, PPM, CANVAS,  } from '../../constants';
import { useStore } from '../../store';

const px = (m: number) => m * PPM;
const m  = (p: number) => p / PPM;

export default function Editor2D() {
  const {
    modules, addModule, moveModule,
    select, selectedId, taken, inside,
  } = useStore();

  /* siatka */
  const grid: number[] = [];
  for (let x = 0; x <= CANVAS; x += px(GRID)) grid.push(x, 0, x, CANVAS);
  for (let y = 0; y <= CANVAS; y += px(GRID)) grid.push(0, y, CANVAS, y);

  const revert = (node: any, mod: any) =>
    node.position({ x: px(mod.x - HALF), y: px(mod.y - HALF) });

  return (
    <Stage
      width={CANVAS}
      height={CANVAS}
      style={{ background: '#f5f5f5' }}
      onDblClick={(e) => {
        const p = e.target.getStage()?.getPointerPosition(); if (!p) return;
        const x = Math.floor(m(p.x) / GRID) * GRID + HALF;
        const y = Math.floor(m(p.y) / GRID) * GRID + HALF;
        addModule(x, y);
      }}
      onMouseDown={(e) => {
        if (e.target === e.target.getStage()) select(null);
      }}
    >
      <Layer>
        <Line points={grid} stroke="#e5e5e5" strokeWidth={1} />
        {modules.map((mod) => (
          <Rect
            key={mod.id}
            x={px(mod.x - HALF)}
            y={px(mod.y - HALF)}
            width={px(GRID)}
            height={px(GRID)}
            rotation={mod.rot}
            fill="#93c5fd"
            stroke={mod.id === selectedId ? 'red' : undefined}
            strokeWidth={2}
            draggable
            onDragStart={() => select(mod.id)}
            onClick={() => select(mod.id)}
            onDragEnd={(e) => {
              const { x, y } = e.target.position();
              const snapX = Math.round(m(x + HALF) / GRID) * GRID;
              const snapY = Math.round(m(y + HALF) / GRID) * GRID;

              if (!inside(snapX, snapY) || taken(snapX, snapY, mod.id)) {
                revert(e.target, mod);
                return;
              }
              moveModule(mod.id, snapX, snapY);
            }}
          />
        ))}
      </Layer>
    </Stage>
  );
}
