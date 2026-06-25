import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  BackHandler,
  Modal,
  Pressable,
  Text,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type AlertVariant = 'danger' | 'warning' | 'info' | 'success';

interface AlertConfig {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: AlertVariant;
  confirmOnly?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
}

interface AlertContextValue {
  showAlert: (config: AlertConfig) => void;
}

const AlertContext = createContext<AlertContextValue | null>(null);

const VARIANTS: Record<
  AlertVariant,
  { icon: keyof typeof MaterialCommunityIcons.glyphMap; bg: string; btn: string }
> = {
  danger: { icon: 'alert-circle', bg: '#EF4444', btn: 'bg-red-500' },
  warning: { icon: 'alert', bg: '#F59E0B', btn: 'bg-amber-500' },
  info: { icon: 'information', bg: '#3B82F6', btn: 'bg-blue-500' },
  success: { icon: 'check-circle', bg: '#10B981', btn: 'bg-emerald-500' },
};

export function ConfirmAlertProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [cfg, setCfg] = useState<AlertConfig | null>(null);
  const [loading, setLoading] = useState(false);

  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.85)).current;

  const close = useCallback(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 0.85, duration: 150, useNativeDriver: true }),
    ]).start(() => {
      setVisible(false);
      setCfg(null);
      setLoading(false);
    });
  }, [fade, scale]);

  const showAlert = useCallback(
    (config: AlertConfig) => {
      setCfg(config);
      setVisible(true);
      setLoading(false);
      fade.setValue(0);
      scale.setValue(0.85);
      Animated.parallel([
        Animated.spring(fade, {
          toValue: 1,
          useNativeDriver: true,
          damping: 20,
          stiffness: 250,
          mass: 1,
        }),
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          damping: 15,
          stiffness: 200,
          mass: 1,
        }),
      ]).start();
    },
    [fade, scale],
  );

  React.useEffect(() => {
    const h = BackHandler.addEventListener('hardwareBackPress', () => {
      if (visible) {
        close();
        return true;
      }
      return false;
    });
    return () => h.remove();
  }, [visible, close]);

  const vc = cfg ? VARIANTS[cfg.variant || 'info'] : VARIANTS.info;

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <Modal visible={visible} transparent animationType="none" onRequestClose={close}>
        <Animated.View
          className="flex-1 items-center justify-center px-6"
          style={{ opacity: fade, backgroundColor: 'rgba(15,23,42,0.95)' }}
        >
          <Pressable className="absolute inset-0" onPress={close} />
          <Animated.View
            className="w-full items-center rounded-3xl border border-white/10 px-6 pb-6 pt-8 shadow-2xl shadow-black/50"
            style={{ transform: [{ scale }], backgroundColor: 'rgba(30,41,59,0.92)' }}
          >
            <Pressable
              className="absolute right-3 top-3 z-10 rounded-full p-1.5"
              onPress={close}
              hitSlop={12}
            >
              <MaterialCommunityIcons name="close" size={20} color="#94A3B8" />
            </Pressable>

            <View className="mb-5 items-center">
              <View
                className="h-16 w-16 items-center justify-center rounded-full"
                style={{ backgroundColor: `${vc.bg}1A` }}
              >
                <View
                  className="h-14 w-14 items-center justify-center rounded-full"
                  style={{ backgroundColor: vc.bg }}
                >
                  <MaterialCommunityIcons name={vc.icon} size={32} color="#FFFFFF" />
                </View>
              </View>
            </View>

            <Text className="mb-2 text-center text-xl font-bold text-white">
              {cfg?.title || ''}
            </Text>
            <Text className="mb-7 text-center text-sm leading-5 text-slate-400">
              {cfg?.description || ''}
            </Text>

            <View className="flex-row gap-3">
              {!cfg?.confirmOnly && (
                <Pressable
                  onPress={() => {
                    cfg?.onCancel?.();
                    close();
                  }}
                  disabled={loading}
                  className="flex-1 items-center rounded-xl border border-slate-600 py-3.5"
                >
                  <Text className="text-base font-semibold text-slate-300">
                    {cfg?.cancelLabel || 'Cancelar'}
                  </Text>
                </Pressable>
              )}
              <Pressable
                onPress={() => {
                  if (cfg?.isLoading) return;
                  setLoading(true);
                  cfg?.onConfirm();
                  close();
                }}
                disabled={loading}
                className={`flex-1 items-center rounded-xl py-3.5 ${vc.btn} ${loading ? 'opacity-50' : ''}`}
                style={cfg?.confirmOnly ? { flex: 2 } : undefined}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text className="text-base font-bold text-white">
                    {cfg?.confirmLabel || 'Aceptar'}
                  </Text>
                )}
              </Pressable>
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>
    </AlertContext.Provider>
  );
}

export function useAlert(): AlertContextValue {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error('useAlert debe estar dentro de <ConfirmAlertProvider>');
  return ctx;
}
