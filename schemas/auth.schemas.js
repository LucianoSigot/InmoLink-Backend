import { z } from 'zod'

export const registroSchema = z.object({
    email: z.string({
        required_error: 'email is required',
    }).email({
        message: 'Invalid email',
    }),

    password: z.string({
        required_error: 'Password is required',
    }).min(6, {
        message: 'La contraseña tiene que ser de al menos 6 caracteres',
    }),
});

export const loginSchema = z.object({
    email: z.string({
        required_error: "Email es requerido",
    }).email({
        message: 'invalid email',
    }),
    password: z.string({
        required_error: "La contraseña es requerida",
    }).min(6, {
        message: 'minimo 6 caracteres',
    })
})