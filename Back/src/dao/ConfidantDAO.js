import dotenv from 'dotenv';
import { DB } from '../config/DB.js';
import { Confidant } from '../models/Confidant.js';
import { UserDAO } from './UserDAO.js'
dotenv.config();

export class ConfidantDAO {

    // get a confidant from its user
    async getFromUser(userId) {
        const client = await DB.open();
        const query = {
            text: `SELECT * FROM ${process.env.PG_SCHEMA}.confidants WHERE user_id=$1`,
            values: [userId],
        };
        const result = await client.query(query);
        let data;
        if(result && result.rows && result.rows[0]) {
            const userDAO = new UserDAO();
            const u = await userDAO.get(result.rows[0].user_id);
            data = new Confidant(
                result.rows[0].id,
                result.rows[0].arcana,
                result.rows[0].name,
                result.rows[0].lvl,
                result.rows[0].exp,
                u
            );
        } else {
            data = null;
        }
        return data;
    }

    // add a confidant
    async add(arcana, name, lvl, exp, user) {
        const client = await DB.open();
        const query = {
            text: `INSERT INTO ${process.env.PG_SCHEMA}.confidants(arcana, name, lvl, exp, user_id) 
                    VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            values: [arcana, name, lvl, exp, user.getId()],
        };
        const result = await client.query(query);
        let data;
        if(result && result.rows && result.rows[0]) {
            const userDAO = new UserDAO();
            const u = await userDAO.get(result.rows[0].user_id);
            data = new Confidant(
                result.rows[0].id,
                result.rows[0].arcana,
                result.rows[0].name,
                result.rows[0].lvl,
                result.rows[0].exp,
                u
            );
        } else {
           data = null;
        }
        return data;
    }

    // update a confidant
    async update(confidant) {
        let data = null;
        if (await this.getFromUser(confidant.getUser().getId())) {
            const client = await DB.open();
            const query = {
                text: `UPDATE ${process.env.PG_SCHEMA}.confidants 
                        SET arcana=$2, name=$3, exp=$4, lvl=$5
                        WHERE id=$1
                        RETURNING *`,
                values: [
                    confidant.getId(),
                    confidant.getArcana(),
                    confidant.getName(),
                    confidant.getLvl(),
                    confidant.getExp()
                ],
            }
            const result = await client.query(query);
            if(result && result.rows && result.rows[0]) {
                const userDAO = new UserDAO();
                const u = await userDAO.get(result.rows[0].user_id);
                data = new Confidant(
                    result.rows[0].id,
                    result.rows[0].arcana,
                    result.rows[0].name,
                    result.rows[0].lvl,
                    result.rows[0].exp,
                    u
                );
            }
        }
        return data;
    }

}
