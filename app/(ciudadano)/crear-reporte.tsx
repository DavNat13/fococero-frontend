import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  ActivityIndicator,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { useForm, Controller, useFormState } from 'react-hook-form';
import { useCreateReporte } from '@/entities/reporte';
import { useGetCategorias } from '@/entities/reporte/api/queries';
import type { Categoria } from '@/entities/reporte';

const CI: Record<string, string> = {
  Incendio: 'fire',
  Inundación: 'water',
  Accidente: 'car',
  Otro: 'help-circle',
};

type FormValues = {
  titulo: string;
  descripcion: string;
  categoria_id: string;
};

// ---------------------------------------------------------------------------
// CategorySelector — solo se re-renderiza si cambian categorías o selección
// ---------------------------------------------------------------------------

const CategorySelector = memo(function CategorySelector({
  categorias,
  value,
  onChange,
}: {
  categorias: Categoria[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View className="flex-row gap-2">
        {categorias.map((c) => {
          const s = c.id === value;
          const icon = CI[c.nombre] || 'help-circle';
          return (
            <TouchableOpacity
              key={c.id}
              onPress={() => {
                console.log('[DEBUG] Categoría seleccionada:', c.id, c.nombre);
                onChange(c.id);
              }}
              className={`flex-row items-center gap-2 rounded-full px-4 py-2.5 ${s ? 'bg-brand-primary' : 'border border-surface-elevated bg-surface-card'}`}
            >
              <MaterialCommunityIcons name={icon as any} size={18} color={s ? '#FFF' : '#9CA3AF'} />
              <Text
                className={`font-inter text-sm font-medium ${s ? 'text-white' : 'text-content-secondary'}`}
              >
                {c.nombre}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
});

// ---------------------------------------------------------------------------
// SubmitButton — usa useFormState para reaccionar a validez sin re-renderizar
// el árbol entero
// ---------------------------------------------------------------------------

const SubmitButton = memo(function SubmitButton({
  control,
  isPending,
  onPress,
}: {
  control: any;
  isPending: boolean;
  onPress: () => void;
}) {
  const { isValid } = useFormState({ control });
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!isValid || isPending}
      className={`h-14 flex-row items-center justify-center gap-2 rounded-2xl ${isValid && !isPending ? 'bg-brand-primary shadow-lg shadow-brand-primary/30' : 'bg-surface-elevated'}`}
    >
      {isPending ? (
        <ActivityIndicator size="small" color="#FFF" />
      ) : (
        <>
          <MaterialCommunityIcons name="send" size={20} color={isValid ? '#FFF' : '#6B7280'} />
          <Text
            className={`font-inter text-base font-semibold ${isValid ? 'text-white' : 'text-content-tertiary'}`}
          >
            Enviar Reporte
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
});

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function CrearReporte() {
  const { data: categoriasRaw } = useGetCategorias();
  const categorias = useMemo(() => categoriasRaw || [], [categoriasRaw]);
  const { mutateAsync: cr, isPending } = useCreateReporte();

  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [dir, setDir] = useState('');
  const [img, setImg] = useState<string | null>(null);
  const [locBusy, setLocBusy] = useState(false);

  const { control, handleSubmit, watch, setValue } = useForm<FormValues>({
    defaultValues: { titulo: '', descripcion: '', categoria_id: '' },
    mode: 'onChange',
  });

  const catId = watch('categoria_id');

  // Seleccionar primera categoría por defecto cuando se cargan
  useEffect(() => {
    console.log('[DEBUG] useEffect categorias:', {
      tieneCategorias: !!categorias[0]?.id,
      catId,
      cats: categorias.map((c) => ({ id: c.id, nombre: c.nombre })),
    });
    if (!categorias[0]?.id || catId) return;
    setValue('categoria_id', categorias[0].id);
  }, [categorias, catId, setValue]);

  // --- Location --------------------------------------------------------------

  const getLoc = useCallback(async () => {
    setLocBusy(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado');
        return;
      }
      const l = await Location.getCurrentPositionAsync({});
      setLat(l.coords.latitude);
      setLng(l.coords.longitude);
      const [a] = await Location.reverseGeocodeAsync(l.coords);
      if (a) setDir([a.street, a.name, a.subregion, a.city].filter(Boolean).join(', '));
    } catch {
      Alert.alert('Error', 'No se pudo obtener la ubicación');
    } finally {
      setLocBusy(false);
    }
  }, []);

  // --- Image picker ----------------------------------------------------------

  const pickImg = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido');
      return;
    }
    const r = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });
    if (!r.canceled) setImg(r.assets[0].uri);
  }, []);

  // --- Submit handler --------------------------------------------------------

  const onSubmit = useCallback(
    async (data: FormValues) => {
      try {
        await cr({
          titulo: data.titulo.trim(),
          descripcion: data.descripcion,
          categoria_id: data.categoria_id,
          latitud: lat,
          longitud: lng,
          direccion: dir || undefined,
        });
        Alert.alert('Éxito', 'Reporte enviado correctamente');
        router.back();
      } catch (e) {
        Alert.alert('Error', e instanceof Error ? e.message : 'Error al enviar');
      }
    },
    [lat, lng, dir, cr],
  );

  const submit = useMemo(() => handleSubmit(onSubmit), [handleSubmit, onSubmit]);

  // --- Render ----------------------------------------------------------------

  return (
    <SafeAreaView className="flex-1 bg-surface-background">
      <View className="h-14 flex-row items-center justify-between border-b border-surface-elevated px-4">
        <View className="flex-row items-center gap-3">
          <MaterialCommunityIcons name="file-document-edit" size={22} color="#EA580C" />
          <Text className="font-inter text-lg font-semibold text-content-primary">
            Nuevo Reporte
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-full bg-surface-card"
        >
          <MaterialCommunityIcons name="close" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="gap-6 pb-8">
          {/* Categoría */}
          <View className="gap-3">
            <Text className="font-inter text-sm font-medium text-content-secondary">Categoría</Text>
            <Controller
              control={control}
              name="categoria_id"
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <CategorySelector categorias={categorias} value={value} onChange={onChange} />
              )}
            />
          </View>

          {/* Título */}
          <View className="gap-2">
            <Text className="font-inter text-sm font-medium text-content-secondary">Título</Text>
            <Controller
              control={control}
              name="titulo"
              rules={{ required: true, validate: (v) => v.trim().length > 0 }}
              render={({ field: { value, onChange } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="¿Qué ocurrió?"
                  placeholderTextColor="#6B7280"
                  className="h-12 rounded-xl border-2 border-surface-elevated bg-surface-card/50 px-4 font-inter text-base text-content-primary"
                  editable={!isPending}
                />
              )}
            />
          </View>

          {/* Descripción */}
          <View className="gap-2">
            <Text className="font-inter text-sm font-medium text-content-secondary">
              Descripción
            </Text>
            <Controller
              control={control}
              name="descripcion"
              render={({ field: { value, onChange } }) => (
                <>
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="Describe los detalles..."
                    placeholderTextColor="#6B7280"
                    multiline
                    numberOfLines={4}
                    className="h-24 rounded-xl border-2 border-surface-elevated bg-surface-card/50 px-4 pt-3 font-inter text-base text-content-primary"
                    textAlignVertical="top"
                    maxLength={500}
                    editable={!isPending}
                  />
                  <Text className="text-right font-inter text-xs text-content-tertiary">
                    {value.length}/500
                  </Text>
                </>
              )}
            />
          </View>

          {/* Ubicación */}
          <View className="gap-3">
            <Text className="font-inter text-sm font-medium text-content-secondary">Ubicación</Text>
            {dir ? (
              <View className="flex-row items-start gap-3 rounded-xl border border-surface-elevated bg-surface-card p-3">
                <MaterialCommunityIcons
                  name="map-marker"
                  size={18}
                  color="#10B981"
                  style={{ marginTop: 2 }}
                />
                <View className="flex-1">
                  <Text className="font-inter text-sm text-content-primary" numberOfLines={2}>
                    {dir}
                  </Text>
                  <Text className="mt-1 font-inter text-xs text-content-tertiary">
                    {lat.toFixed(5)}, {lng.toFixed(5)}
                  </Text>
                </View>
                <TouchableOpacity onPress={getLoc} disabled={locBusy}>
                  <MaterialCommunityIcons name="refresh" size={18} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
            ) : (
              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={getLoc}
                  disabled={locBusy}
                  className="h-12 flex-1 flex-row items-center justify-center gap-2 rounded-xl border border-surface-elevated bg-surface-card"
                >
                  {locBusy ? (
                    <ActivityIndicator size="small" color="#EA580C" />
                  ) : (
                    <>
                      <MaterialCommunityIcons name="crosshairs-gps" size={18} color="#EA580C" />
                      <Text className="font-inter text-sm font-medium text-brand-primary">
                        Usar ubicación actual
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
                <TouchableOpacity className="h-12 flex-row items-center justify-center gap-2 rounded-xl border border-surface-elevated bg-surface-card px-4">
                  <MaterialCommunityIcons name="map-search" size={18} color="#9CA3AF" />
                  <Text className="font-inter text-sm text-content-secondary">
                    Seleccionar en mapa
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            {!dir && lat !== 0 && (
              <Text className="text-center font-inter text-xs text-content-tertiary">
                {lat.toFixed(5)}, {lng.toFixed(5)}
              </Text>
            )}
          </View>

          {/* Foto */}
          <View className="gap-3">
            <Text className="font-inter text-sm font-medium text-content-secondary">
              Foto (opcional)
            </Text>
            {img ? (
              <View className="relative">
                <Image
                  source={{ uri: img }}
                  className="h-48 w-full rounded-xl"
                  resizeMode="cover"
                />
                <TouchableOpacity
                  onPress={() => setImg(null)}
                  className="absolute right-2 top-2 h-8 w-8 items-center justify-center rounded-full bg-black/60"
                >
                  <MaterialCommunityIcons name="close" size={16} color="#FFF" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={pickImg}
                className="h-24 items-center justify-center rounded-xl border-2 border-dashed border-surface-elevated active:bg-surface-card"
              >
                <MaterialCommunityIcons name="camera-plus-outline" size={28} color="#6B7280" />
                <Text className="mt-1 font-inter text-sm text-content-tertiary">Agregar foto</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Botón enviar */}
          <SubmitButton control={control} isPending={isPending} onPress={submit} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
