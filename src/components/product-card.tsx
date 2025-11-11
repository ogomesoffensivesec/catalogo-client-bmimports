// src/components/product-card.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { ShoppingCart } from "lucide-react"
import type { UIProduct } from "@/types/product"
import { ProductImage } from "./product-image"

export type ProductVariant = "ready" | "imported"

type Props = {
  product: UIProduct
  variant: ProductVariant
  className?: string
  onCta?: (product: UIProduct) => void
}

/** Formata BRL */
const formatCurrency = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

/** Normaliza preço: "23450" (centavos) → 234.5; "234,50" → 234.5; number → number */
function normalizePrice(p: number | string): number {
  if (typeof p === "number") return p
  const raw = p.trim()
  const cleaned = raw.replace(/\./g, "").replace(",", ".")
  const n = Number(cleaned)
  return Number.isFinite(n) ? n : 0
}

/** Converte array de imagens para array de srcs */
const toSrcs = (images?: UIProduct["images"]) =>
  (images ?? []).map((im) => (typeof im === "string" ? im : im.url)).filter(Boolean)

export function ProductCard({ product, variant, className, onCta }: Props) {
  const ctaLabel = variant === "ready" ? "Fazer pedido" : "Solicitar orçamento"
  const srcs = toSrcs(product.images)
  const showImages = srcs.length ? srcs : ["/placeholder.svg"]
  const priceNumber = normalizePrice(product.price)

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="text-base leading-tight line-clamp-2">
              {product.name}
            </CardTitle>
            <CardDescription className="mt-1 text-xs">SKU: {product.sku}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <Carousel className="rounded-md border">
          <CarouselContent>
            {showImages.map((src, idx) => {
              let finalImageUrl

              // Se for um caminho local (placeholder), usa direto
              if (src.startsWith('/')) {
                finalImageUrl = src
              }
              // Se for uma URL absoluta (começa com http), otimiza
              else if (src.startsWith('http')) {
                finalImageUrl = `/api/optimize-image?url=${encodeURIComponent(src)}`
              }
              // Se for um caminho relativo (da API), constrói a URL e otimiza
              else {
                const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

                const absoluteUrl = `${API_BASE_URL.replace(/\/$/, '')}/${src.replace(/^\//, '')}`
                finalImageUrl = `/api/optimize-image?url=${encodeURIComponent(absoluteUrl)}`
              }

              return (
                <CarouselItem key={`${String(product.id)}-${idx}`} className="p-2">
                  <ProductImage
                    src={finalImageUrl}
                    alt={`${product.name} - imagem ${idx + 1}`}
                  />
                </CarouselItem>
              )
            })}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        
        {product.showPrice && (
          <div className="space-y-1">
            <div className="text-2xl font-semibold leading-none">
              {formatCurrency(priceNumber)}
            </div>
          </div>
        )}
        
        {(product.seoDescription ?? product.description) ? (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {product.seoDescription ?? product.description}
          </p>
        ) : null}
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          type="button"
          variant="bm"
          className="w-full"
          disabled={product.active === false}
          onClick={() => onCta?.(product)}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {ctaLabel}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default ProductCard