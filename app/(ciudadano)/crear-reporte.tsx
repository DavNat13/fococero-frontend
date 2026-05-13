// app/(ciudadano)/crear-reporte.tsx - Formulario de reporte
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaLayout } from '@/shared/ui/layouts/SafeAreaLayout';
import { Typography } from '@/shared/ui/atoms/Typography';
import { Button } from '@/shared/ui/atoms/Button';
import { Input } from '@/shared/ui/atoms/Input';

export default function CrearReporte() {
  const [descripcion, setDescripcion] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!descripcion.trim() || !ubicacion.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setIsSubmitting(true);
    // Simulación de envío
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert('Éxito', 'Reporte enviado correctamente');
      setDescripcion('');
      setUbicacion('');
    }, 1500);
  };

  return (
    <SafeAreaLayout variant="background">
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Typography variant="h1" className="text-white">
            Reportar incendio
          </Typography>
          <Typography variant="body" className="text-gray-400 mt-2">
            Ayuda a tu comunidad reportando fuegos o riesgos
          </Typography>
        </View>

        <View style={styles.form}>
          {/* Tipo de reporte */}
          <View style={styles.formGroup}>
            <Typography variant="body" className="text-white mb-2">
              Tipo de reporte
            </Typography>
            <View style={styles.typeOptions}>
              <View style={[styles.typeOption, styles.typeOptionActive]}>
                <Typography variant="body" className="text-white">
                  Incendio activo
                </Typography>
              </View>
              <View style={styles.typeOption}>
                <Typography variant="body" className="text-gray-400">
                  Riesgo potencial
                </Typography>
              </View>
            </View>
          </View>

          {/* Descripción */}
          <View style={styles.formGroup}>
            <Typography variant="body" className="text-white mb-2">
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
            <Typography variant="body" className="text-white mb-2">
              Ubicación
            </Typography>
            <Input
              placeholder="Ingresa la dirección o describe el lugar"
              value={ubicacion}
              onChangeText={setUbicacion}
              leftIcon="map-marker"
            />
          </View>

          {/* Fotos - Placeholder */}
          <View style={styles.formGroup}>
            <Typography variant="body" className="text-white mb-2">
              Evidencia (opcional)
            </Typography>
            <View style={styles.photoPlaceholder}>
              <Typography variant="body" className="text-gray-400">
                + Agregar foto
              </Typography>
            </View>
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
