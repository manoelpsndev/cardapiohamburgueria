export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
};

export type Addon = {
  id: string;
  name: string;
  price: number;
};

export const DELIVERY_FEE = 8.0;
export const WHATSAPP_NUMBER = "5573998675007";
export const STORE_NAME = "NaBrasa Burguer";
export const PIX_KEY = "brasaburguer26@gmail.com";

// Links sociais — EDITÁVEIS
export const INSTAGRAM_URL = "https://www.instagram.com/brasaburguerdelivery1/";
export const WHATSAPP_URL = "https://wa.me/5573998675007";

// Logo da loja — substitua o arquivo em src/assets/logo.png para trocar
import logoUrl from "@/assets/logo.png";
export const STORE_LOGO = logoUrl;

/**
 * Horário de funcionamento — EDITÁVEL
 * - openLabel: texto exibido quando a loja está aberta
 * - schedule: horários por dia da semana (0=Dom..6=Sáb). closed=true marca fechado.
 *   Edite os horários de cada dia conforme necessário.
 */
export type DaySchedule = { open: number; close: number; closed?: boolean };

export const STORE_HOURS: {
  openLabel: string;
  schedule: Record<number, DaySchedule>;
} = {
  openLabel: "Aberto até as 23h",
  schedule: {
    0: { open: 18, close: 23 },             // Domingo
    1: { open: 0, close: 0, closed: true }, // Segunda — fechado
    2: { open: 18, close: 23 },             // Terça
    3: { open: 18, close: 23 },             // Quarta
    4: { open: 18, close: 23 },             // Quinta
    5: { open: 18, close: 24 },             // Sexta
    6: { open: 18, close: 24 },             // Sábado
  },
};

export const WEEKDAY_LABELS = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

export function formatHour(h: number) {
  if (h >= 24) return "00h";
  return `${String(h).padStart(2, "0")}h`;
}

export function isStoreOpen(now: Date = new Date()) {
  const day = STORE_HOURS.schedule[now.getDay()];
  if (!day || day.closed) return false;
  const h = now.getHours();
  return h >= day.open && h < day.close;
}

/**
 * Cupons de desconto — EDITÁVEL
 * - type: "free_shipping" (zera taxa), "percent" (% no subtotal), "fixed" (R$ no subtotal)
 * - days: opcional, restringe a dias da semana (0=Dom..6=Sáb). Omita para liberar todos os dias.
 */
export type Coupon = {
  code: string;
  type: "free_shipping" | "percent" | "fixed";
  value?: number;
  days?: number[];
  description: string;
};

export const COUPONS: Coupon[] = [
  { code: "FRETEGRATIS", type: "free_shipping", description: "Frete grátis", days: [2, 3] },
  { code: "SEGUE10", type: "percent", value: 10, description: "10% OFF", days: [1] },
  { code: "BRASA15", type: "percent", value: 15, description: "15% OFF no pedido" },
];

export function validateCoupon(code: string, now: Date = new Date()): Coupon | null {
  const c = COUPONS.find((x) => x.code.toUpperCase() === code.trim().toUpperCase());
  if (!c) return null;
  if (c.days && !c.days.includes(now.getDay())) return null;
  return c;
}


export const ADDONS: Addon[] = [
  { id: "bacon", name: "Bacon extra", price: 5 },
  { id: "cheddar", name: "Cheddar extra", price: 2 },
  { id: "muçarela", name: "Muçarela extra", price: 2 },
  { id: "ovo", name: "Ovo", price: 2 },
  { id: "carne", name: "Carne", price: 8 },
  { id: "banana", name: "Banana extra", price: 2 },
];

