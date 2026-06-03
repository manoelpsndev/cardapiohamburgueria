import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { formatBRL } from "@/lib/menu-data";

export function CartFAB({ onClick }: { onClick: () => void }) {
  const { lines } = useCart();
  const totalQty = lines.reduce((s, l) => s + l.qty, 0);
  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);

  if (totalQty === 0) return null;

  return (
    <button
      onClick={onClick}
      className="fixed bottom-4 left-4 right-4 z-40 bg-primary text-primary-foreground rounded-2xl shadow-2xl flex items-center justify-between px-5 py-4 active:scale-[0.98] transition-transform"
      style={{ boxShadow: "var(--shadow-glow)" }}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <ShoppingCart className="w-6 h-6" />
          <span className="absolute -top-2 -right-2 bg-background text-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {totalQty}
          </span>
        </div>
        <span className="font-semibold">Ver carrinho</span>
      </div>
      <span className="font-bold tabular-nums">{formatBRL(subtotal)}</span>
    </button>
  );
}
