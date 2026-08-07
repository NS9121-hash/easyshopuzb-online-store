export type Product = {
  id: string
  name?: string
  image_url?: string
  price: number
  sizes?: string
  colors?: string
  type?: 'clothing' | 'look' | 'pending'
  createdAt?: unknown
}

export type Order = {
  id: string
  customer_name: string
  phone: string
  address: string
  telegram_username: string
  product_id?: string | null
  product_name?: string
  payment_status: string
  order_status: string
}
