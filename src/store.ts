import { create } from 'zustand';
import { GRID, MIN, MAX } from './constants';

/* ──────────────── Typ pojedynczego modułu ──────────────── */
export interface Module {
  id: string;
  x: number;
  y: number;
  rot: number;          // 0–270°
  height: number;       // m
  color: string;        // HEX
  note: string;
}

/* ──────────────── Prefaby – współrzędne względne ──────────────── */
type PrefabName = 'garage' | 'mini' | 'bath';
const randId = () => crypto.randomUUID();

const PREFABS: Record<PrefabName, { dx: number; dy: number }[]> = {
  garage: [{ dx: 0, dy: 0 }, { dx: GRID, dy: 0 }],
  mini: [
    { dx: 0, dy: 0 }, { dx: GRID, dy: 0 },
    { dx: 0, dy: GRID }, { dx: GRID, dy: GRID },
  ],
  bath: [{ dx: 0, dy: 0 }],
};

/* ──────────────── Interfejs stanu (Zustand) ──────────────── */
interface Store {
  modules: Module[];
  history: Module[][];
  pointer: number;
  selectedId: string | null;

  /** helpers */
  inside: (x: number, y: number) => boolean;
  taken:  (x: number, y: number, ignore?: string) => boolean;

  /** actions */
  addModule:      (x: number, y: number) => void;
  moveModule:     (id: string, x: number, y: number) => void;
  addPrefab:      (name: PrefabName) => void;
  select:         (id: string | null) => void;
  updateModule:   (id: string, patch: Partial<Module>) => void;
  rotateSelected: () => void;
  deleteSelected: () => void;
  undo: () => void;
  redo: () => void;
}

/* ──────────────── Stan początkowy ──────────────── */
const init: Module = {
  id: randId(),
  x: MIN,
  y: MIN,
  rot: 0,
  height: 2.8,
  color: '#1e3a8a',
  note: '',
};

/* ──────────────── Fabryka store ──────────────── */
export const useStore = create<Store>((set, get) => ({
  modules: [init],
  history: [[init]],
  pointer: 0,
  selectedId: null,

  inside: (x, y) => x >= MIN && x <= MAX && y >= MIN && y <= MAX,
  taken : (x, y, ignore) =>
    get().modules.some((m) => m.id !== ignore && m.x === x && m.y === y),

  /* --- dodaj pojedynczy moduł --- */
  addModule: (x, y) => {
    if (!get().inside(x, y) || get().taken(x, y)) return;
    push(set, get, [
      ...get().modules,
      {
        id: randId(),
        x,
        y,
        rot: 0,
        height: 2.8,
        color: '#1e3a8a',
        note: '',
      },
    ]);
  },

  /* --- przesuwanie --- */
  moveModule: (id, x, y) => {
    if (!get().inside(x, y) || get().taken(x, y, id)) return;
    push(
      set,
      get,
      get().modules.map((m) => (m.id === id ? { ...m, x, y } : m)),
    );
  },

  /* --- prefab --- */
  addPrefab: (name) => {
    outer: for (let row = MIN; row <= MAX; row += GRID) {
      for (let col = MIN; col <= MAX; col += GRID) {
        const fits = PREFABS[name].every(({ dx, dy }) =>
          get().inside(col + dx, row + dy) &&
          !get().taken(col + dx, row + dy),
        );
        if (fits) {
          const mods = PREFABS[name].map(({ dx, dy }) => ({
            id: randId(),
            x: col + dx,
            y: row + dy,
            rot: 0,
            height: 2.8,
            color: '#1e3a8a',
            note: '',
          }));
          push(set, get, [...get().modules, ...mods]);
          break outer;
        }
      }
    }
  },

  /* --- zaznaczenie --- */
  select: (id) => set({ selectedId: id }),

  /* --- edycja parametrów --- */
  updateModule: (id, patch) =>
    push(
      set,
      get,
      get().modules.map((m) => (m.id === id ? { ...m, ...patch } : m)),
    ),

  /* --- rotacja zaznaczonego --- */
  rotateSelected: () => {
    const { selectedId } = get();
    if (!selectedId) return;
    push(
      set,
      get,
      get().modules.map((m) =>
        m.id === selectedId ? { ...m, rot: (m.rot + 90) % 360 } : m,
      ),
    );
  },

  /* --- usuwanie zaznaczonego --- */
  deleteSelected: () => {
    const { selectedId } = get();
    if (!selectedId) return;
    push(
      set,
      get,
      get().modules.filter((m) => m.id !== selectedId),
      null,
    );
  },

  /* --- undo / redo --- */
  undo: () => {
    const { pointer, history } = get();
    if (pointer > 0) {
      set({ pointer: pointer - 1, modules: history[pointer - 1] });
    }
  },

  redo: () => {
    const { pointer, history } = get();
    if (pointer < history.length - 1) {
      set({ pointer: pointer + 1, modules: history[pointer + 1] });
    }
  },
}));

/* ──────────────── helper: zapis stanu do historii ──────────────── */
function push(
  set: (fn: (s: Store) => Partial<Store>) => void,
  get: () => Store,
  nextModules: Module[],
  nextSelected: string | null = get().selectedId,
) {
  set((s) => {
    const hist = s.history.slice(0, s.pointer + 1);
    return {
      modules: nextModules,
      history: [...hist, structuredClone(nextModules)],
      pointer: hist.length,
      selectedId: nextSelected,
    };
  });
}
