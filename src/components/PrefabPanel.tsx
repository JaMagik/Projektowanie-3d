import { useStore } from '../store';

export default function PrefabPanel() {
  const { addPrefab } = useStore();

  const btn = (label: string, prefab: any) => (
    <button
      key={label}
      style={{
        padding: '6px 12px',
        margin: '4px 0',
        width: '100%',
        textAlign: 'left',
        background: '#e5e7eb',
        border: 'none',
        cursor: 'pointer',
      }}
      onClick={() => addPrefab(prefab)}
    >
      {label}
    </button>
  );

  return (
    <div style={{ padding: '8px', borderBottom: '1px solid #d1d5db' }}>
      <strong>Prefabs</strong>
      {btn('Garage 2×1', 'garage')}
      {btn('Mini-House 2×2', 'mini')}
      {btn('Bathroom 1×1', 'bath')}
    </div>
  );
}
