"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var productosController_1 = require("./productosController");
var router = express_1.Router();
router.get('/', productosController_1.productosController.getProducts);
exports.default = router;
var administradoresController_1 = require("../controllers/administradoresController");
var IndexRoutes = /** @class */ (function () {
    function IndexRoutes() {
        this.router = express_1.Router();
        this.config();
    }
    IndexRoutes.prototype.config = function () {
        this.router.get('/', administradoresController_1.administradoresController.getAdministradores);
        this.router.get('/deudas', administradoresController_1.administradoresController.getDeudas);
        this.router.post('/deudas', administradoresController_1.administradoresController.addDeuda);
        this.router.get('/deudores', administradoresController_1.administradoresController.getDeudores);
        this.router.post('/deudores', administradoresController_1.administradoresController.createDeudor);
        this.router.get('/conceptos/:id', administradoresController_1.administradoresController.verConceptos);
        this.router.post('/pago/:id', administradoresController_1.administradoresController.addPago);
        this.router.get('/pago', administradoresController_1.administradoresController.getPagos);
        this.router.post('/filtro/pago', administradoresController_1.administradoresController.filterPagos);
    };
    return IndexRoutes;
}());
var indexRoutes = new IndexRoutes();
exports.default = indexRoutes.router;
