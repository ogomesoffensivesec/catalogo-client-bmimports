// src/components/cart-sheet.tsx
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Trash } from "lucide-react"

export type CartItem = {
  id: number
  name: string
  sku: string
  price: number
  qty: number
  image?: string
}

type CartSheetProps = {
  open: boolean
  onOpenChange: (v: boolean) => void
  items: CartItem[]
  onInc: (id: number) => void
  onDec: (id: number) => void
  onRemove: (id: number) => void
  onCheckout?: () => void
}

const formatBRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

export function CartSheet({
  open,
  onOpenChange,
  items,
  onInc,
  onDec,
  onRemove,
  onCheckout,
}: CartSheetProps) {
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)

  
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        // LARGURA + REMOÇÃO DE PADDING PADRÃO PARA CONTROLAR ESPAÇAMENTO
        className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl p-0"
      >
        {/* LAYOUT EM COLUNA P/ TER HEADER, CORPO SCROLLÁVEL E FOOTER FIXO */}
        <div className="flex h-full flex-col">
          {/* HEADER */}
          <SheetHeader className="px-6 py-4">
            <SheetTitle className="text-lg">Carrinho</SheetTitle>
          </SheetHeader>
          <Separator />

          {/* LISTA (SCROLLÁVEL) */}
          <ScrollArea className="flex-1">
            <div className="px-6 py-4 space-y-4">
              {items.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Seu carrinho está vazio.
                </p>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-[72px_1fr_auto] items-start gap-4 rounded-lg border p-3"
                  >
                    {/* IMAGEM */}
                    <div className="rounded-md overflow-hidden bg-muted">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="h-[72px] w-[72px] object-cover"
                      />
                    </div>

                    {/* INFOS */}
                    <div className="min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium">
                            {item.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            SKU: {item.sku}
                          </div>
                        </div>

                        <button
                          onClick={() => onRemove(item.id)}
                          className="text-xs text-muted-foreground hover:underline"
                          aria-label="Remover item"
                          title="Remover"
                        >
                          <Trash className="h-4 w-4 text-red-700" />
                        </button>
                      </div>

                      {/* QTD CONTROLS */}
                      <div className="mt-3 inline-flex items-center rounded-md border">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onDec(item.id)}
                          aria-label="Diminuir quantidade"
                        >
                          −
                        </Button>
                        <span className="px-3 text-sm">{item.qty}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onInc(item.id)}
                          aria-label="Aumentar quantidade"
                        >
                          +
                        </Button>
                      </div>
                    </div>

                    {/* PREÇO */}
                    <div className="text-right flex  flex-col justify-end h-full ">
                      <div className="mt-2  text-muted-foreground">
                        Total
                      </div>
                      <div className="text-base font-semibold">
                        {formatBRL(item.price * item.qty)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          {/* RODAPÉ FIXO COM SUBTOTAL + CTA */}
          <div className="mt-auto">
            <Separator />
            <div className="px-6 py-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="text-xl font-semibold">
                  {formatBRL(subtotal)}
                </span>
              </div>
              <SheetFooter>
                <Button className="w-full h-11 text-base" onClick={onCheckout}>
                  Finalizar
                </Button>
              </SheetFooter>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default CartSheet
