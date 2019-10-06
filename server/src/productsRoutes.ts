import {Router} from 'express';
import {productosController} from './productosController';

class ProductsRoutes {

   public router: Router = Router();

   constructor() {
      this.config();
   }

   config(): void {
      this.router.get('/', productosController.getProductos);
      this.router.post('/', productosController.addProducto);
      this.router.delete('/', productosController.deleteProduct);
      this.router.put('/', productosController.updateProduct);
      this.router.post('/buscar', productosController.searchProduct);
   }

}

const productRoutes = new ProductsRoutes();
export default productRoutes.router;


