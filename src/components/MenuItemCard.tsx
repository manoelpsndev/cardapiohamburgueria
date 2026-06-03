import { useState } from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { type MenuItem, ADDONS, formatBRL } from "@/lib/menu-data";
import { useCart } from "@/lib/cart-store";

export function MenuItemCard({ item }: { item: MenuItem }) {
  const [qty, setQty] = useState(1);
  const [open, setOpen] = useState(false);
  const [addonQtys, setAddonQtys] = useState<Record<string, number>>({});
  const [isImageModalOpen, setIsImageModalOpen] = useState(false); // ← Novo estado

  const { addLine } = useCart();

  const addonTotal = ADDONS.reduce(
    (s, a) => s + (addonQtys[a.id] || 0) * a.price,
    0,
  );
  const lineTotal = (item.price + addonTotal) * qty;

  const handleAdd = () => {
    addLine(item, qty, addonQtys);
    setQty(1);
    setAddonQtys({});
    setOpen(false);
  };

  return (
    <article className="bg-card rounded-2xl overflow-hidden border border-border/50 shadow-lg">
      <div className="flex gap-3 p-3">
        {/* IMAGEM CLICÁVEL */}
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="w-24 h-24 rounded-xl object-cover flex-shrink-0 cursor-pointer hover:scale-105 transition-transform duration-300"
          onClick={() => setIsImageModalOpen(true)}   // ← Clique para expandir
        />

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-base leading-tight">{item.name}</h3>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {item.description}
          </p>
          <p className="text-primary font-bold mt-2">{formatBRL(item.price)}</p>
        </div>
      </div>

      <div className="px-3 pb-3 flex items-center gap-2">
        <QtyControl value={qty} onChange={setQty} />
        <button
          onClick={() => setOpen((o) => !o)}
          className="text-xs text-muted-foreground underline underline-offset-2 px-1"
        >
          {open ? "Ocultar" : "Adicionais"}
        </button>
        <button
          onClick={handleAdd}
          className="ml-auto bg-primary text-primary-foreground font-semibold text-sm px-4 py-2 rounded-xl flex items-center gap-1.5 active:scale-95 transition-transform"
        >
          <ShoppingBag className="w-4 h-4" />
          {formatBRL(lineTotal)}
        </button>
      </div>

      {open && (
        <div className="px-3 pb-4 border-t border-border/50 pt-3 space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Adicionais
          </p>
          {ADDONS.map((a) => {
            const q = addonQtys[a.id] || 0;
            return (
              <div key={a.id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium">{a.name}</p>
                  <p className="text-xs text-muted-foreground">+ {formatBRL(a.price)}</p>
                </div>
                <QtyControl
                  value={q}
                  min={0}
                  onChange={(v) => setAddonQtys((s) => ({ ...s, [a.id]: v }))}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* ==================== MODAL DE IMAGEM ==================== */}
    {isImageModalOpen && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div 
            className="relative max-w-[50%] w-full flex items-center justify-center"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute -top-12 right-4 text-white text-5xl hover:text-gray-300 transition-colors z-10"
            >
              ×
            </button>
            
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-auto rounded-2xl shadow-2xl max-h-[85vh] object-contain"
            />

            <p className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-center text-white/70 text-sm">
              Clique fora da imagem ou pressione ESC para fechar
            </p>
          </div>
        </div>
      )}
    </article>
  );
}

// Mantém o componente QtyControl igual
export function QtyControl({
  value,
  onChange,
  min = 1,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
}) {
  return (
    <div className="flex items-center bg-secondary rounded-xl">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-8 h-8 flex items-center justify-center text-foreground active:bg-muted rounded-l-xl"
        aria-label="Diminuir"
      >
        <Minus className="w-4 h-4" />
      </button>
      <span className="w-7 text-center text-sm font-bold tabular-nums">{value}</span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="w-8 h-8 flex items-center justify-center text-foreground active:bg-muted rounded-r-xl"
        aria-label="Aumentar"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}