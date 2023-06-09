import dotenv from 'dotenv';
import { DB } from '../config/DB.js';
import { Marker } from '../models/Marker.js';
dotenv.config();

export class MarkerDAO {

    // get all the markers
    async getAll(showAll = false) {
        const client = await DB.open();
        const query = {
            text: `SELECT * FROM ${process.env.PG_SCHEMA}.markers` +
            (showAll ? `` : ` WHERE hidden=FALSE`) +
            ` ORDER BY id ASC`,
        };
        const result = await client.query(query);
        let data;
        if(result && result.rows) {
            data = [];
            result.rows.forEach((row) => {
                data.push(new Marker(
                    row.id,
                    row.label,
                    row.lat,
                    row.lon,
                    row.icon,
                    row.bg_color,
                    row.hidden
                ));
            });
        } else {
            data = null;
        }
        return data;
    }

    // get one marker
    async get(id) {
        const client = await DB.open();
        const query = {
            text: `SELECT * FROM ${process.env.PG_SCHEMA}.markers WHERE id=$1 ORDER BY id ASC`,
            values: [id],
        };
        const result = await client.query(query);
        let data;
        if(result && result.rows && result.rows[0]) {
             data = new Marker(
                 result.rows[0].id,
                 result.rows[0].label,
                 result.rows[0].lat,
                 result.rows[0].lon,
                 result.rows[0].icon,
                 result.rows[0].bg_color,
                 result.rows[0].hidden
             );
        } else {
            data = null;
        }
        return data;
    }

    // add a new marker
    async add(label, lat, lon, icon, bgColor, hidden) {
        const client = await DB.open();
        const query = {
            text: `INSERT INTO ${process.env.PG_SCHEMA}.markers(label, lat, lon, icon, bg_color, hidden) 
                    VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            values: [label, lat, lon, icon, bgColor, hidden],
        };
        const result = await client.query(query);
        let data;
        if(result && result.rows && result.rows[0]) {
            data = new Marker(
                result.rows[0].id,
                result.rows[0].label,
                result.rows[0].lat,
                result.rows[0].lon,
                result.rows[0].icon,
                result.rows[0].bg_color,
                result.rows[0].hidden
            );
        } else {
           data = null;
        }
        return data;
    }

    // update a marker
    async update(marker) {
        let data = null;
        if (await this.get(marker.getId())) {
            const client = await DB.open();
            const query = {
                text: `UPDATE ${process.env.PG_SCHEMA}.markers 
                        SET label=$2, lat=$3, lon=$4, icon=$5, bg_color=$6, hidden=$7
                        WHERE id=$1 RETURNING *`,
                values: [
                    marker.getId(),
                    marker.getLabel(),
                    marker.getLat(),
                    marker.getLon(),
                    marker.getIcon(),
                    marker.getBgColor(),
                    marker.isHidden()
                ],
            }
            const result = await client.query(query);
            if(result && result.rows && result.rows[0]) {
                data = new Marker(
                    result.rows[0].id,
                    result.rows[0].label,
                    result.rows[0].lat,
                    result.rows[0].lon,
                    result.rows[0].icon,
                    result.rows[0].bg_color,
                    result.rows[0].hidden
                );
            }
        }
        return data;
    }

    // remove a marker
    async remove(markerId) {
        let data = null;
        const client = await DB.open();
        const query = {
            text: `DELETE FROM ${process.env.PG_SCHEMA}.markers WHERE id=$1 RETURNING *`,
            values: [markerId],
        }
        const result = await client.query(query);
        if(result && result.rows && result.rows[0]) {
            data = new Marker(
                result.rows[0].id,
                result.rows[0].label,
                result.rows[0].lat,
                result.rows[0].lon,
                result.rows[0].icon,
                result.rows[0].bg_color,
                result.rows[0].hidden
            );
        }
        return data;
    }

}
