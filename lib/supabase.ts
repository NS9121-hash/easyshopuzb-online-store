import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Product = {
  id: string
  image_url: string
  price: number
  created_at: string
}

export type Order = {
  id: string
  customer_name: string
  phone: string
  address: string
  telegram_username: string
  created_at: string
}
