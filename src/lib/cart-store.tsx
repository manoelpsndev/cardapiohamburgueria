import { createContext, useContext, useState, type ReactNode } from "react";
import { ADDONS, type Addon, type MenuItem } from "./menu-data";

export type CartLine = {
  key: string;
  item: MenuItem;
  qty: number;
  addons: { addon: Addon; qty: number }[];
  lineTotal: number;
};

type CartCtx = {
  lines: CartLine[];
  addLine: (item: MenuItem, qty: number, addonQtys: Record<string, number>) => void;
  removeLine: (key: string) => void;
  clear: () => void;
};

const Ctx = createContext<CartCtx | null>(null);

const computeTotal = (item: MenuItem, qty: number, addons: CartLine["addons"]) => {
  const addonSum = addons.reduce((s, a) => s + a.addon.price * a.qty, 0);
  return (item.price + addonSum) * qty;
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  const addLine: CartCtx["addLine"] = (item, qty, addonQtys) => {
    const addons = ADDONS
      .map((a) => ({ addon: a, qty: addonQtys[a.id] || 0 }))
      .filter((a) => a.qty > 0);
    const key = `${item.id}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const line: CartLine = {
      key, item, qty, addons,
      lineTotal: computeTotal(item, qty, addons),
    };
    setLines((s) => [...s, line]);
  };

  const removeLine = (key: string) => setLines((s) => s.filter((l) => l.key !== key));
  const clear = () => setLines([]);

  return <Ctx.Provider value={{ lines, addLine, removeLine, clear }}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used within CartProvider");
  return c;
}
