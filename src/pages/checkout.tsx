// src/pages/checkout.tsx
import * as React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export type CartItem = {
  id: number
  name: string
  sku: string
  price: number
  qty: number
  image?: string
}

const formatBRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

type LocationState = {
  items?: CartItem[]
  variant?: "imported" | "ready"
}

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { items: stateItems, variant } = (state || {}) as LocationState

  // Fallback: tenta ler do localStorage se vier vazio
  const [items, setItems] = React.useState<CartItem[]>(
    stateItems && stateItems.length
      ? stateItems
      : (() => {
        try {
          const raw = localStorage.getItem("cart_items")
          return raw ? (JSON.parse(raw) as CartItem[]) : []
        } catch {
          return []
        }
      })()
  )

  // dados do cliente
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [note, setNote] = React.useState("")

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)

  const remove = (id: number) => setItems((prev) => prev.filter((i) => i.id !== id))
  const inc = (id: number) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i)))
  const dec = (id: number) =>
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty - 1) } : i))
    )

  // Gera o corpo do e-mail (texto) com todos os dados
  const buildEmailText = () => {
    const linhas: string[] = []
    linhas.push("🔔 NOVO PEDIDO / SOLICITAÇÃO DE ORÇAMENTO")
    linhas.push("")
    linhas.push("— Dados do cliente")
    linhas.push(`Nome: ${name || "-"} `)
    linhas.push(`E-mail: ${email || "-"} `)
    linhas.push(`Telefone: ${phone || "-"} `)
    if (variant) linhas.push(`Categoria: ${variant === "ready" ? "Pronta entrega" : "Importados"}`)
    if (note) {
      linhas.push("")
      linhas.push("Observações:")
      linhas.push(note)
    }
    linhas.push("")
    linhas.push("— Itens do pedido")
    items.forEach((it, idx) => {
      linhas.push(
        `${idx + 1}. ${it.name} | SKU: ${it.sku} | Qtd: ${it.qty} | Unit: ${formatBRL(
          it.price
        )} | Total: ${formatBRL(it.price * it.qty)}`
      )
    })
    linhas.push("")
    linhas.push(`Subtotal: ${formatBRL(subtotal)}`)
    linhas.push("")
    linhas.push("Por favor, responder a este e-mail com a confirmação e próximos passos.")
    return linhas.join("\n")
  }

  const handleSend = () => {
    if (!items.length) return
    const to = "vendas@bmimports.com.br" // <— altere para o e-mail correto
    const subject =
      (variant === "ready" ? "Pedido - " : "Solicitação de orçamento - ") +
      (name || "Cliente")
    const body = buildEmailText()

    // abre cliente de e-mail do usuário
    const mailto = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`
    window.location.href = mailto
  }

  React.useEffect(() => {
    // salva no localStorage para persistir se recarregar
    localStorage.setItem("cart_items", JSON.stringify(items))
  }, [items])

  return (
    <div className="container mx-auto max-w-5xl py-10">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-muted-foreground hover:underline"
        >
          ← Voltar
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* COLUNA ESQUERDA: DADOS DO CLIENTE */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dados do cliente</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2 space-y-2">
                <Label htmlFor="name">Nome completo*</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail*</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone / WhatsApp</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>



              <div className="sm:col-span-2 space-y-2">
                <Label htmlFor="note">Observações</Label>
                <Textarea id="note" rows={4} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ex.: prazo desejado, variações do produto, cores, etc." />
              </div>
            </CardContent>
          </Card>

          {/* REVISÃO DOS ITENS (MOBILE FIRST) */}
          <Card>
            <CardHeader>
              <CardTitle>Itens do pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!items.length ? (
                <p className="text-sm text-muted-foreground">Seu carrinho está vazio.</p>
              ) : (
                items.map((it) => (
                  <div key={it.id} className="grid grid-cols-[64px_1fr_auto] items-start gap-3 rounded-lg border p-3">
                    <img src={it.image || "/placeholder.svg"} alt={it.name} className="h-16 w-16 rounded object-cover" />
                    <div className="min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="truncate text-sm font-medium">{it.name}</div>
                        <button onClick={() => remove(it.id)} className="text-xs text-muted-foreground hover:underline">Remover</button>
                      </div>
                      <div className="text-xs text-muted-foreground">SKU: {it.sku}</div>
                      <div className="mt-2 inline-flex items-center rounded-md border">
                        <button className="h-8 w-8" onClick={() => dec(it.id)} aria-label="Diminuir">−</button>
                        <span className="px-3 text-sm">{it.qty}</span>
                        <button className="h-8 w-8" onClick={() => inc(it.id)} aria-label="Aumentar">+</button>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">Unit.</div>
                      <div className="text-sm font-medium">{formatBRL(it.price)}</div>
                      <div className="mt-2 text-xs text-muted-foreground">Total</div>
                      <div className="text-base font-semibold">{formatBRL(it.price * it.qty)}</div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* COLUNA DIREITA: RESUMO/ENVIO */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resumo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Subtotal</span>
                  <span className="font-medium">{formatBRL(subtotal)}</span>
                </div>
                <Separator className="my-2" />
                <p className="text-xs text-muted-foreground">
                  Não há cobrança online. Enviaremos este pedido para nossa equipe comercial finalizar valores, prazos e frete.
                </p>
                <Button
                  className="mt-4 w-full h-11"
                  disabled={!items.length || !name || !email}
                  onClick={handleSend}
                >
                  Enviar por e-mail
                </Button>
              </div>
            </CardContent>
          </Card>

          <Button variant="outline" className="w-full" onClick={() => navigate(-1)}>
            Voltar ao catálogo
          </Button>
        </div>
      </div>
    </div>
  )
}
