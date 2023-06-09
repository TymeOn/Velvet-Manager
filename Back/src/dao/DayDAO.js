import dotenv from 'dotenv';
import { DB } from '../config/DB.js';
import { Day } from '../models/Day.js';
dotenv.config();

export class DayDAO {

    // get the day
    async get() {
        const client = await DB.open();
        const query = {
            text: `SELECT id, date::text, time_slot, mirror FROM ${process.env.PG_SCHEMA}.day WHERE id=$1`,
            values: [1]
        };
        const result = await client.query(query);
        let data;
        if(result && result.rows && result.rows[0]) {
             data = new Day(
                result.rows[0].id,
                result.rows[0].date,
                result.rows[0].time_slot,
                result.rows[0].mirror
             );
        } else {
            data = null;
        }
        return data;
    }

    // update the day
    async update(day) {
        let data = null;
        if (await this.get(day.getId())) {
            const client = await DB.open();
            const query = {
                text: `UPDATE ${process.env.PG_SCHEMA}.day 
                        SET date=$2, time_slot=$3, mirror=$4
                        WHERE id=$1 
                        RETURNING id, date::text, time_slot, mirror`,
                values: [
                    day.getId(),
                    day.getDate(),
                    day.getTimeslot(),
                    day.isMirror()
                ],
            }
            const result = await client.query(query);
            if(result && result.rows && result.rows[0]) {
                data = new Day(
                    result.rows[0].id,
                    result.rows[0].date,
                    result.rows[0].time_slot,
                    result.rows[0].mirror
                );
            }
        }
        return data;
    }

    // move the day forward by one day
    async moveForward() {
        let data = null;
        const client = await DB.open();
        const query = {
            text: `UPDATE ${process.env.PG_SCHEMA}.day 
                    SET date=(date + INTERVAL '1 day'), time_slot='day' 
                    WHERE id=$1
                    RETURNING id, date::text, time_slot, mirror`,
            values: [1],
        }
        const result = await client.query(query);
        if(result && result.rows && result.rows[0]) {
            data = new Day(
                result.rows[0].id,
                result.rows[0].date,
                result.rows[0].time_slot,
                result.rows[0].mirror
            );
        }
        return data;
    }

    // move the day backward by one day
    async moveBackward() {
        let data = null;
        const client = await DB.open();
        const query = {
            text: `UPDATE ${process.env.PG_SCHEMA}.day 
                    SET date=(date - INTERVAL '1 day'), time_slot='night' 
                    WHERE id=$1
                    RETURNING id, date::text, time_slot, mirror`,
            values: [1],
        }
        const result = await client.query(query);
        if(result && result.rows && result.rows[0]) {
            data = new Day(
                result.rows[0].id,
                result.rows[0].date,
                result.rows[0].time_slot,
                result.rows[0].mirror
            );
        }
        return data;
    }

}
