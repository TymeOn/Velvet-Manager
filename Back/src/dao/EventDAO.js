import dotenv from 'dotenv';
import { DB } from '../config/DB.js';
import { Event } from '../models/Event.js';
dotenv.config();

export class EventDAO {

    // get all the events
    async getAll(ongoing, showAll = false) {
        const client = await DB.open();
        const query = {
            text: `SELECT id, start_date::text, end_date::text, title, color, hidden
                FROM ${process.env.PG_SCHEMA}.events WHERE 1=1` +
                (ongoing ? `AND ((end_date IS NULL AND start_date = (SELECT date FROM ${process.env.PG_SCHEMA}.day))
                    OR (end_date IS NOT NULL AND (SELECT date FROM ${process.env.PG_SCHEMA}.day) BETWEEN start_date AND end_date))` 
                : ``) +
                (showAll ? `` : ` AND hidden=FALSE`) + 
                ` ORDER BY start_date, end_date, title ASC`,
        };
        const result = await client.query(query);
        let data;
        if(result && result.rows) {
            data = [];
            result.rows.forEach((row) => {
                data.push(new Event(
                    row.id,
                    row.start_date,
                    row.end_date,
                    row.title,
                    row.color,
                    row.hidden
                ));
            });
        } else {
            data = null;
        }
        return data;
    }

    // get one event
    async get(id) {
        const client = await DB.open();
        const query = {
            text: `SELECT id, start_date::text, end_date::text, title, color, hidden
                FROM ${process.env.PG_SCHEMA}.events WHERE id=$1`,
            values: [id],
        };
        const result = await client.query(query);
        let data;
        if(result && result.rows && result.rows[0]) {
             data = new Event(
                result.rows[0].id,
                result.rows[0].start_date,
                result.rows[0].end_date,
                result.rows[0].title,
                result.rows[0].color,
                result.rows[0].hidden
             );
        } else {
            data = null;
        }
        return data;
    }

    // get current events
    async getCurrent(showAll = false) {
        const client = await DB.open();
        const query = {
            text: `SELECT id, start_date::text, end_date::text, title, color, hidden
                FROM ${process.env.PG_SCHEMA}.events 
                WHERE ((end_date IS NULL AND start_date = (SELECT date FROM ${process.env.PG_SCHEMA}.day))
                OR (end_date IS NOT NULL AND (SELECT date FROM ${process.env.PG_SCHEMA}.day) BETWEEN start_date AND end_date))` +
                (showAll ? `` : ` AND hidden=FALSE`) + 
                ` ORDER BY start_date, end_date, title ASC`
        };
        const result = await client.query(query);
        let data;
        if(result && result.rows) {
            data = [];
            result.rows.forEach((row) => {
                data.push(new Event(
                    row.id,
                    row.start_date,
                    row.end_date,
                    row.title,
                    row.color,
                    row.hidden
                ));
            });
        } else {
            data = null;
        }
        return data;
    }

    // add a new event
    async add(startDate, endDate, title, color, hidden) {
        const client = await DB.open();
        const query = {
            text: `INSERT INTO ${process.env.PG_SCHEMA}.events(start_date, end_date, title, color, hidden) 
                    VALUES ($1, $2, $3, $4, $5) 
                    RETURNING start_date::text, end_date::text, title, color, hidden`,
            values: [startDate, endDate, title, color, hidden],
        };
        const result = await client.query(query);
        let data;
        if(result && result.rows && result.rows[0]) {
            data = new Event(
                result.rows[0].id,
                result.rows[0].start_date,
                result.rows[0].end_date,
                result.rows[0].title,
                result.rows[0].color,
                result.rows[0].hidden
            );
        } else {
           data = null;
        }
        return data;
    }

    // update an event
    async update(event) {
        let data = null;
        if (await this.get(event.getId())) {
            const client = await DB.open();
            const query = {
                text: `UPDATE ${process.env.PG_SCHEMA}.events 
                        SET start_date=$2, end_date=$3, title=$4, color=$5, hidden=$6
                        WHERE id=$1
                        RETURNING start_date::text, end_date::text, title, color, hidden`,
                values: [
                    event.getId(),
                    event.getStartDate(),
                    event.getEndDate(),
                    event.getTitle(),
                    event.getColor(),
                    event.isHidden()
                ],
            }
            const result = await client.query(query);
            if(result && result.rows && result.rows[0]) {
                data = new Event(
                    result.rows[0].id,
                    result.rows[0].start_date,
                    result.rows[0].end_date,
                    result.rows[0].title,
                    result.rows[0].color,
                    result.rows[0].hidden
                );
            }
        }
        return data;
    }

    // remove a marker
    async remove(eventId) {
        let data = null;
        const client = await DB.open();
        const query = {
            text: `DELETE FROM ${process.env.PG_SCHEMA}.events WHERE id=$1
            RETURNING start_date::text, end_date::text, title, color, hidden`,
            values: [eventId],
        }
        const result = await client.query(query);
        if(result && result.rows && result.rows[0]) {
            data = new Event(
                result.rows[0].id,
                result.rows[0].start_date,
                result.rows[0].end_date,
                result.rows[0].title,
                result.rows[0].color,
                result.rows[0].hidden
            );
        }
        return data;
    }

}
