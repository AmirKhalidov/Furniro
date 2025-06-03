// логика получения, фильтрации, сортировки товаров

import ProductsService from '../services/ProductService';
import type { Product } from '../types';

export default class ProductModel {
    private service: ProductsService;

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

}
