import * as MapLibreGL from '@maplibre/maplibre-react-native';
import type { ReactNode } from 'react';
import type { StyleSpecification } from '@maplibre/maplibre-react-native';

export const DARK_MATTER_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';
export const SANTIAGO_CENTER: [number, number] = [-70.6693, -33.4489];

interface Props {
  children: ReactNode;
  cameraRef: React.RefObject<MapLibreGL.CameraRef | null>;
  initialZoom?: number;
  showCompass?: boolean;
  onRegionDidChange?: (e: any) => void;
  trackUser?: boolean;
  mapStyle?: string | StyleSpecification;
}

export function MapContainer({
  children,
  cameraRef,
  initialZoom = 12,
  showCompass = true,
  onRegionDidChange,
  trackUser = true,
  mapStyle,
}: Props) {
  return (
    <MapLibreGL.Map
      style={{ flex: 1 }}
      mapStyle={mapStyle ?? DARK_MATTER_STYLE}
      compass={showCompass}
      attribution={false}
      logo={false}
      onRegionDidChange={onRegionDidChange}
    >
      <MapLibreGL.Camera
        ref={cameraRef}
        initialViewState={{ center: SANTIAGO_CENTER, zoom: initialZoom }}
        trackUserLocation={trackUser ? 'default' : undefined}
      />
      <MapLibreGL.UserLocation animated accuracy />
      {children}
    </MapLibreGL.Map>
  );
}
