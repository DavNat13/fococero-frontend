// app/(brigadista)/editar-perfil-brigadista.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaLayout } from '@/shared/ui/layouts/SafeAreaLayout';
import { Typography } from '@/shared/ui/atoms/Typography';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { authApi } from '@/features/auth';
import { router } from 'expo-router';
import type { PerfilBrigadista } from '@entities/usuario';

interface FormState {
  organismo: string;
  rango: string;
  zona_asignada: string;
  numero_placa: string;
  fecha_ingreso: string;
}

const INITIAL_FORM: FormState = {
  organismo: '',
  rango: '',
  zona_asignada: '',
  numero_placa: '',
  fecha_ingreso: '',
};

export default function EditarPerfilBrigadista() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await authApi.getPerfilBrigadista();
        if (res.success && res.data?.usuario?.perfil_brigadista) {
          const p = res.data.usuario.perfil_brigadista;
          setForm({
            organismo: p.organismo || '',
            rango: p.rango || '',
            zona_asignada: p.zona_asignada || '',
            numero_placa: p.numero_placa || '',
            fecha_ingreso: p.fecha_ingreso || '',
          });
        }
      } catch {
        setError('Error al cargar datos del perfil.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSave = async () => {
    setError(null);

    if (!form.organismo.trim()) {
      setError('El organismo es requerido.');
      return;
    }
    if (!form.rango.trim()) {
      setError('El rango es requerido.');
      return;
    }
    if (!form.zona_asignada.trim()) {
      setError('La zona asignada es requerida.');
      return;
    }
    if (!form.numero_placa.trim()) {
      setError('El número de placa es requerido.');
      return;
    }

    setSaving(true);
    try {
      const payload: Partial<PerfilBrigadista> = {
        organismo: form.organismo.trim(),
        rango: form.rango.trim(),
        zona_asignada: form.zona_asignada.trim(),
        numero_placa: form.numero_placa.trim(),
      };
      if (form.fecha_ingreso.trim()) {
        payload.fecha_ingreso = form.fecha_ingreso.trim();
      }

      const res = await authApi.updatePerfilBrigadista(payload);
      if (res.success) {
        Alert.alert('Perfil actualizado', 'Los datos del brigadista se guardaron correctamente.', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      } else {
        setError(res.error?.message || 'Error al guardar el perfil.');
      }
    } catch {
      setError('Error de conexión al guardar.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaLayout variant="background">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#EF4444" />
          <Typography variant="body" className="mt-4 text-gray-400">
            Cargando datos del perfil...
          </Typography>
        </View>
      </SafeAreaLayout>
    );
  }

  return (
    <SafeAreaLayout variant="background">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 px-4 pb-8"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View className="flex-row items-center pb-4 pt-2">
            <TouchableOpacity
              onPress={() => router.back()}
              className="mr-3 p-2"
              accessibilityLabel="Volver"
              accessibilityRole="button"
            >
              <MaterialCommunityIcons name="arrow-left" size={24} color="#9CA3AF" />
            </TouchableOpacity>
            <Typography variant="h2" className="text-white">
              Editar Perfil Brigadista
            </Typography>
          </View>

          {/* Error */}
          {error && (
            <View className="mb-4 rounded-2xl bg-red-900/50 p-4">
              <Typography variant="caption" className="text-red-400">
                {error}
              </Typography>
            </View>
          )}

          {/* Form Fields */}
          <View className="rounded-2xl bg-slate-800 p-4">
            {(
              [
                { key: 'organismo', label: 'Organismo', icon: 'domain' as const, required: true },
                {
                  key: 'rango',
                  label: 'Rango',
                  icon: 'chevron-triple-up' as const,
                  required: true,
                },
                {
                  key: 'zona_asignada',
                  label: 'Zona Asignada',
                  icon: 'map-marker-radius' as const,
                  required: true,
                },
                {
                  key: 'numero_placa',
                  label: 'N° Placa',
                  icon: 'card-bulleted-outline' as const,
                  required: true,
                },
                {
                  key: 'fecha_ingreso',
                  label: 'Fecha Ingreso (YYYY-MM-DD)',
                  icon: 'calendar' as const,
                  required: false,
                },
              ] as const
            ).map((field) => (
              <View key={field.key} className="mb-4">
                <View className="mb-2 flex-row items-center">
                  <MaterialCommunityIcons name={field.icon} size={16} color="#9CA3AF" />
                  <Typography variant="caption" className="ml-2 text-gray-400">
                    {field.label}
                    {field.required && (
                      <Typography variant="caption" className="text-red-500">
                        {' '}
                        *
                      </Typography>
                    )}
                  </Typography>
                </View>
                <View className="h-14 flex-row items-center rounded-2xl border border-slate-700 bg-slate-900/50 px-4">
                  <TextInput
                    className="flex-1 text-base text-slate-100"
                    placeholderTextColor="#64748B"
                    placeholder={
                      field.required ? `Ingrese ${field.label.toLowerCase()}` : 'Opcional'
                    }
                    value={form[field.key]}
                    onChangeText={(v) => handleChange(field.key, v)}
                    autoCapitalize="none"
                  />
                </View>
              </View>
            ))}
          </View>

          {/* Save Button */}
          <TouchableOpacity
            className="mt-6 h-14 items-center justify-center rounded-2xl bg-red-600"
            onPress={handleSave}
            disabled={saving}
            accessibilityLabel="Guardar cambios"
            accessibilityRole="button"
          >
            {saving ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Typography variant="body" className="font-semibold text-white">
                Guardar Cambios
              </Typography>
            )}
          </TouchableOpacity>

          {/* Cancel Button */}
          <TouchableOpacity
            className="mt-3 h-14 items-center justify-center rounded-2xl border border-slate-700 bg-slate-800"
            onPress={() => router.back()}
            disabled={saving}
            accessibilityLabel="Cancelar"
            accessibilityRole="button"
          >
            <Typography variant="body" className="text-gray-400">
              Cancelar
            </Typography>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaLayout>
  );
}
