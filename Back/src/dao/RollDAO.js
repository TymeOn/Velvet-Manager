import dotenv from 'dotenv';
import { DB } from '../config/DB.js';
import { Roll } from '../models/Roll.js';
import { UserDAO } from './UserDAO.js'
dotenv.config();

export class RollDAO {

    // get all the rolls
    async getAll(limit = false) {
        const client = await DB.open();
        const query = {
            text: `SELECT * FROM ${process.env.PG_SCHEMA}.rolls ORDER BY timestamp DESC` + (limit ? ` LIMIT 10;` : ''),
        };
        const result = await client.query(query);
        let data = [];
        if(result && result.rows) {
            const userDAO = new UserDAO();
            for (const row of result.rows) {
                const u = await userDAO.get(row.user_id);
                const roll = new Roll(
                    row.id,
                    row.type,
                    row.value,
                    row.detail,
                    row.timestamp,
                    u
                );
                data.push(roll);
            };
        } else {
            data = null;
        }
        return data;
    }

    // add a new roll
    async add(type, value, detail, timestamp, user) {
        const client = await DB.open();
        const query = {
            text: `INSERT INTO ${process.env.PG_SCHEMA}.rolls(type, value, detail, timestamp, user_id) 
                    VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            values: [type, value, detail, timestamp, user.getId()],
        };
        const result = await client.query(query);
        let data;
        if(result && result.rows && result.rows[0]) {
            const userDAO = new UserDAO();
            const u = await userDAO.get(result.rows[0].user_id);
            data = new Roll(
                result.rows[0].id,
                result.rows[0].type,
                result.rows[0].value,
                result.rows[0].detail,
                result.rows[0].timestamp,
                u
            );
        } else {
           data = null;
        }
        return data;
    }

}
