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
}

export interface ProductsResponse {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
}
