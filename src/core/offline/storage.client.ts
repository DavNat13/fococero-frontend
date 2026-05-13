// src/core/offline/storage.client.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// ============================================================================
// MOTORES DE ALMACENAMIENTO Y ESTRATEGIAS DE PARTICIÓN
// ============================================================================
// Enfoque híbrido para maximizar compatibilidad, seguridad y rendimiento:
// - AsyncStorage para datos generales y caché (funciona en web y móvil)
// - SecureStore para datos sensibles (tokens JWT, perfiles) con encriptación nativa en móvil
// ============================================================================

const PREFIX = '@fococero_';

// 1. PARTICIÓN PÚBLICA (Configuraciones, caché menor)
export const globalStorage = {
  setItem: async (key: string, value: string) => {
    await AsyncStorage.setItem(`${PREFIX}global_${key}`, value);
  },
  getItem: async (key: string) => {
    return await AsyncStorage.getItem(`${PREFIX}global_${key}`);
  },
  removeItem: async (key: string) => {
    await AsyncStorage.removeItem(`${PREFIX}global_${key}`);
  },
};

// 2. PARTICIÓN SEGURA (Tokens JWT, Perfiles) - Encriptada por el Hardware del Teléfono
const sanitizeKey = (key: string): string => key.replace(/[^a-zA-Z0-9.\-_]/g, '_');

export const secureStorage = {
  setItem: async (key: string, value: string) => {
    if (!key || typeof key !== 'string') return;
    const fullKey = `${PREFIX}secure_${sanitizeKey(key)}`;
    if (Platform.OS === 'web') {
      return await AsyncStorage.setItem(fullKey, value);
    }
    try {
      await SecureStore.setItemAsync(fullKey, value);
    } catch (error) {
      await AsyncStorage.setItem(fullKey, value);
    }
  },
  getItem: async (key: string) => {
    if (!key || typeof key !== 'string') return null;
    const fullKey = `${PREFIX}secure_${sanitizeKey(key)}`;
    if (Platform.OS === 'web') {
      return await AsyncStorage.getItem(fullKey);
    }
    try {
      return await SecureStore.getItemAsync(fullKey);
    } catch (error) {
      return await AsyncStorage.getItem(fullKey);
    }
  },
  removeItem: async (key: string) => {
    if (!key || typeof key !== 'string') return;
    const fullKey = `${PREFIX}secure_${sanitizeKey(key)}`;
    if (Platform.OS === 'web') {
      return await AsyncStorage.removeItem(fullKey);
    }
    try {
      await SecureStore.deleteItemAsync(fullKey);
    } catch (error) {
      await AsyncStorage.removeItem(fullKey);
    }
  },
};

// 3. PARTICIÓN OUTBOX (Cola de peticiones Offline de Misión Crítica)
export const outboxStorage = {
  setItem: async (key: string, value: string) => {
    await AsyncStorage.setItem(`${PREFIX}outbox_${key}`, value);
  },
  getItem: async (key: string) => {
    return await AsyncStorage.getItem(`${PREFIX}outbox_${key}`);
  },
  removeItem: async (key: string) => {
    await AsyncStorage.removeItem(`${PREFIX}outbox_${key}`);
  },
};

// Utilidad de Misión Crítica: Limpieza absoluta (Kill Switch para el Logout)
export const wipeAllStorage = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const appKeys = keys.filter((k) => k.startsWith(PREFIX));
    await AsyncStorage.multiRemove(appKeys);

    // Limpiamos explícitamente tokens seguros si estamos en móvil
    if (Platform.OS !== 'web') {
      await SecureStore.deleteItemAsync(`${PREFIX}secure_access_token`);
      await SecureStore.deleteItemAsync(`${PREFIX}secure_refresh_token`);
    }
  } catch (error) {
    console.error('[Storage] Error ejecutando Kill Switch:', error);
  }
};
