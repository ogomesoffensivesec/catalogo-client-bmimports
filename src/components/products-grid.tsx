import * as React from "react"
import {
  Pagination, PaginationContent, PaginationEllipsis, PaginationItem,
  PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination"

// 👇 use o mesmo tipo do Card
import { ProductCard, type ProductVariant } from "./product-card"
import type { UIProduct } from "@/types/product"

type ProductsGridProps = {
  products?: UIProduct[]                 // <- pode vir undefined
  variant: ProductVariant                // "ready" | "imported"
  onCta?: (product: UIProduct) => void   // <- usa o mesmo tipo
  pageSize?: number
  className?: string
}

export function ProductsGrid({
  products = [],                         // <- fallback seguro
  variant,
  onCta,
  pageSize = 8,
  className,
}: ProductsGridProps) {
  const list = Array.isArray(products) ? products : []

  const [page, setPage] = React.useState(1)
  const totalPages = Math.max(1, Math.ceil(list.length / pageSize))

  React.useEffect(() => {
    setPage((p) => Math.min(Math.max(1, p), totalPages))
  }, [list.length, pageSize, totalPages])

  const start = (page - 1) * pageSize
  const end = start + pageSize
  const paginated = list.slice(start, end)

  const pagesToShow = React.useMemo(() => {
    const arr: (number | "...")[] = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) arr.push(i)
      return arr
    }
    const set = new Set([1, 2, page - 1, page, page + 1, totalPages - 1, totalPages])
    const listNums = Array.from({ length: totalPages }, (_, i) => i + 1)
      .filter(n => set.has(n) && n >= 1 && n <= totalPages)
    let last = 0
    for (const n of listNums) {
      if (last && n - last > 1) arr.push("...")
      arr.push(n)
      last = n
    }
    return arr
  }, [page, totalPages])

  return (
    <div className={className}>
      {paginated.length === 0 ? (
        <div className="py-12 text-center text-sm text-muted-foreground">
          Nenhum produto encontrado.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {paginated.map((product) => (
            <ProductCard
              key={String(product.id)}
              product={product}
              variant={variant}
              onCta={onCta}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination>
            <PaginationContent className="flex justify-center">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => { e.preventDefault(); setPage((p) => Math.max(1, p - 1)) }}
                  aria-disabled={page === 1}
                  className={page === 1 ? "pointer-events-none opacity-50" : undefined}
                />
              </PaginationItem>

              {pagesToShow.map((p, i) => (
                <PaginationItem key={`${p}-${i}`}>
                  {p === "..." ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      href="#"
                      isActive={p === page}
                      onClick={(e) => { e.preventDefault(); setPage(p as number) }}
                    >
                      {p}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => { e.preventDefault(); setPage((p) => Math.min(totalPages, p + 1)) }}
                  aria-disabled={page === totalPages}
                  className={page === totalPages ? "pointer-events-none opacity-50" : undefined}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          <div className="mt-2 text-center text-xs text-muted-foreground">
            Página {page} de {totalPages} — exibindo {paginated.length} de {list.length} produtos
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductsGrid
