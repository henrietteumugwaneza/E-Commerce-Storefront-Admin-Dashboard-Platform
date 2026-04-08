export type Role = "ADMIN" | "USER";

export interface User {
  id: string;
  email: string;
  role: Role;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface ProductImage {
  url: string;
  format?: string;
}

export interface ProductVariant {
  id: string;
  color: string;
  size: string;
  sku: string;
  price: number;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  brand: string;
  images: ProductImage[];
  variants: ProductVariant[];
  category: { name: string };
  categoryId: string;
  orderCount?: number;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  quantity: number;
  product: Product;
}

export interface Cart {
  id: string;
  items: CartItem[];
}

export type OrderStatus = "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED";
export type PaymentMethod = "CREDIT_CARD" | "PAYPAL" | "MOBILE_MONEY" | "CASH_ON_DELIVERY";

export interface Order {
  id: string;
  status: OrderStatus;
  paymentMethod?: PaymentMethod;
  totalAmount: number;
  shippingAddress?: string;
  city?: string;
  postalCode?: string;
  phoneNumber?: string;
  createdAt: string;
  user?: User;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: Product;
}

export interface CheckoutFormData {
  fullName: string;
  shippingAddress: string;
  city: string;
  postalCode?: string;
  phoneNumber: string;
  email: string;
  paymentMethod: PaymentMethod;
}

// Local cart (persisted in localStorage, separate from API cart)
export interface LocalCartItem {
  product: Product;
  quantity: number;
}
