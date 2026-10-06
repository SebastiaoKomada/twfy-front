import { Trash2 } from "lucide-react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/cart"
import { formatPrice } from "@/lib/format"

export function CartPage() {
  const { items, loading, totalCents, setItemQty, removeItem } = useCart()
  const [pending, setPending] = useState<number | null>(null)
  const navigate = useNavigate()

  async function handleQtyChange(productId: number, value: string) {
    const qty = Number(value)
    if (Number.isNaN(qty)) return
    setPending(productId)
    try {
      await setItemQty(productId, qty)
    } finally {
      setPending(null)
    }
  }

  if (!loading && items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="text-lg font-medium">Seu carrinho está vazio</p>
        <Button asChild>
          <Link to="/">Continuar comprando</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-3">
        <h1 className="text-xl font-bold tracking-tight">Seu carrinho</h1>
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="flex flex-wrap items-center gap-4 p-4">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{item.product_name}</p>
                <p className="text-sm text-muted-foreground">{formatPrice(item.unit_price_cents)} / unidade</p>
              </div>
              <Input
                type="number"
                value={item.qty}
                disabled={pending === item.product_id}
                onChange={(e) => handleQtyChange(item.product_id, e.target.value)}
                className="w-20"
              />
              <span className="w-28 text-right font-semibold">{formatPrice(item.line_total_cents)}</span>
              <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} aria-label="Remover">
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="h-fit">
        <CardContent className="space-y-4 p-4">
          <h2 className="font-semibold">Resumo</h2>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-semibold">{formatPrice(totalCents)}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-base font-bold">
            <span>Total</span>
            <span>{formatPrice(totalCents)}</span>
          </div>
          <Button className="w-full" disabled={items.length === 0} onClick={() => navigate("/checkout")}>
            Finalizar compra
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
