import React from 'react';
import { useStore } from '../store';

export default function PropertiesPanel() {
  const { selectedId, modules, updateModule } = useStore();
  const mod = modules.find((m) => m.id === selectedId);

  if (!mod) return null;                         // brak zaznaczenia

  return (
    <div style={{ padding: 8, borderTop: '1px solid #d1d5db', fontSize: 14 }}>
      <strong>Selected module</strong>

      <div style={{ marginTop: 6 }}>
        X: {mod.x.toFixed(1)} m &nbsp; Y: {mod.y.toFixed(1)} m
      </div>

      {/* kolor */}
      <div style={{ marginTop: 6 }}>
        <label>
          Color:&nbsp;
          <input
            type="color"
            value={mod.color}
            onChange={(e) => updateModule(mod.id, { color: e.target.value })}
          />
        </label>
      </div>

      {/* wysokość */}
      <div style={{ marginTop: 6 }}>
        <label>
          Height (m):&nbsp;
          <input
            type="number"
            min={2}
            step={0.1}
            value={mod.height}
            onChange={(e) =>
              updateModule(mod.id, { height: parseFloat(e.target.value) || 2.8 })
            }
            style={{ width: 60 }}
          />
        </label>
      </div>

      {/* opis */}
      <div style={{ marginTop: 6 }}>
        <label>
          Note:&nbsp;
          <input
            type="text"
            value={mod.note}
            onChange={(e) => updateModule(mod.id, { note: e.target.value })}
            style={{ width: 140 }}
          />
        </label>
      </div>
    </div>
  );
}
