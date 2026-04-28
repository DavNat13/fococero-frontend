// src/widgets/auth/model/useAuthForm.ts
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Keyboard } from 'react-native';
import { z } from 'zod';

import { useLogin } from '@features/auth/hooks/useLogin';

const loginSchema = z.object({
  rut: z.string().min(8, 'El RUT es demasiado corto'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const useAuthForm = () => {
  const { isLoading, loginAsGuest } = useLogin();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rut: '',
      password: '',
    },
    mode: 'onTouched',
  });

  const onSubmit = async (data: LoginFormData) => {
    Keyboard.dismiss();
    try {
      console.log('Intentando hacer login con:', data.rut);

      // await login(data); <-- Aquí irá tu función real en el futuro
    } catch (_) {
      form.setValue('password', '');
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isLoggingIn: isLoading, // Lo mapeamos al nombre que espera nuestra UI
  };
};
