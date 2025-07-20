import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Grid, Bounds, Environment } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import { PerspectiveCamera, MathUtils } from 'three';
import { useStore } from '../../store';
import { GRID, HALF, CELLS } from '../../constants';
import { useEffect, useRef, useState } from 'react';
import { exportGLB } from '../../exporter';

/* — stała sceny — */
const SIZE   = GRID * CELLS;         // np. 28 m
const CENTER = SIZE / 2;

/* — pojedyncze moduły — */
function Modules() {
  const { modules, selectedId } = useStore();
  return (
    <>
      {modules.map((m) => (
        <mesh
          key={m.id}
          position={[m.x, HALF, m.y]}
          rotation={[0, MathUtils.degToRad(m.rot), 0]}
        >
          <boxGeometry args={[GRID, GRID, GRID]} />

          {/* materiał PBR */}
          <meshStandardMaterial
            color={m.id === selectedId ? '#3b82f6' : '#1e3a8a'}
            metalness={0.1}
            roughness={0.6}
            emissive={m.id === selectedId ? '#3b82f6' : '#000'}
            emissiveIntensity={m.id === selectedId ? 0.4 : 0}
          />
        </mesh>
      ))}
    </>
  );
}

/* — kontroler kamery (Top / Orbit) — */
function CameraController() {
  const { camera, invalidate } = useThree();
  const ctr = useRef<any>(null);
  const [top, setTop] = useState(false);

  /* przełącznik z Toolbara */
  useEffect(() => {
    const toggle = () => setTop((t) => !t);
    window.addEventListener('toggleTopView', toggle);
    return () => window.removeEventListener('toggleTopView', toggle);
  }, []);

  /* reakcja na zmianę trybu */
  useEffect(() => {
    if (!ctr.current) return;

    if (top) {
      camera.position.set(CENTER, SIZE * 1.2, CENTER);
      camera.up.set(0, 0, -1);
      ctr.current.enableRotate = false;
      ctr.current.enablePan    = false;
    } else {
      camera.position.set(SIZE * 0.7, SIZE * 0.5, SIZE * 0.7);
      camera.up.set(0, 1, 0);
      ctr.current.enableRotate = true;
      ctr.current.enablePan    = true;
    }
    camera.lookAt(CENTER, 0, CENTER);
    ctr.current.target.set(CENTER, 0, CENTER);
    ctr.current.enableZoom = true;
    ctr.current.update();
    invalidate();
  }, [top, camera, invalidate]);

  return <OrbitControls ref={ctr} />;
}

/* — główna scena — */
export default function Scene3D() {
  const cam = new PerspectiveCamera(45, 1, 0.1, 500);
  cam.position.set(SIZE * 0.7, SIZE * 0.5, SIZE * 0.7);
  cam.lookAt(CENTER, 0, CENTER);

  return (
    <Canvas
      style={{ flex: 1, background: '#e5e5e5' }}
      camera={cam}
      onCreated={({ scene }) => {
        const h = () => exportGLB(scene);
        window.addEventListener('exportGLB', h);
        return () => window.removeEventListener('exportGLB', h);
      }}
    >
      {/* HDRI Environment */}
      <Environment preset="city" background={false} />

      {/* miękkie światło */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[SIZE, SIZE, SIZE]} intensity={0.6} />

      {/* siatka – jaśniejsze linie */}
      <Grid
        args={[SIZE, SIZE]}
        position={[CENTER, 0, CENTER]}
        cellSize={GRID}
        cellThickness={1}
        cellColor="#8fa3d9"
        sectionColor="#3552a1"
        fadeDistance={80}
      />

      <Physics gravity={[0, -9.8, 0]}>
        <Bounds fit clip observe margin={1}>
          <Modules />
        </Bounds>
      </Physics>

      <CameraController />
    </Canvas>
  );
}
