import mysql from 'mysql';
import keys from './keys';

const pool = mysql.createPool(keys.database);

export default pool;