import dotenv from 'dotenv';
import { DB } from '../config/DB.js';
import { User } from '../models/User.js';
import { ConfidantDAO } from './ConfidantDAO.js';
import { PersonaDAO } from './PersonaDAO.js';
import { InventoryDAO } from './InventoryDAO.js';
import { CharacterDAO } from './CharacterDAO.js';
dotenv.config();

export class UserDAO {

    // get all the users
    async getAll() {
        const client = await DB.open();
        const query = {
            text: `SELECT * FROM ${process.env.PG_SCHEMA}.users ORDER BY admin DESC, id`,
        };
        const result = await client.query(query);
        let data = [];
        if(result && result.rows) {
            for (const row of result.rows) {
                const user = new User(
                    row.id,
                    row.username,
                    row.key,
                    row.admin
                );
                data.push(user);
            }
        } else {
            data = null;
        }
        return data;
    }

    // get one user
    async get(id) {
        const client = await DB.open();
        const query = {
            text: `SELECT * FROM ${process.env.PG_SCHEMA}.users WHERE id=$1`,
            values: [id],
        };
        const result = await client.query(query);
        let data;
        if(result && result.rows && result.rows[0]) {
             data = new User(
                result.rows[0].id,
                result.rows[0].username,
                result.rows[0].key,
                result.rows[0].admin
            );
        } else {
            data = null;
        }
        return data;
    }

    // check if the user exists in the DB
    async getKey(username) {
        const client = await DB.open();
        const query = {
            text: `SELECT id, key, admin FROM ${process.env.PG_SCHEMA}.users WHERE username=$1`,
            values: [username]
        };
        const result = await client.query(query);
        let data;
        if(result && result.rows && result.rows[0]) {
            data = {
                id: result.rows[0].id,
                key: result.rows[0].key,
                admin: result.rows[0].admin
            };
        } else {
            data = null;
        }
        return data;
    }

    // add a new user
    async add(username, key) {
        const client = await DB.open();
        const query = {
            text: `INSERT INTO ${process.env.PG_SCHEMA}.users(username, key) 
                    VALUES ($1, $2) RETURNING *`,
            values: [username, key],
        };
        const result = await client.query(query);
        let data;
        if(result && result.rows && result.rows[0]) {
            data = new User(
                result.rows[0].id,
                result.rows[0].username,
                result.rows[0].key,
                result.rows[0].admin
            );
            const confidantDAO = new ConfidantDAO();
            const emptyArr = Array(16).fill('');
            const nullArr = Array(16).fill(null)
            await confidantDAO.add(emptyArr, emptyArr, nullArr, nullArr, data);

            const personaDAO = new PersonaDAO();
            const affinitiesArray = Array(10).fill('');
            const attacksArray = Array(8).fill('');
            const skillsArray = Array(20).fill('');
            await personaDAO.add(
                '',
                '',
                '',
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                affinitiesArray,
                attacksArray,
                attacksArray,
                attacksArray,
                skillsArray,
                skillsArray,
                skillsArray,
                data
            );

            const inventoryDAO = new InventoryDAO();
            const itemsArr = Array(14).fill('');
            await inventoryDAO.add(itemsArr, '', data);

            const characterDAO = new CharacterDAO();
            await characterDAO.add('', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '', '', '', '', '', '', '', '', 0, 0, 0, 0, 0, '', '', '', 0, data);
        } else {
            data = null;
        }
        return data;
    }

    // update a user
    async update(user) {
        let data = null;
        if (await this.get(user.getId())) {
            const client = await DB.open();
            const query = {
                text: `UPDATE ${process.env.PG_SCHEMA}.users 
                        SET username=$2, key=$3
                        WHERE id=$1 RETURNING *`,
                values: [
                    user.getId(),
                    user.getUsername(),
                    user.getKey(),
                ],
            }
            const result = await client.query(query);
            if(result && result.rows && result.rows[0]) {
                data = new User(
                    result.rows[0].id,
                    result.rows[0].username,
                    result.rows[0].key,
                    result.rows[0].admin
                );
            }
        }
        return data;
    }

    // remove a user
    async remove(userId) {
        let data = null;
        const client = await DB.open();
        const query = {
            text: `DELETE FROM ${process.env.PG_SCHEMA}.users WHERE id=$1 RETURNING *`,
            values: [userId],
        }
        const result = await client.query(query);
        if(result && result.rows && result.rows[0]) {
            data = new User(
                result.rows[0].id,
                result.rows[0].username,
                result.rows[0].key,
                result.rows[0].admin
            );
        }
        return data;
    }

}
