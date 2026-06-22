// src/widgets/auth/model/__tests__/useAuthForm.test.ts

import { useAuthForm } from '../useAuthForm';

jest.mock('@features/auth/hooks/useLogin', () => ({
  useLogin: jest.fn(() => ({
    isLoading: false,
    loginAsGuest: jest.fn(),
    error: null,
    isSuccess: false,
    reset: jest.fn(),
  })),
}));

jest.mock('react-hook-form', () => ({
  useForm: jest.fn(() => ({
    register: jest.fn(),
    handleSubmit: jest.fn((fn) => fn),
    formState: { errors: {} },
    setValue: jest.fn(),
    watch: jest.fn(),
    getValues: jest.fn(),
    reset: jest.fn(),
  })),
  Controller: jest.fn(),
}));

jest.mock('@hookform/resolvers/zod', () => ({
  zodResolver: jest.fn(() => () => ({ values: {}, errors: {} })),
}));

describe('useAuthForm', () => {
  it('retorna form, onSubmit y isLoggingIn', () => {
    const result = useAuthForm();

    expect(result.form).toBeDefined();
    expect(result.onSubmit).toBeDefined();
    expect(result.isLoggingIn).toBe(false);
  });

  it('onSubmit es una función', () => {
    const { onSubmit } = useAuthForm();
    expect(typeof onSubmit).toBe('function');
  });
});
