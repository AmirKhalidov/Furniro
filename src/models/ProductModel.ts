// логика получения, фильтрации, сортировки товаров

import ProductsService from '../services/ProductService';
import type { Product, ProductsResponse } from '../types';

export default class ProductModel {
    private service: ProductsService;
    private products: Product[] = [];
    private totalProducts = 0;

    constructor() {
        this.service = new ProductsService();
    }

    async fetchProducts(): Promise<Product[]> {
        try {
            const { products }: { products: Product[] } =
                await this.service.fetchProductsData();
            return products;
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    }

    sortProducts(sortBy: string): Product[] {
        const sorted = [...this.products];
        if (sortBy === 'price-asc')
            return sorted.sort((a, b) => a.price - b.price);
        if (sortBy === 'price-desc')
            return sorted.sort((a, b) => b.price - a.price);
        return sorted;
    }

    paginateProducts(page: number, perPage: number): Product[] {
        const start = (page - 1) * perPage;
        return this.products.slice(start, start + perPage);
    }

    getTotalPages(itemsPerPage: number): number {
        return Math.ceil(this.totalProducts / itemsPerPage);
    }

    getTotalProducts(): number {
        return this.totalProducts;
    }
}
