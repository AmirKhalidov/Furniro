import ProductController from './controllers/ProductController';
import ProductModel from './models/ProductModel';
import ProductListView from './views/ProductListView';

const productController: ProductController = new ProductController(
    new ProductModel(),
    new ProductListView()
);
productController.init();
