export interface User {
  id: number
  name: string
  email: string
  role: "comprador" | "vendedor" | "admin"
  created_at: string
}

export interface Product {
  id: number
  seller_id: number
  name: string
  description: string
  category: string
  price_cents: number
  stock: number
  image_url: string
}

export interface Review {
  id: number
  product_id: number
  author_name: string
  rating: number
  comment_html: string
  created_at: string
}

export interface CartItem {
  id: number
  product_id: number
  product_name: string
  unit_price_cents: number
  qty: number
  line_total_cents: number
}

export interface OrderItem {
  product_id: number
  product_name: string
  qty: number
  unit_price_cents: number
}

export interface OrderSummary {
  id: number
  status: string
  total_cents: number
  created_at: string
}

export interface Order extends OrderSummary {
  user_id: number
  shipping_address: string
  items: OrderItem[]
}
