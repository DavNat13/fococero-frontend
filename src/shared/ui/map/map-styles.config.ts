import type { StyleSpecification } from '@maplibre/maplibre-react-native';

export const MAP_STYLES: Record<string, string | StyleSpecification> = {
  Estandar: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
  Satelital: {
    version: 8,
    sources: {
      satellite: {
        type: 'raster',
        tiles: [
          'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        ],
        tileSize: 256,
        attribution: 'Esri',
      },
    },
    layers: [
      {
        id: 'satellite-layer',
        type: 'raster',
        source: 'satellite',
      },
    ],
  },
  Oscuro: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
  Relieve: {
    version: 8,
    sources: {
      terrain: {
        type: 'raster',
        tiles: [
          'https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}',
        ],
        tileSize: 256,
        attribution: 'Esri',
      },
    },
    layers: [
      {
        id: 'terrain-layer',
        type: 'raster',
        source: 'terrain',
      },
    ],
  },
};

export const DEFAULT_LAYER = 'Oscuro';
