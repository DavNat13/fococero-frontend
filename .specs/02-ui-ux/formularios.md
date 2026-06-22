# Formularios

El sistema de formularios utiliza **react-hook-form** con **Zod 4** para validacion declarativa en el cliente. Los componentes controlados abstraen la integracion entre la UI y el motor de formularios.

## Stack tecnologico

- `react-hook-form` v7+: Manejo de estado del formulario, validacion onSubmit
- `zod` v4: Esquemas de validacion con tipado inferido
- `@hookform/resolvers/zod`: Bridge entre Zod y react-hook-form
- Componentes controlados en `src/components/forms/`

## Componentes controlados

| Componente | Tipo de dato | Zod schema target |
|------------|-------------|-------------------|
| `ControlledInput` | string | `z.string()`, `z.string().email()`, `z.string().min()` |
| `ControlledCheckbox` | boolean | `z.boolean()` |
| `ControlledSwitch` | boolean | `z.boolean()` |
| `ControlledRadioGroup` | string | `z.enum([...])` |
| `ControlledSegmentedControl` | string | `z.enum([...])` |
| `ControlledSlider` | number | `z.number().min().max()` |
| `ControlledImagePicker` | string (uri) | `z.string().url()` |

## Patron de uso

```tsx
const loginSchema = z.object({
  email: z.string().email('Email invalido'),
  password: z.string().min(8, 'Minimo 8 caracteres'),
});

type LoginForm = z.infer<typeof loginSchema>;

function LoginScreen() {
  const { control, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginForm) => {
    await loginUseCase.execute(data.email, data.password);
  };

  return (
    <KeyboardScrollLayout>
      <ControlledInput
        control={control}
        name="email"
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <ControlledInput
        control={control}
        name="password"
        placeholder="Contrasena"
        secureTextEntry
      />
      <Button title="Iniciar sesion" onPress={handleSubmit(onSubmit)} />
    </KeyboardScrollLayout>
  );
}
```

## Keyboard types por campo

| Campo | `keyboardType` | `autoCapitalize` | `secureTextEntry` |
|-------|---------------|-------------------|-------------------|
| Email | `email-address` | `none` | `false` |
| Contrasena | `default` | `none` | `true` |
| Telefono | `phone-pad` | `none` | `false` |
| Nombre | `default` | `words` | `false` |
| Direccion | `default` | `sentences` | `false` |
| Coordenada | `decimal-pad` | `none` | `false` |
| Codigo postal | `number-pad` | `none` | `false` |

## Validacion y errores

- La validacion ocurre en el cliente (Zod) y se replica en el servidor
- Los errores se muestran debajo del campo correspondiente con texto `--color-danger`
- El formulario no se submittea si hay errores de validacion
- Cada campo erroneo ejecuta `ShakeError` al mostrar el error
- El boton de submit se deshabilita mientras `formState.isSubmitting`

## Seguridad en formularios

- `secureTextEntry` en campos de contrasena previene captura visual (iOS evita screenshot en estos campos)
- Los valores de formulario JAMAS se persisten en AsyncStorage sin cifrado (excepto en outbox offline)
- La validacion Zod sanitiza strings: `z.string().trim()` elimina espacios extra
- Los campos de email se normalizan a minusculas antes de enviar
- El boton de submit se deshabilita durante `isSubmitting` para prevenir doble envio (CSRF-like)
- Los tokens JWT nunca se incluyen en formularios ni en valores por defecto

## Clean Architecture

Los hooks de formulario (`useForm`) se declaran en la capa de presentacion. El schema Zod y los tipos inferidos se definen en la capa de dominio (entidades). El caso de uso recibe datos ya validados y tipados. La UI jamas construye schemas ni contiene logica de validacion de negocio.

## Devops

- Los schemas Zod se comparten entre cliente y servidor via un package monorepo
- Cualquier cambio en validacion requiere PR en ambos lados
- Los tests de formulario usan `@testing-library/react-native` con `renderHook` para `useForm`
- Las vulnerabilidades de dependencias de formulario se auditan semanalmente
