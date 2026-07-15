import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Keyboard } from 'react-native';
import { useCreateReporte, type CrearReportePayload } from '@/entities/reporte';
import { crearReporteSchema, type CrearReporteFormData } from '../schemas/crearReporte.schema';

interface UseCrearReporteFormOptions {
  initialLatitud?: number;
  initialLongitud?: number;
  initialCategoriaId?: string;
  onSuccess: () => void;
  onError: (message: string) => void;
}

export function useCrearReporteForm(options: UseCrearReporteFormOptions) {
  const { initialLatitud, initialLongitud, initialCategoriaId, onSuccess, onError } = options;
  const { mutateAsync: crearReporte, isPending: isSubmitting } = useCreateReporte();

  const form = useForm<CrearReporteFormData>({
    resolver: zodResolver(crearReporteSchema),
    defaultValues: {
      categoria_id: initialCategoriaId ?? '',
      titulo: '',
      descripcion: '',
      latitud: initialLatitud ?? (0 as number),
      longitud: initialLongitud ?? (0 as number),
      id_multimedia: undefined,
    },
    mode: 'onTouched',
  });

  const onSubmit = async (data: CrearReporteFormData) => {
    Keyboard.dismiss();
    try {
      const payload: CrearReportePayload = {
        categoria_id: data.categoria_id,
        titulo: data.titulo,
        descripcion: data.descripcion,
        latitud: data.latitud,
        longitud: data.longitud,
      };
      if (data.id_multimedia) {
        payload.id_multimedia = data.id_multimedia;
      }
      await crearReporte(payload);
      onSuccess();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al crear el reporte';
      onError(message);
    }
  };

  const setUbicacion = (lat: number, lng: number) => {
    form.setValue('latitud', lat, { shouldValidate: true });
    form.setValue('longitud', lng, { shouldValidate: true });
  };

  return {
    form,
    handleSubmit: form.handleSubmit(onSubmit),
    isSubmitting,
    setUbicacion,
  };
}
