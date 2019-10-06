import {Request, Response} from 'express';
import pool from './database';

class ProductosRoutes {
    //consultar información de administradores    
    public async getProductos(req: Request, res: Response) {
        const producto = await pool.query(`SELECT * FROM PRODUCTO ORDER BY name`);
        res.json(producto);
    }

    public async searchProduct(req: Request, res: Response) {
        const producto = await pool.query(`SELECT * FROM PRODUCTO WHERE name LIKE '${req.body.name}%' ORDER BY name`);
        res.json(producto);
    }

    public async addProducto(req: Request, res: Response) {
        const producto = await pool.query(`INSERT INTO PRODUCTO (name, price, stock, brand) VALUES ('${req.body.name}', ${req.body.price}, ${req.body.stock}, '${req.body.brand}')`);
        res.json({message: 'successfull'});
    }

    public async updateProduct(req: Request, res: Response) {
        const producto = await pool.query(`UPDATE PRODUCTO SET name='${req.body.name}', price=${req.body.price}, stock=${req.body.stock}, brand='${req.body.brand}' WHERE id=${req.body.id}`);
        res.json({message: 'successfull'});
    }

    public async deleteProduct(req: Request, res: Response) {
        const producto = await pool.query(`DELETE FROM PRODUCTO WHERE id=${req.body.id}`);
        res.json({message: 'delete successfull'});
    }
}
export const productosController = new ProductosRoutes();