import axios from 'axios';
import type { ProductsResponse } from '../types';

export default class ProductsService {
    async fetchProductsData(): Promise<ProductsResponse> {
        try {
            const { data } = await axios.get<ProductsResponse>(
                'https://dummyjson.com/products?limit=8'
            );
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    }
}