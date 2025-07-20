import Toolbar from './components/Toolbar';
import PrefabPanel from './components/PrefabPanel';
import Editor2D        from './components/TwoD/Editor2D';    // <- Uwaga: wielkie E
import PropertiesPanel from './components/PropertiesPanel';
import Scene3D         from './components/ThreeD/Scene3D';

export default function App() {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* lewy panel */}
      <div
        style={{
          width: 480,
          borderRight: '1px solid #d1d5db',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Toolbar />
        <PrefabPanel />
        <Editor2D />
        <PropertiesPanel />
      </div>

      {/* podgląd 3D */}
      <Scene3D />
    </div>
  );
}
