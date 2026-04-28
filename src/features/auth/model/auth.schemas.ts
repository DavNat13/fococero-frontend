// src/features/auth/model/auth.schemas.ts

import { z } from 'zod';
import { Rut, rutSchema, telefonoSchema, nombreSchema } from '@entities/usuario';



const cleanRutTransform = z
  .string()
  .trim()
  .transform((val) => val.replace(/\./g, '').toUpperCase())
  .pipe(rutSchema); 

const cleanPhoneTransform = z
  .string()
  .trim()
  .transform((val) => (val.startsWith('+56') ? val : `+56${val}`))
  .pipe(telefonoSchema); 

const cleanNameTransform = z
  .string()
  .trim()
  .transform((val) => val.replace(/\s+/g, ' '))
  .pipe(nombreSchema); 


export const registerFormSchema = z.object({
  rut: cleanRutTransform,
  nombre: cleanNameTransform,
  apellido: cleanNameTransform,
  telefono: cleanPhoneTransform,
});

export type RegisterFormData = Omit<z.infer<typeof registerFormSchema>, 'rut'> & {
  rut: Rut;
};
