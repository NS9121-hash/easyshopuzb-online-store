import { z } from 'zod'

export const orderFormSchema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'),
  address: z.string().min(5, 'Address must be at least 5 characters').max(500, 'Address is too long'),
  telegramUsername: z.string().regex(/^[a-zA-Z0-9_]{5,32}$/, 'Invalid Telegram username format'),
})

export type OrderFormData = z.infer<typeof orderFormSchema>
