import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { api, ApiError } from "@/lib/api"
import { useAuth } from "@/lib/auth"
import { useCart } from "@/lib/cart"
import { formatDate, formatPrice } from "@/lib/format"
import type { Product, Review } from "@/lib/types"

export function ProductPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const { addItem } = useCart()

  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [rating, setRating] = useState("5")
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!id) return
    api.get<Product>(`/api/products/${id}`).then(setProduct)
    loadReviews()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  function loadReviews() {
    if (!id) return
    api.get<Review[]>(`/api/products/${id}/reviews`).then(setReviews)
  }

  async function handleAddToCart() {
    if (!product) return
    if (!user) {
      toast.error("Entre na sua conta para adicionar produtos ao carrinho.")
      return
    }
    try {
      await addItem(product.id, 1)
      toast.success("Produto adicionado ao carrinho.")
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Não foi possível adicionar ao carrinho.")
    }
  }

  async function submitReview(e: React.FormEvent) {
    e.preventDefault()
    if (!product) return
    if (!comment.trim()) return
    setSubmitting(true)
    try {
      await api.post(`/api/products/${product.id}/reviews`, {
        rating: Number(rating),
        comment_html: comment,
      })
      setComment("")
      loadReviews()
      toast.success("Avaliação publicada!")
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Não foi possível publicar a avaliação.")
    } finally {
      setSubmitting(false)
    }
  }

  if (!product) {
    return (
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Skeleton className="aspect-[4/3] w-full rounded-xl" />
        <div className="space-y-3">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="overflow-hidden rounded-xl border bg-muted">
          <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
        </div>
        <div className="space-y-4">
          <div>
            <Badge variant="secondary">{product.category}</Badge>
            <h1 className="mt-2 text-2xl font-bold tracking-tight">{product.name}</h1>
          </div>
          <p className="text-3xl font-extrabold">{formatPrice(product.price_cents)}</p>
          <p className="text-sm text-muted-foreground">{product.description}</p>
          <p className="text-xs text-muted-foreground">
            {product.stock > 0 ? `${product.stock} em estoque` : "Produto esgotado"}
          </p>
          <Button size="lg" onClick={handleAddToCart} disabled={product.stock === 0}>
            Adicionar ao carrinho
          </Button>
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Avaliações ({reviews.length})</h2>
          {reviews.length === 0 && (
            <p className="text-sm text-muted-foreground">Seja o primeiro a avaliar este produto.</p>
          )}
          <div className="space-y-4">
            {reviews.map((r) => (
              <Card key={r.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between text-sm font-semibold">
                    <span>{r.author_name}</span>
                    <span className="text-xs text-muted-foreground">{formatDate(r.created_at)}</span>
                  </CardTitle>
                  <div className="text-amber-500">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</div>
                </CardHeader>
                <CardContent>
                  {/* Avaliações aceitam uma formatação básica (negrito, itálico,
                      links), por isso o comentário é renderizado como HTML. */}
                  <div
                    className="prose prose-sm max-w-none text-sm"
                    dangerouslySetInnerHTML={{ __html: r.comment_html }}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-base">Deixe sua avaliação</CardTitle>
          </CardHeader>
          <CardContent>
            {user ? (
              <form onSubmit={submitReview} className="space-y-3">
                <div className="space-y-1.5">
                  <Label>Nota</Label>
                  <Select value={rating} onValueChange={setRating}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[5, 4, 3, 2, 1].map((n) => (
                        <SelectItem key={n} value={String(n)}>
                          {n} estrela{n > 1 ? "s" : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Comentário</Label>
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Conte como foi sua experiência. Aceita <b>negrito</b>, <i>itálico</i> e links."
                    rows={4}
                  />
                </div>
                <Button type="submit" disabled={submitting} className="w-full">
                  Publicar avaliação
                </Button>
              </form>
            ) : (
              <p className="text-sm text-muted-foreground">Entre na sua conta para avaliar este produto.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
