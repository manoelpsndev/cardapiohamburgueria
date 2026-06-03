import { useState } from "react";
import { X, Trash2, Copy, Check, Tag } from "lucide-react";
import { useCart, type CartLine } from "@/lib/cart-store";
import {
  DELIVERY_FEE,
  WHATSAPP_NUMBER,
  PIX_KEY,
  formatBRL,
  validateCoupon,
  type Coupon,
} from "@/lib/menu-data";

type Payment = "PIX" | "Cartão (Crédito/Débito)" | "Dinheiro";

export function CheckoutModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { lines, removeLine, clear } = useCart();
  const [name, setName] = useState("");
  const [cep, setCep] = useState("");
  const [street, setStreet] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [notes, setNotes] = useState("");
  const [payment, setPayment] = useState<Payment>("PIX");
  const [changeFor, setChangeFor] = useState("");
  const [cepLoading, setCepLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState("");

  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
  const baseDelivery = lines.length > 0 ? DELIVERY_FEE : 0;

  let discount = 0;
  let deliveryFee = baseDelivery;
  if (coupon) {
    if (coupon.type === "free_shipping") deliveryFee = 0;
    else if (coupon.type === "percent") discount = subtotal * ((coupon.value || 0) / 100);
    else if (coupon.type === "fixed") discount = Math.min(coupon.value || 0, subtotal);
  }
  const total = Math.max(0, subtotal - discount) + deliveryFee;

  const applyCoupon = () => {
    setCouponError("");
    if (!couponInput.trim()) return;
    const c = validateCoupon(couponInput);
    if (!c) {
      setCoupon(null);
      setCouponError("Cupom inválido ou indisponível hoje.");
      return;
    }
    setCoupon(c);
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponInput("");
    setCouponError("");
  };

  const handleCepBlur = async () => {
    const clean = cep.replace(/\D/g, "");
    if (clean.length !== 8) return;
    setCepLoading(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setStreet(data.logradouro || "");
        setNeighborhood(data.bairro || "");
        setCity(`${data.localidade || ""}${data.uf ? "/" + data.uf : ""}`);
      }
    } catch {
      // silent
    } finally {
      setCepLoading(false);
    }
  };

  const copyPix = async () => {
    await navigator.clipboard.writeText(PIX_KEY);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const buildMessage = () => {
    const orderNumber = `E${Math.floor(100 + Math.random() * 900)}`;

    const itemsList = lines
      .map((l) => {
        const main = `${l.qty}x ${l.item.name} - ${formatBRL(l.item.price * l.qty)}`;
        const addons = l.addons.map((a) => `+ ${a.qty}x ${a.addon.name}`).join("\n");
        return addons ? `${main}\n${addons}` : main;
      })
      .join("\n");

    const addressMain = `${street}, ${number}${complement ? "\n" + complement : ""}`;
    const addressLine2 = `${neighborhood} - CEP: ${cep}`;
    const addressLine3 = city;

    const paymentLabel = payment === "Cartão (Crédito/Débito)" ? "Cartão" : payment;

    const changeText = payment === "Dinheiro" && changeFor ? `Troco para: R$ ${changeFor}` : "";

    const deliveryFeeText =
      coupon?.type === "free_shipping"
        ? "Entrega Grátis"
        : `Taxa de Entrega: ${formatBRL(deliveryFee)}`;

    const observationBlock = notes ? `*Observação:*\n${notes}` : "";

    const lines2: (string | null)[] = [
      `*Novo Pedido #${orderNumber}*`,
      ``,
      `*Cliente:* ${name}`,
      `*Modalidade:* ENTREGA`,
      `*Endereço:* ${addressMain}`,
      addressLine2,
      addressLine3,
      ``,
      `*Pagamento:* ${paymentLabel}`,
      changeText || null,
      ``,
      `*Itens:*`,
      itemsList,
      ``,
      `----------------------------`,
      `*Subtotal:* ${formatBRL(subtotal)}`,
      discount > 0 ? `Desconto (${coupon?.code}): -${formatBRL(discount)}` : null,
      deliveryFeeText,
      `*TOTAL: ${formatBRL(total)}*`,
      observationBlock ? `` : null,
      observationBlock || null,
    ];

    return lines2
      .filter((l): l is string => l !== null)
      .join("\n")
      .replace(/\n{3,}/g, "\n\n");
  };

  const canSubmit = lines.length > 0 && name && cep && street && number && neighborhood && city;

  const handleSubmit = () => {
    if (!canSubmit) return;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildMessage())}`;
    const whatsappWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (!whatsappWindow) {
      window.location.assign(url);
      return;
    }
    clear();
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center">
      <div className="bg-background w-full sm:max-w-lg sm:rounded-2xl rounded-t-3xl max-h-[92vh] overflow-y-auto">
        <header className="sticky top-0 bg-background/95 backdrop-blur border-b border-border z-10 px-5 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">Finalizar Pedido</h2>
          <button onClick={onClose} aria-label="Fechar" className="p-1">
            <X className="w-6 h-6" />
          </button>
        </header>

        <div className="p-5 space-y-6">
          {/* Items */}
          <section>
            <h3 className="font-semibold mb-3 text-sm uppercase text-muted-foreground">
              Seu pedido
            </h3>
            {lines.length === 0 ? (
              <p className="text-sm text-muted-foreground">Carrinho vazio</p>
            ) : (
              <ul className="space-y-2">
                {lines.map((l) => (
                  <CartLineRow key={l.key} line={l} onRemove={() => removeLine(l.key)} />
                ))}
              </ul>
            )}
          </section>

          {/* Coupon */}
          <section className="space-y-2">
            <h3 className="font-semibold text-sm uppercase text-muted-foreground flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" /> Cupom de desconto
            </h3>
            {coupon ? (
              <div className="flex items-center justify-between bg-[oklch(0.78_0.18_145)]/15 border border-[oklch(0.78_0.18_145)]/40 rounded-xl px-3 py-2.5">
                <div className="text-sm">
                  <p className="font-bold text-[oklch(0.85_0.18_145)]">{coupon.code}</p>
                  <p className="text-xs text-muted-foreground">{coupon.description} aplicado</p>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-xs font-semibold text-muted-foreground underline"
                >
                  remover
                </button>
              </div>
            ) : (
              <>
                <div className="flex gap-2">
                  <input
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    className="input uppercase"
                    placeholder="Digite seu cupom"
                  />
                  <button
                    onClick={applyCoupon}
                    className="px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm"
                  >
                    Aplicar
                  </button>
                </div>
                {couponError && <p className="text-xs text-destructive">{couponError}</p>}
              </>
            )}
          </section>

          {/* Totals */}
          <section className="bg-card rounded-xl p-4 space-y-1.5 text-sm">
            <Row label="Subtotal" value={formatBRL(subtotal)} />
            {discount > 0 && (
              <Row label={`Desconto (${coupon?.code})`} value={`- ${formatBRL(discount)}`} />
            )}
            <Row
              label="Taxa de Entrega"
              value={coupon?.type === "free_shipping" ? "Grátis" : formatBRL(deliveryFee)}
            />
            <div className="border-t border-border pt-2 mt-2">
              <Row label="Total Geral" value={formatBRL(total)} bold />
            </div>
          </section>

          {/* Customer */}
          <section className="space-y-3">
            <h3 className="font-semibold text-sm uppercase text-muted-foreground">Seus dados</h3>
            <Field label="Nome do cliente *">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
                placeholder="Como devemos te chamar?"
              />
            </Field>
            <Field label="CEP *">
              <input
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                onBlur={handleCepBlur}
                inputMode="numeric"
                maxLength={9}
                className="input"
                placeholder="00000-000"
              />
              {cepLoading && (
                <p className="text-xs text-muted-foreground mt-1">Buscando endereço…</p>
              )}
            </Field>
            <div className="grid grid-cols-3 gap-2">
              <Field label="Rua *" className="col-span-2">
                <input
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="input"
                />
              </Field>
              <Field label="Número *">
                <input
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  className="input"
                />
              </Field>
            </div>
            <Field label="Complemento">
              <input
                value={complement}
                onChange={(e) => setComplement(e.target.value)}
                className="input"
                placeholder="Apto, bloco, referência…"
              />
            </Field>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Bairro *">
                <input
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="input"
                />
              </Field>
              <Field label="Cidade *">
                <input value={city} onChange={(e) => setCity(e.target.value)} className="input" />
              </Field>
            </div>
            <Field label="Observações do pedido">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="input resize-none"
                placeholder="Sem cebola, ponto da carne, etc."
              />
            </Field>
          </section>

          {/* Payment */}
          <section className="space-y-3">
            <h3 className="font-semibold text-sm uppercase text-muted-foreground">
              Forma de pagamento
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {(["PIX", "Cartão (Crédito/Débito)", "Dinheiro"] as Payment[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPayment(p)}
                  className={`text-xs font-semibold py-3 px-2 rounded-xl border transition-colors ${
                    payment === p
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card border-border text-foreground"
                  }`}
                >
                  {p === "Cartão (Crédito/Débito)" ? "Cartão" : p}
                </button>
              ))}
            </div>

            {payment === "PIX" && (
              <div className="bg-card border border-border rounded-xl p-4 space-y-2">
                <p className="text-xs text-muted-foreground">Chave PIX (copia e cola)</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm font-mono bg-secondary px-3 py-2 rounded-lg break-all">
                    {PIX_KEY}
                  </code>
                  <button
                    onClick={copyPix}
                    className="p-2 bg-primary text-primary-foreground rounded-lg"
                    aria-label="Copiar PIX"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Envie o comprovante no WhatsApp ao finalizar.
                </p>
              </div>
            )}

            {payment === "Dinheiro" && (
              <Field label="Precisa de troco para quanto?">
                <input
                  value={changeFor}
                  onChange={(e) => setChangeFor(e.target.value)}
                  inputMode="decimal"
                  className="input"
                  placeholder="Ex: 100,00 (deixe vazio se não precisar)"
                />
              </Field>
            )}
          </section>

          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-2xl text-base active:scale-[0.98] transition-transform disabled:opacity-40 disabled:cursor-not-allowed"
            style={canSubmit ? { boxShadow: "var(--shadow-glow)" } : undefined}
          >
            Finalizar Pedido no WhatsApp
          </button>
        </div>
      </div>

      <style>{`
        .input {
          width: 100%;
          background: var(--color-input);
          border: 1px solid var(--color-border);
          border-radius: 0.75rem;
          padding: 0.65rem 0.85rem;
          font-size: 0.9rem;
          color: var(--color-foreground);
          outline: none;
        }
        .input:focus {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px color-mix(in oklab, var(--color-primary) 25%, transparent);
        }
      `}</style>
    </div>
  );
}

function CartLineRow({ line, onRemove }: { line: CartLine; onRemove: () => void }) {
  return (
    <li className="flex gap-3 items-start bg-card rounded-xl p-3">
      <img
        src={line.item.image}
        alt={line.item.name}
        className="w-14 h-14 rounded-lg object-cover"
      />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm">
          {line.qty}x {line.item.name}
        </p>
        {line.addons.length > 0 && (
          <p className="text-xs text-muted-foreground">
            + {line.addons.map((a) => `${a.qty}x ${a.addon.name}`).join(", ")}
          </p>
        )}
        <p className="text-sm text-primary font-semibold mt-1">{formatBRL(line.lineTotal)}</p>
      </div>
      <button onClick={onRemove} aria-label="Remover" className="p-2 text-muted-foreground">
        <Trash2 className="w-4 h-4" />
      </button>
    </li>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? "text-base font-bold" : ""}`}>
      <span className={bold ? "" : "text-muted-foreground"}>{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs font-medium text-muted-foreground mb-1 block">{label}</span>
      {children}
    </label>
  );
}
