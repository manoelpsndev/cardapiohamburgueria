import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { Flame, MapPin, Clock, ChevronDown, Instagram, MessageCircle } from "lucide-react";
import {
  MENU,
  CATEGORIES,
  STORE_NAME,
  STORE_LOGO,
  STORE_HOURS,
  WEEKDAY_LABELS,
  formatHour,
  isStoreOpen,
  INSTAGRAM_URL,
  WHATSAPP_URL,
} from "@/lib/menu-data";
import { MenuItemCard } from "@/components/MenuItemCard";
import { CartFAB } from "@/components/CartFAB";
import { CheckoutModal } from "@/components/CheckoutModal";
import { CartProvider } from "@/lib/cart-store";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "NaBrasa Burguer — Cardápio Digital" },
      {
        name: "description",
        content:
          "Hambúrgueres artesanais na brasa com entrega rápida. Peça pelo cardápio digital da NaBrasa Burguer.",
      },
    ],
  }),
});

function Index() {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [activeCat, setActiveCat] = useState(CATEGORIES[0]);
  const [hoursOpen, setHoursOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const open = mounted ? isStoreOpen() : false;
  const today = mounted ? new Date().getDay() : -1;

  useEffect(() => {
    setMounted(true);
  }, []);

  const grouped = useMemo(() => {
    return CATEGORIES.map((cat) => ({
      cat,
      items: MENU.filter((m) => m.category === cat),
    }));
  }, []);

  const handleCatClick = (cat: string) => {
    setActiveCat(cat);
    const el = document.getElementById(`cat-${cat}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <CartProvider>
      <div className="min-h-screen pb-32">
        {/* Hero */}
        <header className="relative bg-gradient-to-b from-card to-background border-b border-border">
          <div className="px-5 pt-8 pb-6">
            <div className="flex items-center gap-2 text-primary">
              <Flame className="w-6 h-6" />
              <span className="text-xs font-bold tracking-widest uppercase">Brasa de verdade</span>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <img
                src={STORE_LOGO}
                alt={`${STORE_NAME} logo`}
                width={64}
                height={64}
                className="w-16 h-16 rounded-full bg-card p-1 ring-2 ring-primary/40 object-contain flex-shrink-0"
              />
              <div className="min-w-0">
                <h1 className="text-3xl font-black leading-tight text-white">{STORE_NAME}</h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Hambúrgueres artesanais grelhados na brasa.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 text-xs text-muted-foreground items-center">
              <button
                type="button"
                onClick={() => setHoursOpen((v) => !v)}
                aria-expanded={hoursOpen}
                className={`flex items-center gap-1.5 font-semibold px-2.5 py-1 rounded-full transition-colors ${
                  open
                    ? "bg-[oklch(0.78_0.18_145)]/15 text-[oklch(0.78_0.18_145)]"
                    : "bg-muted text-white"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    open ? "bg-[oklch(0.78_0.18_145)]" : "bg-white/70"
                  }`}
                />
                {open ? STORE_HOURS.openLabel : "Fechado no momento"}
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${hoursOpen ? "rotate-180" : ""}`}
                />
              </button>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="w-3.5 h-3.5" /> Instagram
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
              </a>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-primary" /> 30–45 min
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-primary" /> Entrega na sua casa
              </span>
            </div>

            {hoursOpen && (
              <div className="mt-3 rounded-xl border border-border bg-card/60 p-3 text-xs">
                <div className="font-semibold text-foreground mb-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  Horários de funcionamento
                </div>
                <ul className="divide-y divide-border/60">
                  {WEEKDAY_LABELS.map((label, idx) => {
                    const d = STORE_HOURS.schedule[idx];
                    const isToday = idx === today;
                    return (
                      <li
                        key={label}
                        className={`flex justify-between py-1.5 ${
                          isToday ? "text-foreground font-semibold" : "text-muted-foreground"
                        }`}
                      >
                        <span>
                          {label}
                          {isToday && (
                            <span className="ml-2 text-[10px] uppercase tracking-wider text-primary">
                              hoje
                            </span>
                          )}
                        </span>
                        <span>
                          {d?.closed ? "Fechado" : `${formatHour(d.open)} – ${formatHour(d.close)}`}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </header>

        {/* Categories nav */}
        <nav className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border">
          <div className="flex gap-2 overflow-x-auto px-4 py-3 no-scrollbar">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => handleCatClick(c)}
                className={`flex-shrink-0 text-xs font-semibold px-4 py-2 rounded-full border transition-colors ${
                  activeCat === c
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border text-muted-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </nav>

        {/* Menu */}
        <main className="px-4 pt-4 space-y-8">
          {grouped.map(({ cat, items }) => (
            <section key={cat} id={`cat-${cat}`} className="scroll-mt-20">
              <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                <span className="w-1 h-5 bg-primary rounded-full" />
                {cat}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {items.map((item) => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          ))}
        </main>

        <CartFAB onClick={() => setCheckoutOpen(true)} />
        <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} />

        <style>{`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { scrollbar-width: none; }
        `}</style>
      </div>
    </CartProvider>
  );
}
