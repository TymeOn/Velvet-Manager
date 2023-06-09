import dotenv from 'dotenv';
import { DB } from '../config/DB.js';
import { Weather } from '../models/Weather.js';
dotenv.config();

export class WeatherDAO {

    // get all the weathers
    async getAll(ongoing) {
        const client = await DB.open();
        const query = {
            text: `SELECT date::text, code, temperature FROM ${process.env.PG_SCHEMA}.weathers ` +
                (ongoing ? `WHERE date >= (SELECT date FROM ${process.env.PG_SCHEMA}.day)` : ``) +
                `ORDER BY date ASC`,
        };
        const result = await client.query(query);
        let data;
        if(result && result.rows) {
            data = [];
            result.rows.forEach((row) => {
                data.push(new Weather(
                    row.date,
                    row.code,
                    row.temperature
                ));
            });
        } else {
            data = null;
        }
        return data;
    }

    // get one weather
    async get(date) {
        const client = await DB.open();
        const query = {
            text: `SELECT date::text, code, temperature
                FROM ${process.env.PG_SCHEMA}.weathers WHERE date=$1`,
            values: [date],
        };
        const result = await client.query(query);
        let data;
        if(result && result.rows && result.rows[0]) {
             data = new Weather(
                result.rows[0].date,
                result.rows[0].code,
                result.rows[0].temperature
             );
        } else {
            data = null;
        }
        return data;
    }

    // get the current weather
    async getCurrent() {
        const client = await DB.open();
        const query = {
            text: `SELECT date::text, code, temperature
                FROM ${process.env.PG_SCHEMA}.weathers
                WHERE date=(SELECT date FROM ${process.env.PG_SCHEMA}.day)`
        };
        const result = await client.query(query);
        let data;
        if(result && result.rows && result.rows[0]) {
                data = new Weather(
                result.rows[0].date,
                result.rows[0].code,
                result.rows[0].temperature
                );
        } else {
            data = null;
        }
        return data;
    }

    // update a weather
    async update(weather) {
        let data = null;
        if (await this.get(weather.getDate())) {
            const client = await DB.open();
            const query = {
                text: `UPDATE ${process.env.PG_SCHEMA}.weathers 
                        SET code=$2, temperature=$3
                        WHERE date=$1
                        RETURNING date::text, code, temperature`,
                values: [
                    weather.getDate(),
                    weather.getCode(),
                    weather.getTemperature()
                ],
            }
            const result = await client.query(query);
            if(result && result.rows && result.rows[0]) {
                data = new Weather(
                    result.rows[0].date,
                    result.rows[0].code,
                    result.rows[0].temperature
                );
            }
        }
        return data;
    }

}
