// src/widgets/auth/ui/WelcomeWidget.tsx
import React, { useState } from 'react';
import { Modal, ScrollView, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';

// Importamos componentes de la capa Shared
// Nota: Para que este hardcodeo funcione, asumimos que Button y Typography
// aceptan className para sobreescribir estilos.
import { Button, Icon, Icons, SafeAreaLayout, Typography } from '@shared/ui';

import { AUTH_TEXTS } from '../constants';
import { WELCOME_CHOREOGRAPHY } from '../lib';

interface WelcomeWidgetProps {
  onCreateAccountPress: () => void;
  onHaveAccountPress: () => void;
}

export const WelcomeWidget = ({ onCreateAccountPress, onHaveAccountPress }: WelcomeWidgetProps) => {
  // Estado para el Modal de Términos
  const [isLegalModalVisible, setLegalModalVisible] = useState(false);

  // Definimos los colores aquí para forzar la visualización
  const colors = {
    background: '#FAF5F0', // Arena cálida (Modo Claro)
    textPrimary: '#1C1917', // Carbón Stone 900
    textSecondary: '#57534E', // Ceniza Stone 600
    textTertiary: '#A8A29E', // Humo Stone 400
    brand: '#EA580C', // Naranja FocoCero
    card: '#FFFFFF', // Blanco para el Modal
    border: '#F5EBE0', // Arena oscura para bordes
  };

  return (
    // Forzamos el fondo con estilo inline
    <SafeAreaLayout
      style={{ backgroundColor: colors.background }}
      className="flex-1 justify-between"
    >
      {/* ZONA SUPERIOR / CENTRAL: Branding */}
      <View className="mt-16 flex-1 items-center justify-center px-6">
        {/* Logo Llama Táctica */}
        <Animated.View
          entering={FadeInDown.delay(WELCOME_CHOREOGRAPHY.LOGO).springify().damping(12)}
        >
          <View
            style={{
              backgroundColor: `${colors.brand}1A`, // 10% de opacidad
              borderColor: `${colors.brand}33`, // 20% de opacidad
            }}
            className="mb-8 h-24 w-24 items-center justify-center rounded-full border"
          >
            <Icon icon={Icons.Flame} size={48} color={colors.brand} />
          </View>
        </Animated.View>

        {/* Título: Bienvenido/a a FocoCero */}
        <Animated.View
          entering={FadeInUp.delay(WELCOME_CHOREOGRAPHY.TITLE).springify()}
          className="items-center"
        >
          <Typography
            variant="h1"
            style={{ color: colors.textPrimary }}
            className="mb-3 text-center text-3xl font-bold"
          >
            {AUTH_TEXTS.WELCOME.TITLE}
          </Typography>
        </Animated.View>

        {/* Subtítulo: Sistema de Alertas Tácticas de Incendios */}
        <Animated.View entering={FadeInUp.delay(WELCOME_CHOREOGRAPHY.SUBTITLE).springify()}>
          <Typography
            variant="body"
            style={{ color: colors.textSecondary }}
            className="px-4 text-center text-base leading-relaxed"
          >
            {AUTH_TEXTS.WELCOME.SUBTITLE}
          </Typography>
        </Animated.View>
      </View>

      {/* ZONA INFERIOR: Acciones Principales y Enlace Legal */}
      <View className="w-full px-6 pb-8 pt-4">
        <Animated.View
          entering={FadeInUp.delay(WELCOME_CHOREOGRAPHY.BUTTONS).springify().damping(15)}
          className="gap-4"
        >
          {/* Botón Principal (Sólido Naranja) */}
          <Button
            label={AUTH_TEXTS.WELCOME.CREATE_ACCOUNT_BTN}
            variant="solid"
            onPress={onCreateAccountPress}
            // Asumimos que el componente Button interno ya maneja el color brand
          />

          {/* Botón Secundario (Borde) */}
          <Button
            label={AUTH_TEXTS.WELCOME.HAVE_ACCOUNT_BTN}
            variant="outline"
            onPress={onHaveAccountPress}
            // Aquí forzamos el color del texto y borde secundaria
            style={{ borderColor: colors.textSecondary }}
            textStyle={{ color: colors.textSecondary }}
          />
        </Animated.View>

        {/* Footer Legales */}
        <Animated.View
          entering={FadeIn.delay(WELCOME_CHOREOGRAPHY.FOOTER).duration(1000)}
          className="mt-8 items-center gap-4"
        >
          {/* Enlace con subrayado táctico */}
          <TouchableOpacity onPress={() => setLegalModalVisible(true)} activeOpacity={0.7}>
            <Typography
              variant="caption"
              style={{ color: colors.textSecondary }}
              className="text-center text-sm underline"
            >
              {AUTH_TEXTS.WELCOME.LEGAL_LINK}
            </Typography>
          </TouchableOpacity>

          {/* Versión con color terciario (el más sutil) */}
          <Typography
            variant="caption"
            style={{ color: colors.textTertiary, opacity: 0.5 }}
            className="text-center text-xs"
          >
            {AUTH_TEXTS.WELCOME.VERSION}
          </Typography>
        </Animated.View>
      </View>

      {/* =========================================
          MODAL DE TÉRMINOS Y CONDICIONES
          ========================================= */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isLegalModalVisible}
        onRequestClose={() => setLegalModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/60">
          {/* Tarjeta del Modal */}
          <View
            style={{ backgroundColor: colors.card }}
            className="h-2/3 w-full rounded-t-3xl p-6 shadow-xl"
          >
            {/* Cabecera del Modal con borde surface-elevated */}
            <View
              style={{ borderBottomColor: colors.border }}
              className="mb-6 flex-row items-center justify-between border-b pb-4"
            >
              <Typography
                variant="h3"
                style={{ color: colors.textPrimary }}
                className="text-xl font-bold"
              >
                {AUTH_TEXTS.WELCOME.MODAL_TITLE}
              </Typography>
              <TouchableOpacity onPress={() => setLegalModalVisible(false)} className="p-2">
                <Icon icon={Icons.X} size="sm" color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            {/* Texto legal con ScrollView */}
            <ScrollView className="mb-6 flex-1" showsVerticalScrollIndicator={false}>
              <Typography
                variant="body"
                style={{ color: colors.textSecondary }}
                className="leading-relaxed"
              >
                {AUTH_TEXTS.WELCOME.MODAL_CONTENT}
              </Typography>
            </ScrollView>

            <Button
              label={AUTH_TEXTS.WELCOME.MODAL_CLOSE_BTN}
              variant="solid"
              onPress={() => setLegalModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaLayout>
  );
};
