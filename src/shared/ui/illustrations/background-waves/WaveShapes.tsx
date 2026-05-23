import React from 'react';
import { Path } from 'react-native-svg';

export const WaveShapes = () => {
  return (
    <>
      {/* Mancha Orgánica Gigante Superior/Izquierda */}
      <Path d="M0,0 C150,0 250,150 400,100 C400,350 200,450 0,350 Z" fill="url(#brandGrad)" />

      {/* Burbuja Media Derecha fluida */}
      <Path d="M400,250 C250,300 200,500 400,600 Z" fill="url(#zincGrad)" />

      {/* Onda base que envuelve la parte inferior sutilmente */}
      <Path d="M0,800 C150,650 300,750 400,600 L400,800 Z" fill="url(#accentGrad)" />
    </>
  );
};
