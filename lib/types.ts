export interface Variant {
  id: string;
  color?: string;
  size?: string;
  image: string | undefined;
}

export interface Product {
  id: string;
  collection?: string;
  name: string;
  description?: string;
  price: string;
  images: string[];
  variant?: {
    colors?: string[];
    sizes?: string[];
  };
}

export type CartItem = {
  productId: string;
  quantity: number;
  variant?: {
    color?: string;
    size?: string;
    image?: string;
  };
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