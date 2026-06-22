import React, { useCallback, useEffect, useRef } from 'react';
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
let Haptics: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  Haptics = require('expo-haptics');
} catch {}

interface ConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info' | 'success';
  isLoading?: boolean;
}

const V = {
  danger: { icon: 'alert-circle' as const, bg: '#EF4444', btn: 'bg-red-500' },
  warning: { icon: 'alert' as const, bg: '#F59E0B', btn: 'bg-amber-500' },
  info: { icon: 'information' as const, bg: '#3B82F6', btn: 'bg-blue-500' },
  success: { icon: 'check-circle' as const, bg: '#10B981', btn: 'bg-emerald-500' },
};

export const ConfirmModal = ({
  visible,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  isLoading = false,
}: ConfirmModalProps) => {
  const f = useRef(new Animated.Value(0)).current;
  const s = useRef(new Animated.Value(0.85)).current;
  const cs = useRef(new Animated.Value(1)).current;

  const out = useCallback(() => {
    Animated.parallel([
      Animated.timing(f, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(s, { toValue: 0.85, duration: 150, useNativeDriver: true }),
    ]).start(() => onClose());
  }, [f, s, onClose]);

  useEffect(() => {
    if (visible) {
      f.setValue(0);
      s.setValue(0.85);
      Animated.parallel([
        Animated.spring(f, {
          toValue: 1,
          useNativeDriver: true,
          damping: 20,
          stiffness: 250,
          mass: 1,
        }),
        Animated.spring(s, {
          toValue: 1,
          useNativeDriver: true,
          damping: 15,
          stiffness: 200,
          mass: 1,
        }),
      ]).start();
      if (Haptics?.impactAsync)
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    }
  }, [visible, f, s]);

  useEffect(() => {
    const h = BackHandler.addEventListener('hardwareBackPress', () => {
      if (visible) {
        out();
        return true;
      }
      return false;
    });
    return () => h.remove();
  }, [visible, out]);

  const onConfirmPress = () => {
    if (Haptics?.impactAsync)
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onConfirm();
  };

  const pressIn = () =>
    Animated.spring(cs, {
      toValue: 0.95,
      useNativeDriver: true,
      damping: 15,
      stiffness: 300,
    }).start();
  const pressOut = () =>
    Animated.spring(cs, { toValue: 1, useNativeDriver: true, damping: 15, stiffness: 300 }).start();

  const vc = V[variant];

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={out}>
      <Animated.View
        className="flex-1 items-center justify-center px-6"
        style={{ opacity: f, backgroundColor: 'rgba(15,23,42,0.95)' }}
      >
        <Pressable className="absolute inset-0" onPress={out} />
        <Animated.View
          className="w-full items-center rounded-3xl border border-white/10 px-6 pb-6 pt-8 shadow-2xl shadow-black/50"
          style={{ transform: [{ scale: s }], backgroundColor: 'rgba(30,41,59,0.92)' }}
        >
          <Pressable
            className="absolute right-3 top-3 z-10 rounded-full p-1.5"
            onPress={out}
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
          <Text className="mb-2 text-center text-xl font-bold text-white">{title}</Text>
          <Text className="mb-7 text-center text-sm leading-5 text-slate-400">{description}</Text>
          <View className="flex-row gap-3">
            <Pressable
              onPress={out}
              disabled={isLoading}
              className={`flex-1 items-center rounded-xl border border-slate-600 py-3.5 ${isLoading ? 'opacity-50' : 'active:bg-slate-700/50'}`}
            >
              <Text className="text-base font-semibold text-slate-300">{cancelLabel}</Text>
            </Pressable>
            <Pressable
              onPress={onConfirmPress}
              onPressIn={pressIn}
              onPressOut={pressOut}
              disabled={isLoading}
              className={`flex-1 items-center rounded-xl py-3.5 ${vc.btn} ${isLoading ? 'opacity-50' : ''}`}
            >
              <Animated.View style={{ transform: [{ scale: cs }] }}>
                {isLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text className="text-base font-bold text-white">{confirmLabel}</Text>
                )}
              </Animated.View>
            </Pressable>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};
