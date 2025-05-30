// связывает список товаров и фильтры

import type { Product } from '../types';
import ProductModel from '../models/ProductModel';
import ProductListView from '../views/ProductListView';

export default class ProductController {
    private productModel: ProductModel;
    private productListView: ProductListView;

    constructor(ProductModel: ProductModel, ProductListView: ProductListView) {
        this.productModel = ProductModel;
        this.productListView = ProductListView;
    }

    async init(): Promise<void> {
        document.addEventListener(
            'DOMContentLoaded',
            async (): Promise<void> => {
                try {
                    const products = await this.productModel.fetchProducts();
                    if (products) {
                        this.productListView.renderProductCards(products);
                    }
                } catch (error) {
                    console.error('Error initializing products:', error);
                }
            }
        );
    }
}
