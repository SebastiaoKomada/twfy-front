import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { api, ApiError } from "@/lib/api"
import { useCart } from "@/lib/cart"
import { formatPrice } from "@/lib/format"
import type { Order } from "@/lib/types"

export function CheckoutPage() {
  const { items, totalCents, refresh } = useCart()
  const navigate = useNavigate()
  const [address, setAddress] = useState("")
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!address.trim()) {
      toast.error("Informe o endereço de entrega.")
      return
    }
    setSubmitting(true)
    try {
      const order = await api.post<Order>("/api/orders", { shipping_address: address })
      await refresh()
      toast.success("Pedido confirmado!")
      navigate(`/pedidos/${order.id}`)
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Não foi possível concluir o pedido.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 md:grid-cols-[1fr_280px]">
      <Card>
        <CardHeader>
          <CardTitle>Dados de entrega</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-3">
            <Label htmlFor="address">Endereço completo</Label>
            <Textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Rua, número, bairro, cidade - UF"
              rows={4}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={submitting || items.length === 0}>
              Confirmar pedido
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card className="h-fit">
        <CardContent className="space-y-3 p-4">
          <h2 className="font-semibold">Resumo do pedido</h2>
          <ul className="space-y-1 text-sm">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between gap-2">
                <span className="truncate text-muted-foreground">
                  {item.qty}x {item.product_name}
                </span>
                <span>{formatPrice(item.line_total_cents)}</span>
              </li>
            ))}
          </ul>
          <Separator />
          <div className="flex justify-between text-base font-bold">
            <span>Total</span>
            <span>{formatPrice(totalCents)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