export const MENU: MenuItem[] = [
  {
    id: "1",
    name: "Bru Brasa",
    description: "Pão Brioche, Blend de 150g, queijo coalho grelhado com mel, cebola caramelizada, bacon artesanal, Molho da casa, alface, tomate.",
    price: 33.0,
    image: "https://i.ibb.co/GfkTQBQk/bru-brasa.jpg",
    category: "Mais Vendidos",
  },
  {
    id: "2",
    name: "Banana Brasa",
    description: "Pão Brioche, Blend de 150g, queijo muçarela, bacon artesanal, banana, requeijão cremoso, alface, tomate.",
    price: 32.0,
    image: "https://i.ibb.co/TBwMBvnB/banana-brasa.png",
    category: "Mais Vendidos",
  },

  //-------------------------- ESPECIAIS ----------------------------------------//

  {
    id: "3",
    name: "Tropical Brasa",
    description: "Pão Brioche, Blend de 150g, queijo coalho grelhado com mel, abacaxi grelhado caramelizado no mel, bacon artesanal, Molho da casa, alface, tomate.",
    price: 35.0,
    image: "https://i.ibb.co/C3hv6GqF/tropical-brasa.png",
    category: "Especiais",
  },
  {
    id: "4",
    name: "Doce Brasa",
    description: "Pão Brioche, Blend de 150g, creme cheddar, cebola caramelizada, bacon artesanal, Molho da casa, alface, tomate.",
    price: 30.0,
    image: "https://i.ibb.co/cKzYWFFt/doce-brasa.png",
    category: "Especiais",
  },
  {
    id: "5",
    name: "Glorioso Braseiro",
    description: "Pão Brioche, Blend de 150g, muçarela, bacon artesanal, cebola crispy crocante, Molho da casa, alface, tomate.",
    price: 30.0,
    image: "https://i.ibb.co/0j44ByyW/glorioso.jpg",
    category: "Especiais",
  },
  {
    id: "6",
    name: "Dupla Brasa",
    description: "Pão Brioche, 2x Blend de 150g, 2x creme cheedar da casa, bacon artesanal, Molho da casa, alface, tomate.",
    price: 33.0,
    image: "https://i.ibb.co/BK4HPLr4/dupla-brasa.jpg",
    category: "Especiais",
  },


  //------------------ SIMPLES ---------//
  {
    id: "7",
    name: "Bacon Brasa",
    description: "Pão Brioche, Blend de 120g, cheedar, bacon, Molho verde, alface, tomate.",
    price: 25.0,
    image: "https://i.ibb.co/QvYW8NHW/bacon-brasa.png",
    category: "Simples",
  },
  {
    id: "8",
    name: "Brasa Raiz",
    description: "Pão Brioche, Blend de 120g, cheedar, cebola roxa, Molho verde, alface, tomate.",
    price: 20.0,
    image: "https://i.ibb.co/234Sh6Y8/brasa-raiz.png",
    category: "Simples",
  },
  {
    id: "9",
    name: "Brasa Verde",
    description: "Pão Brioche, Blend de 120g, cheedar, ovo, cebola roxa, Molho verde, alface, tomate.",
    price: 23.0,
    image: "https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?w=800&q=80",
    category: "Simples",
  },

  //------------------ COMBOS ----------//

  {
    id: "10",
    name: "Combo Casal",
    description: "2 Brasas Raiz + refrigerante Guarana de 1l.",
    price: 45.0,
    image: "https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?w=800&q=80",
    category: "Combos",
  },
  {
    id: "11",
    name: "Combo Casal completo",
    description: "2 Brasas Raiz + refrigerante Guarana de 1l + 300g Batata temperada.",
    price: 62.0,
    image: "https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?w=800&q=80",
    category: "Combos",
  },




  //------------------ ACOMPANHAMENTO ----------//
  {
    id: "12",
    name: "Batata Frita",
    description: "Batata frita crocante com tempero da casa.",
    price: 19.00,
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&q=80",
    category: "Acompanhamentos",
  },
  
  //----------------- BEBIDAS ---------------//
  {
    id: "13",
    name: "Coca-Cola 350ml",
    description: "Refrigerante gelado para acompanhar.",
    price: 6.0,
    image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=800&q=80",
    category: "Bebidas",
  },
  {
    id: "14",
    name: "Guarana 350ml",
    description: "Refrigerante gelado para acompanhar.",
    price: 6.0,
    image: "https://i.ibb.co/jPN9SrST/Guarana-350ml.jpg",
    category: "Bebidas",
  },
  {
    id: "15",
    name: "Coca-Cola 1l",
    description: "Refrigerante gelado para acompanhar.",
    price: 9.0,
    image: "https://i.ibb.co/r288GQFQ/coca-cola-litro.jpg",
    category: "Bebidas",
  }
];

export const CATEGORIES = [
  "Mais Vendidos",
  "Especiais",
  "Simples",
  "Combos",
  "Acompanhamentos",
  "Bebidas",
];

export const formatBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
