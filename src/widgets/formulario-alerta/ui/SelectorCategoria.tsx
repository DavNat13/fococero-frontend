import React from 'react';
import { View, ActivityIndicator, TouchableOpacity } from 'react-native';
import type { Control } from 'react-hook-form';
import { useGetCategorias } from '@/entities/reporte';
import { Typography } from '@/shared/ui/atoms/Typography';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { CrearReporteFormData } from '../schemas/crearReporte.schema';

interface SelectorCategoriaProps {
  control: Control<CrearReporteFormData>;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function SelectorCategoria({ value, onChange, error }: SelectorCategoriaProps) {
  const { data: categorias, isLoading, error: fetchError } = useGetCategorias();

  if (isLoading) {
    return (
      <View className="h-40 items-center justify-center rounded-2xl bg-slate-800/50">
        <ActivityIndicator size="small" color="#EA580C" />
        <Typography variant="caption" color="secondary" className="mt-2">
          Cargando categorías...
        </Typography>
      </View>
    );
  }

  if (fetchError || !categorias) {
    return (
      <View className="h-40 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
        <MaterialCommunityIcons name="alert-circle" size={24} color="#EF4444" />
        <Typography variant="caption" color="danger" className="mt-2">
          Error al cargar categorías
        </Typography>
      </View>
    );
  }

  return (
    <View className="w-full">
      <Typography variant="caption" color="secondary" className="mb-3 ml-1 uppercase">
        Categoría
      </Typography>
      <View className="gap-3">
        {categorias.map((cat) => {
          const isSelected = value === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              onPress={() => onChange(cat.id)}
              activeOpacity={0.7}
              accessibilityLabel={`Categoría: ${cat.nombre}`}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              className={`flex-row items-center rounded-2xl border p-4 transition-colors ${
                isSelected ? 'border-[#EA580C] bg-[#EA580C]/10' : 'border-slate-700 bg-slate-800/50'
              }`}
            >
              <View
                className={`mr-4 h-6 w-6 items-center justify-center rounded-full border-2 ${
                  isSelected ? 'border-[#EA580C]' : 'border-slate-500'
                }`}
              >
                {isSelected && <View className="h-3 w-3 rounded-full bg-[#EA580C]" />}
              </View>
              <View className="flex-1">
                <View className="flex-row items-center gap-2">
                  <Typography variant="h3" color={isSelected ? 'primary' : 'secondary'}>
                    {cat.nombre}
                  </Typography>
                  {cat.nivel_prioridad !== undefined && cat.nivel_prioridad >= 4 && (
                    <View className="rounded-full bg-red-500/20 px-2 py-0.5">
                      <Typography variant="caption" color="danger">
                        Urgente
                      </Typography>
                    </View>
                  )}
                </View>
                {cat.descripcion && (
                  <Typography variant="caption" color="tertiary" className="mt-0.5">
                    {cat.descripcion}
                  </Typography>
                )}
              </View>
              {isSelected && (
                <MaterialCommunityIcons name="check-circle" size={20} color="#EA580C" />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
      {error && (
        <Typography variant="caption" color="danger" className="ml-1 mt-2">
          {error}
        </Typography>
      )}
    </View>
  );
}
