"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var productosController_1 = require("./productosController");
var ProductRoutes = /** @class */ (function () {
    function ProductRoutes() {
        this.router = express_1.Router();
        this.config();
    }
    ProductRoutes.prototype.config = function () {
        this.router.get('/', productosController_1.productosController.getProducts);
    };
    return ProductRoutes;
}());
var productRoutes = new ProductRoutes();
exports.default = productRoutes.router;
