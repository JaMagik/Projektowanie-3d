import { useEffect } from 'react';
import { SURFACE_M2 } from '../constants';
import { useStore } from '../store';
import { exportJSON } from '../exporter';

/* ------------------------------------------------------------------ */
/*  Toolbar – przyciski, skróty klaw., eksport, przełącznik Top-view   */
/* ------------------------------------------------------------------ */

function Toolbar() {
  const {
    undo,
    redo,
    rotateSelected,
    deleteSelected,
    pointer,
    history,
    selectedId,
    modules,
  } = useStore();

  /*  skróty klawiaturowe  */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'z') { e.preventDefault(); undo(); }
      if (e.ctrlKey && e.key.toLowerCase() === 'y') { e.preventDefault(); redo(); }
      if (e.key.toLowerCase() === 'r')              { e.preventDefault(); rotateSelected(); }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault(); deleteSelected();
      }
      if (e.key.toLowerCase() === 't') {
        window.dispatchEvent(new Event('toggleTopView'));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [undo, redo, rotateSelected, deleteSelected]);

  /*  uniwersalny przycisk  */
  const Btn = ({
    label,
    on,
    dis = false,
  }: {
    label: string;
    on: () => void;
    dis?: boolean;
  }) => (
    <button
      onClick={on}
      disabled={dis}
      style={{
        padding: '4px 10px',
        opacity: dis ? 0.4 : 1,
        cursor: dis ? 'default' : 'pointer',
      }}
    >
      {label}
    </button>
  );

  /*  akcje eksportu  */
  const exportProject = () => exportJSON({ modules });
  const exportGLB    = () => window.dispatchEvent(new Event('exportGLB'));
  const toggleTop    = () => window.dispatchEvent(new Event('toggleTopView'));

  return (
    <div
      style={{
        padding: 8,
        display: 'flex',
        gap: 6,
        borderBottom: '1px solid #d1d5db',
        alignItems: 'center',
      }}
    >
      <Btn label="Undo"   on={undo}   dis={pointer === 0} />
      <Btn label="Redo"   on={redo}   dis={pointer >= history.length - 1} />
      <Btn label="Rotate" on={rotateSelected} dis={!selectedId} />
      <Btn label="Delete" on={deleteSelected} dis={!selectedId} />
      <Btn label="Top"    on={toggleTop} />

      <Btn label="Export JSON" on={exportProject} />
      <Btn label="Export GLB"  on={exportGLB} />

      <span style={{ marginLeft: 'auto', fontSize: 13, color: '#555' }}>
        Surface:&nbsp;<strong>{SURFACE_M2.toFixed(0)} m²</strong>
      </span>
    </div>
  );
}

export default Toolbar;
