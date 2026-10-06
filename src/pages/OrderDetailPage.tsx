import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { api, ApiError } from "@/lib/api"
import { formatDate, formatPrice } from "@/lib/format"
import type { Order } from "@/lib/types"

export function OrderDetailPage() {
  const { id } = useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    setOrder(null)
    setError(null)
    api
      .get<Order>(`/api/orders/${id}`)
      .then(setOrder)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Não foi possível carregar o pedido."))
  }, [id])

  if (error) {
    return (
      <Alert variant="destructive" className="mx-auto max-w-xl">
        <AlertTitle>Não foi possível abrir este pedido</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-xl space-y-3">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">Pedido #{order.id}</h1>
        <Badge variant="secondary">{order.status}</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">Nota fiscal / fatura</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="text-muted-foreground">Data</span>
            <span>{formatDate(order.created_at)}</span>
            <span className="text-muted-foreground">Endereço de entrega</span>
            <span>{order.shipping_address}</span>
          </div>

          <Separator />

          <ul className="space-y-2 text-sm">
            {order.items.map((item, idx) => (
              <li key={idx} className="flex justify-between">
                <span>
                  {item.qty}x {item.product_name}
                </span>
                <span>{formatPrice(item.unit_price_cents * item.qty)}</span>
              </li>
            ))}
          </ul>

          <Separator />

          <div className="flex justify-between text-base font-bold">
            <span>Total</span>
            <span>{formatPrice(order.total_cents)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
