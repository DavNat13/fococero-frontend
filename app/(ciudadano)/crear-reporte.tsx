// app/(ciudadano)/crear-reporte.tsx - Formulario de reporte
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaLayout } from '@/shared/ui/layouts/SafeAreaLayout';
import { KeyboardScrollLayout } from '@/shared/ui/layouts/KeyboardScrollLayout';
import { Typography } from '@/shared/ui/atoms/Typography';
import { Button } from '@/shared/ui/atoms/Button';
import { Input } from '@/shared/ui/atoms/Input';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { z } from 'zod';
import { reporteApi, useReporteFeature } from '@/entities/reporte';

const reporteSchema = z.object({
  descripcion: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  ubicacion: z.string().min(5, 'La ubicación debe tener al menos 5 caracteres'),
});

export default function CrearReporte() {
  const [descripcion, setDescripcion] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [latitud, setLatitud] = useState(0);
  const [longitud, setLongitud] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string>('Obteniendo ubicación...');
  const [imagenSeleccionada, setImagenSeleccionada] = useState<string | null>(null);
  const { categorias } = useReporteFeature();

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Se necesita acceso a la galería para adjuntar fotos');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets.length > 0) {
      setImagenSeleccionada(result.assets[0].uri);
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationStatus('Permiso de ubicación denegado');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setLatitud(loc.coords.latitude);
      setLongitud(loc.coords.longitude);
      setLocationStatus('Ubicación obtenida');
    })();
  }, []);

  useEffect(() => {
    if (categorias.length > 0 && !categoriaId) {
      setCategoriaId(categorias[0].id);
    }
  }, [categorias, categoriaId]);

  const handleSubmit = async () => {
    const validation = reporteSchema.safeParse({ descripcion, ubicacion });
    if (!validation.success) {
      const firstError = validation.error.issues[0];
      Alert.alert('Error de validación', firstError?.message || 'Datos inválidos');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await reporteApi.crear({
        titulo: 'Reporte desde la app',
        descripcion,
        categoriaId: categoriaId || '1',
        latitud,
        longitud,
        direccion: ubicacion,
      });

      if (response.success) {
        Alert.alert('Éxito', 'Reporte enviado correctamente');
        setDescripcion('');
        setUbicacion('');
        setCategoriaId(categorias[0]?.id || '');
      } else {
        Alert.alert(
          'Error al enviar',
          response.error?.message || 'No se pudo enviar el reporte. Intenta nuevamente.',
        );
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error inesperado al enviar el reporte';
      Alert.alert('Error', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaLayout variant="background">
      <KeyboardScrollLayout>
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          <View style={styles.header}>
            <Typography variant="h1" className="text-white">
              Reportar incendio
            </Typography>
            <Typography variant="body" className="mt-2 text-gray-400">
              Ayuda a tu comunidad reportando fuegos o riesgos
            </Typography>
          </View>

          <View style={styles.form}>
            {/* Categoría */}
            <View style={styles.formGroup}>
              <Typography variant="body" className="mb-2 text-white">
                Categoría
              </Typography>
              <View style={styles.typeOptions}>
                {categorias.length > 0 ? (
                  categorias.map((cat) => (
                    <TouchableOpacity
                      key={cat.id}
                      style={[styles.typeOption, categoriaId === cat.id && styles.typeOptionActive]}
                      onPress={() => setCategoriaId(cat.id)}
                      accessibilityLabel={cat.nombre}
                      accessibilityRole="button"
                    >
                      <Typography
                        variant="body"
                        className={categoriaId === cat.id ? 'text-white' : 'text-gray-400'}
                      >
                        {cat.nombre}
                      </Typography>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Typography variant="body" className="text-gray-500">
                    Cargando categorías...
                  </Typography>
                )}
              </View>
            </View>

            {/* Descripción */}
            <View style={styles.formGroup}>
              <Typography variant="body" className="mb-2 text-white">
                Descripción
              </Typography>
              <Input
                placeholder="Describe lo que observaste..."
                value={descripcion}
                onChangeText={setDescripcion}
                multiline
                numberOfLines={4}
                className="h-32 text-white"
              />
            </View>

            {/* Ubicación */}
            <View style={styles.formGroup}>
              <Typography variant="body" className="mb-2 text-white">
                Ubicación
              </Typography>
              <Input
                placeholder="Ingresa la dirección o describe el lugar"
                value={ubicacion}
                onChangeText={setUbicacion}
                leftIcon="map-marker"
              />
            </View>

            {/* Estado de ubicación automática */}
            <View style={styles.formGroup}>
              <Typography variant="body" className="mb-2 text-white">
                Ubicación automática
              </Typography>
              <View style={styles.locationStatus}>
                <Typography variant="body" className="text-gray-400">
                  {locationStatus}
                  {latitud !== 0 && longitud !== 0
                    ? ` (${latitud.toFixed(4)}, ${longitud.toFixed(4)})`
                    : ''}
                </Typography>
              </View>
            </View>

            {/* Evidencia fotográfica */}
            <View style={styles.formGroup}>
              <Typography variant="body" className="mb-2 text-white">
                Evidencia (opcional)
              </Typography>
              <TouchableOpacity
                style={styles.photoPlaceholder}
                onPress={handlePickImage}
                accessibilityLabel="Agregar foto"
                accessibilityRole="button"
              >
                {imagenSeleccionada ? (
                  <Typography variant="body" className="text-green-400">
                    Foto seleccionada ✓
                  </Typography>
                ) : (
                  <>
                    <MaterialCommunityIcons name="camera-plus" size={24} color="#4B5563" />
                    <Typography variant="body" className="mt-2 text-gray-400">
                      + Agregar foto
                    </Typography>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Botón de envío */}
            <Button
              label="Enviar reporte"
              variant="solid"
              size="lg"
              onPress={handleSubmit}
              isLoading={isSubmitting}
              className="mt-6"
            />
          </View>
        </ScrollView>
      </KeyboardScrollLayout>
    </SafeAreaLayout>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
  },
  form: {
    gap: 20,
  },
  formGroup: {
    gap: 8,
  },
  typeOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  typeOption: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#1F2937',
    alignItems: 'center',
  },
  typeOptionActive: {
    backgroundColor: '#DC2626',
  },
  locationStatus: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPlaceholder: {
    height: 120,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#4B5563',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
