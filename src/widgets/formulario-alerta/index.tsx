import React, { useCallback, useEffect } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Typography } from '@/shared/ui/atoms/Typography';
import { Button } from '@/shared/ui/atoms/Button';
import { Card } from '@/shared/ui/atoms/Card';
import { OfflineBanner } from '@/shared/ui/molecules/OfflineBanner';
import { ControlledInput } from '@/shared/ui/forms';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useGetCategorias } from '@/entities/reporte';
import { useCrearReporteForm } from './hooks/useCrearReporteForm';
import { SelectorCategoria } from './ui/SelectorCategoria';
import { SelectorUbicacion } from './ui/SelectorUbicacion';
import { EvidenciaUploader } from './ui/EvidenciaUploader';

const TIPO_CATEGORIA_NAMES: Record<string, string> = {
  incendio: 'Incendio Forestal',
  quema_controlada: 'Foco de Basura',
  columna_humo: 'Incendio Forestal',
};

interface FormularioAlertaProps {
  initialLatitud?: number;
  initialLongitud?: number;
  initialTipo?: string;
  onSuccess: () => void;
  onError: (message: string) => void;
}

function CardSection({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="border border-slate-700/50">
      <View className="mb-3 flex-row items-center gap-2">
        <View className="h-8 w-8 items-center justify-center rounded-lg bg-[#EA580C]/15">
          <MaterialCommunityIcons name={icon as any} size={18} color="#EA580C" />
        </View>
        <Typography
          variant="label"
          color="secondary"
          className="font-semibold uppercase tracking-wider"
        >
          {title}
        </Typography>
      </View>
      {children}
    </Card>
  );
}

export function FormularioAlerta({
  initialLatitud,
  initialLongitud,
  initialTipo,
  onSuccess,
  onError,
}: FormularioAlertaProps) {
  const { form, handleSubmit, isSubmitting, setUbicacion } = useCrearReporteForm({
    initialLatitud,
    initialLongitud,
    onSuccess,
    onError,
  });

  const { data: categorias } = useGetCategorias();
  const latitud = form.watch('latitud');
  const longitud = form.watch('longitud');
  const idMultimedia = form.watch('id_multimedia');

  const [selectedCatId, setSelectedCatId] = React.useState<string>('');

  useEffect(() => {
    if (!initialTipo || !categorias?.length) return;
    const catName = TIPO_CATEGORIA_NAMES[initialTipo];
    if (!catName) return;
    const match = categorias.find((c) => c.nombre.toLowerCase() === catName.toLowerCase());
    if (match && match.id !== selectedCatId) {
      setSelectedCatId(match.id);
      form.setValue('categoria_id', match.id);
    }
  }, [initialTipo, categorias, form, selectedCatId]);

  const handleCategoriaChange = useCallback(
    (catId: string) => {
      setSelectedCatId(catId);
      form.setValue('categoria_id', catId, { shouldValidate: true });
    },
    [form],
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1"
      keyboardVerticalOffset={Platform.OS === 'ios' ? 16 : 0}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 120 : 100 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="gap-5 px-4 pt-4">
          <OfflineBanner />

          <View className="mb-1">
            <Typography variant="h1" className="text-white">
              Nuevo Reporte
            </Typography>
            <Typography variant="body" color="secondary" className="mt-1">
              Reporta un incendio, columna de humo u otro incidente
            </Typography>
          </View>

          <Card className="border border-slate-700/50">
            <SelectorCategoria
              control={form.control}
              value={selectedCatId}
              onChange={handleCategoriaChange}
              error={form.formState.errors.categoria_id?.message}
            />
          </Card>

          <CardSection icon="text-box-outline" title="Detalles">
            <View className="gap-4">
              <ControlledInput
                control={form.control}
                name="titulo"
                label="Título"
                placeholder="Ej: Incendio en cerro San Cristóbal"
                leftIcon={<MaterialCommunityIcons name="fire" size={20} color="#EA580C" />}
              />

              <ControlledInput
                control={form.control}
                name="descripcion"
                label="Descripción"
                placeholder="Describe lo que observas (magnitud, ubicación exacta, etc.)"
                multiline
              />
            </View>
          </CardSection>

          <CardSection icon="map-marker" title="Ubicación">
            <SelectorUbicacion
              latitud={latitud}
              longitud={longitud}
              onUbicacionChange={setUbicacion}
            />
          </CardSection>

          <CardSection icon="camera" title="Evidencia">
            <EvidenciaUploader
              idMultimedia={idMultimedia}
              onChange={(id) => form.setValue('id_multimedia', id)}
            />
          </CardSection>

          <Button
            label={isSubmitting ? 'Enviando reporte...' : 'Enviar reporte'}
            onPress={handleSubmit}
            isLoading={isSubmitting}
            disabled={isSubmitting}
            variant="solid"
            size="lg"
            leftIcon={<MaterialCommunityIcons name="send" size={20} color="#FFFFFF" />}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
