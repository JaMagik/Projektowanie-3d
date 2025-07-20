/** Jedno pole modułu w metrach */
export const GRID = 1;

export const HALF = GRID / 2;

/** Ile pól w osi (X = Y) – możesz tu zmienić zasięg całego planu */
export const CELLS = 10;

/** Pixels-per-meter na canvas 2D */
export const PPM = 20;

/** Rozmiar płótna 2D (px) = GRID × CELLS × PPM */
export const CANVAS = GRID * CELLS * PPM;

/** Granice dozwolonych współrzędnych modułów (w metrach, środek sześcianu) */
export const MIN = HALF;
export const MAX = GRID * CELLS - HALF;

export const CANVAS_SIZE = 600;


/** Powierzchnia całej siatki [m²] */
export const SURFACE_M2 = Math.pow(GRID * CELLS, 2);
