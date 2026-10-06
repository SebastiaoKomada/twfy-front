import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react"

import { api } from "@/lib/api"
import { useAuth } from "@/lib/auth"
import type { CartItem } from "@/lib/types"

interface CartContextValue {
  items: CartItem[]
  loading: boolean
  count: number
  totalCents: number
  refresh: () => Promise<void>
  addItem: (productId: number, qty: number) => Promise<void>
  setItemQty: (productId: number, qty: number) => Promise<void>
  removeItem: (itemId: number) => Promise<void>
  clearLocal: () => void
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)

  const refresh = useCallback(async () => {
    if (!user) {
      setItems([])
      return
    }
    setLoading(true)
    try {
      const cart = await api.get<CartItem[]>("/api/cart")
      setItems(cart)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addItem = useCallback(
    async (productId: number, qty: number) => {
      await api.post<CartItem>("/api/cart/items", { product_id: productId, qty })
      await refresh()
    },
    [refresh],
  )

  const setItemQty = useCallback(
    async (productId: number, qty: number) => {
      await api.post<CartItem>("/api/cart/items", { product_id: productId, qty })
      await refresh()
    },
    [refresh],
  )

  const removeItem = useCallback(
    async (itemId: number) => {
      await api.delete(`/api/cart/items/${itemId}`)
      await refresh()
    },
    [refresh],
  )

  const count = items.reduce((sum, i) => sum + (i.qty > 0 ? i.qty : 0), 0)
  const totalCents = items.reduce((sum, i) => sum + i.line_total_cents, 0)

  return (
    <CartContext.Provider
      value={{ items, loading, count, totalCents, refresh, addItem, setItemQty, removeItem, clearLocal: () => setItems([]) }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart precisa estar dentro de <CartProvider>")
  return ctx
}
