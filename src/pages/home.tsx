// src/pages/Home.tsx
import { useEffect, useRef, useState } from "react"
import { Helmet } from "react-helmet-async"
import { HomeHeader } from "@/components/home-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProductsGrid from "@/components/products-grid"
import CartSheet, { type CartItem } from "@/components/cart-sheet"
import { useNavigate } from "react-router"
import { listProducts, type Variant } from "@/lib/api"
import type { UIProduct } from "@/types/product"

export default function Home() {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<CartItem[]>([])
  const [variant, setVariant] = useState<Variant>("imported")
  const [data, setData] = useState<UIProduct[]>([])     // <- array simples
  const [loading, setLoading] = useState(false)
  const gridRef = useRef<HTMLDivElement | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    let alive = true
    ;(async () => {
      setLoading(true)
      try {
        const resp = await listProducts({ variant, take: 12, skip: 0 })
        // resp pode ser UIProduct[] OU { items: UIProduct[], total?: number }
        const items = Array.isArray(resp) ? resp : resp?.items ?? []
        if (alive) setData(items) // <- agora sempre um array
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => { alive = false }
  }, [variant])

  const onCheckout = () => {
    localStorage.setItem("cart_items", JSON.stringify(items))
    setOpen(false)
    navigate("/checkout", { state: { items, variant } })
  }

 

  const firstImage = (images?: Array<string | { url: string }>) =>
    images?.[0] ? (typeof images[0] === "string" ? images[0] : images[0].url) : undefined

  // normaliza "23450" -> 234.5; "234,50" -> 234.5; number -> number
  const normalizePrice = (p: number | string): number => {
    if (typeof p === "number") return p
    const raw = p.trim()
    if (/^\d+$/.test(raw)) return Number(raw) / 100
    const cleaned = raw.replace(/\./g, "").replace(",", ".")
    const n = Number(cleaned)
    return Number.isFinite(n) ? n : 0
  }

  // Assinatura bate com UIProduct (price pode ser string | number)
  const addToCartAndOpen = (product: UIProduct) => {
    const priceNumber = normalizePrice(product.price)
    setItems((prev) => {
      const pid = Number(product.id)
      const found = prev.find((i) => i.id === pid)
      if (found) return prev.map((i) => (i.id === pid ? { ...i, qty: i.qty + 1 } : i))
      return [
        ...prev,
        {
          id: pid,
          name: product.name,
          sku: product.sku,
          price: priceNumber,
          qty: 1,
          image: firstImage(product.images as any),
        },
      ]
    })
    setOpen(true)
  }

  const inc = (id: number) => setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i)))
  const dec = (id: number) => setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty - 1) } : i)))
  const remove = (id: number) => setItems((prev) => prev.filter((i) => i.id !== id))



  return (
    <div>
      <Helmet>
        <title>BM IMPORTS COMÉRCIO INTERNACIONAL LTDA</title>
        <meta name="description" content="Site institucional da BM IMPORTS COMÉRCIO INTERNACIONAL LTDA." />
      </Helmet>

      <HomeHeader />

      <div ref={gridRef} className="container mx-auto py-10">
        <Tabs value={variant} onValueChange={(v) => setVariant(v as Variant)}>
          <TabsList className="gap-6 mx-auto w-full">
            <TabsTrigger className="px-10 uppercase font-bold text-zinc-800 text-lg" value="imported">
              Produtos importados
            </TabsTrigger>
            <TabsTrigger className="px-10 uppercase font-bold text-zinc-800 text-lg" value="ready">
              Produtos à pronta entrega
            </TabsTrigger>
          </TabsList>

          <TabsContent value="imported" className="w-full mt-8">
            {loading ? (
              <div className="py-16 text-center text-sm text-zinc-500">Carregando…</div>
            ) : (
              <ProductsGrid
                products={data}             
                variant="imported"
                onCta={addToCartAndOpen}
                pageSize={12}
              />
            )}
          </TabsContent>

          <TabsContent value="ready" className="w-full mt-8">
            {loading ? (
              <div className="py-16 text-center text-sm text-zinc-500">Carregando…</div>
            ) : (
              <ProductsGrid
                products={data}
                variant="ready"
                onCta={addToCartAndOpen}
                pageSize={12}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>

      <CartSheet
        open={open}
        onOpenChange={setOpen}
        items={items}
        onInc={inc}
        onDec={dec}
        onRemove={remove}
        onCheckout={onCheckout}
      />
    </div>
  )
}
