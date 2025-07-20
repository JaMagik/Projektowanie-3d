/* eslint-disable @typescript-eslint/ban-ts-comment */
import { saveAs } from 'file-saver';
// @ts-ignore — typy GLTFExporter nie są w pakiecie
import { GLTFExporter } from 'three-stdlib';
import { Scene } from 'three';

/* pobierz blob jako plik */
function download(blob: Blob, filename: string) {
  saveAs(blob, filename);
}

/* ───────────── JSON ───────────── */
export function exportJSON(data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
  download(blob, 'project.json');
}

/* ───────────── GLB ───────────── */
export function exportGLB(scene: Scene) {
  const exporter = new GLTFExporter();
  exporter.parse(
    scene,
    // @ts-ignore — zwrot może być ArrayBuffer lub object
    (glb: ArrayBuffer) => {
      const blob = new Blob([glb], { type: 'model/gltf-binary' });
      download(blob, 'model.glb');
    },
    { binary: true }
  );
}
