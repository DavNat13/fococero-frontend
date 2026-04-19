// /fococero-frontend/metro.config.js

const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

const { transformer, resolver } = config;

// 1. Configuración del transformador para soportar SVGs como componentes
config.transformer = {
  ...transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
};

// 2. Configuración del resolvedor para separar archivos de imagen de vectores
config.resolver = {
  ...resolver,
  assetExts: resolver.assetExts.filter((ext) => ext !== 'svg'),
  sourceExts: [...resolver.sourceExts, 'svg'],
};

// 3. Envoltura final con NativeWind apuntando al CSS global
module.exports = withNativeWind(config, { input: './global.css' });
