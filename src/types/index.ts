export interface Product {
  id: number;
  images: string[];
  title: string;
  price: number;
  description: string;
  thumbnail?: string;
  brand?: string;
  discountPercentage?: number;
  rating?: number;
  category: string;
  stock?: number;
  status?: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  image: string;
}
