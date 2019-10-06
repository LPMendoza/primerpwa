"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var productosController_1 = require("./productosController");
var ProductsRoutes = /** @class */ (function () {
    function ProductsRoutes() {
        this.router = express_1.Router();
        this.config();
    }
    ProductsRoutes.prototype.config = function () {
        this.router.get('/', productosController_1.productosController.getProductos);
        this.router.post('/', productosController_1.productosController.addProducto);
        this.router.delete('/', productosController_1.productosController.deleteProduct);
        this.router.put('/', productosController_1.productosController.updateProduct);
        this.router.post('/buscar', productosController_1.productosController.searchProduct);
    };
    return ProductsRoutes;
}());
var productRoutes = new ProductsRoutes();
exports.default = productRoutes.router;
