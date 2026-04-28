import React from 'react';
import { Defs, LinearGradient, Stop } from 'react-native-svg';

export const WaveGradients = () => {
  return (
    <Defs>
      {/* Gradiente principal: Naranja Táctico (Brand Primary) */}
      <LinearGradient id="brandGrad" x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0%" stopColor="#EA580C" stopOpacity="0.15" />
        <Stop offset="100%" stopColor="#EA580C" stopOpacity="0.05" />
      </LinearGradient>

      {/* Gradiente secundario: Tonos Zinc/Slate para balancear */}
      <LinearGradient id="zincGrad" x1="1" y1="0" x2="0" y2="1">
        <Stop offset="0%" stopColor="#64748B" stopOpacity="0.1" />
        <Stop offset="100%" stopColor="#0F172A" stopOpacity="0.02" />
      </LinearGradient>

      {/* Gradiente de acento sutil (Amarillo/Warning) */}
      <LinearGradient id="accentGrad" x1="0.5" y1="0" x2="0.5" y2="1">
        <Stop offset="0%" stopColor="#FACC15" stopOpacity="0.08" />
        <Stop offset="100%" stopColor="#EA580C" stopOpacity="0.01" />
      </LinearGradient>
    </Defs>
  );
};
