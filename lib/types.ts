export type Product = {
  id: string;
  name: string;
  description: string;
  price: string;
  images: string[];
  variant?: { color?: 'white' | 'black' };
};

export type CartItem = {
  productId: string;
  quantity: number;
  variant?: { color?: 'white' | 'black' };
  price?: number;
};

export type Cart = {
  id?: string;
  items: CartItem[];
  totalQuantity: number;
  totalPrice: string;
};

export type Menu = {
  title: string;
  path: string;
};