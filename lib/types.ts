export type Product = {
  id: string;
  name: string;
  collection?: string;
  price: string;
  images: string[];
  description?: string;
  variant?: {
    color?: string;
  };
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