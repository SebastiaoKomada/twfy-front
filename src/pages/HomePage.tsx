import { useEffect, useMemo, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/lib/api"
import { formatPrice } from "@/lib/format"
import type { Product } from "@/lib/types"

export function HomePage() {
  const [params, setParams] = useSearchParams()
  const [products, setProducts] = useState<Product[] | null>(null)
  const [categories, setCategories] = useState<string[]>([])
  const [search, setSearch] = useState(params.get("search") ?? "")
  const [minPrice, setMinPrice] = useState(params.get("min_price") ?? "")
  const [maxPrice, setMaxPrice] = useState(params.get("max_price") ?? "")
  const category = params.get("category") ?? "todas"

  useEffect(() => {
    api.get<string[]>("/api/categories").then(setCategories).catch(() => setCategories([]))
  }, [])

  useEffect(() => {
    const query = new URLSearchParams()
    if (params.get("search")) query.set("search", params.get("search")!)
    if (params.get("category") && params.get("category") !== "todas") query.set("category", params.get("category")!)
    if (params.get("min_price")) query.set("min_price", params.get("min_price")!)
    if (params.get("max_price")) query.set("max_price", params.get("max_price")!)

    setProducts(null)
    api
      .get<Product[]>(`/api/products?${query.toString()}`)
      .then(setProducts)
      .catch(() => setProducts([]))
  }, [params])

  const title = useMemo(() => {
    const s = params.get("search")
    return s ? `Resultados para "${s}"` : "Vitrine"
  }, [params])

  function applyFilters(e: React.FormEvent) {
    e.preventDefault()
    const next = new URLSearchParams(params)
    if (search) next.set("search", search)
    else next.delete("search")
    if (minPrice) next.set("min_price", minPrice)
    else next.delete("min_price")
    if (maxPrice) next.set("max_price", maxPrice)
    else next.delete("max_price")
    setParams(next)
  }

  function onCategoryChange(value: string) {
    const next = new URLSearchParams(params)
    if (value === "todas") next.delete("category")
    else next.set("category", value)
    setParams(next)
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border bg-muted/30 p-6">
        <h1 className="text-2xl font-bold tracking-tight">Bem-vindo à Tw4y</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Encontre produtos de lojas verificadas, com entrega para todo o Brasil.
        </p>

        <form onSubmit={applyFilters} className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto_auto_auto]">
          <Input
            placeholder="Buscar produtos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Input
            placeholder="Preço mín. (R$)"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="sm:w-36"
          />
          <Input
            placeholder="Preço máx. (R$)"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="sm:w-36"
          />
          <Button type="submit">Filtrar</Button>
        </form>
      </section>

      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas as categorias</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {products === null ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhum produto encontrado.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <Link key={p.id} to={`/produto/${p.id}`}>
              <Card className="h-full overflow-hidden py-0 transition hover:shadow-md">
                <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
                  <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" loading="lazy" />
                </div>
                <CardContent className="space-y-1 p-3">
                  <Badge variant="secondary" className="text-[10px]">
                    {p.category}
                  </Badge>
                  <p className="line-clamp-2 text-sm font-medium">{p.name}</p>
                </CardContent>
                <CardFooter className="p-3 pt-0">
                  <span className="text-base font-bold">{formatPrice(p.price_cents)}</span>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
