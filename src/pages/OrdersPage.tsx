import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/lib/api"
import { formatDate, formatPrice } from "@/lib/format"
import type { OrderSummary } from "@/lib/types"

export function OrdersPage() {
  const [orders, setOrders] = useState<OrderSummary[] | null>(null)

  useEffect(() => {
    api.get<OrderSummary[]>("/api/orders").then(setOrders)
  }, [])

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-xl font-bold tracking-tight">Meus pedidos</h1>

      {orders === null && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      )}

      {orders?.length === 0 && <p className="text-sm text-muted-foreground">Você ainda não fez nenhum pedido.</p>}

      <div className="space-y-3">
        {orders?.map((order) => (
          <Link key={order.id} to={`/pedidos/${order.id}`}>
            <Card className="transition hover:shadow-md">
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium">Pedido #{order.id}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(order.created_at)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">{order.status}</Badge>
                  <span className="font-semibold">{formatPrice(order.total_cents)}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
