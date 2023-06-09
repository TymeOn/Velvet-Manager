import dotenv from 'dotenv';
import { DB } from '../config/DB.js';
import { Inventory } from '../models/Inventory.js';
import { UserDAO } from './UserDAO.js'
dotenv.config();

export class InventoryDAO {

    // get an inventory from its user
    async getFromUser(userId) {
        const client = await DB.open();
        const query = {
            text: `SELECT * FROM ${process.env.PG_SCHEMA}.inventory WHERE user_id=$1`,
            values: [userId],
        };
        const result = await client.query(query);
        let data;
        if(result && result.rows && result.rows[0]) {
            const userDAO = new UserDAO();
            const u = await userDAO.get(result.rows[0].user_id);
            data = new Inventory(
                result.rows[0].id,
                result.rows[0].items,
                result.rows[0].notes,
                u
            );
        } else {
            data = null;
        }
        return data;
    }

    // add an inventory
    async add(items, notes, user) {
        const client = await DB.open();
        const query = {
            text: `INSERT INTO ${process.env.PG_SCHEMA}.inventory(items, notes, user_id) 
                    VALUES ($1, $2, $3) RETURNING *`,
            values: [items, notes, user.getId()],
        };
        const result = await client.query(query);
        let data;
        if(result && result.rows && result.rows[0]) {
            const userDAO = new UserDAO();
            const u = await userDAO.get(result.rows[0].user_id);
            data = new Inventory(
                result.rows[0].id,
                result.rows[0].items,
                result.rows[0].notes,
                u
            );
        } else {
           data = null;
        }
        return data;
    }

    // update an inventory
    async update(inventory) {
        let data = null;
        if (await this.getFromUser(inventory.getUser().getId())) {
            const client = await DB.open();
            const query = {
                text: `UPDATE ${process.env.PG_SCHEMA}.inventory 
                        SET items=$2, notes=$3
                        WHERE id=$1
                        RETURNING *`,
                values: [
                    inventory.getId(),
                    inventory.getItems(),
                    inventory.getNotes(),
                ],
            }
            const result = await client.query(query);
            if(result && result.rows && result.rows[0]) {
                const userDAO = new UserDAO();
                const u = await userDAO.get(result.rows[0].user_id);
                data = new Inventory(
                    result.rows[0].id,
                    result.rows[0].items,
                    result.rows[0].notes,
                    u
                );
            }
        }
        return data;
    }

}
