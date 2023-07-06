import pg from 'pg';
import dotenv from 'dotenv';
import crypto from 'crypto';
dotenv.config();

export class DB {
    static async open() {
        if (DB.client == null) {
            try {
                const pool = new pg.Pool({
                    user: process.env.PG_USER,
                    password: process.env.PG_PASS,
                    database: process.env.PG_NAME,
                    host: process.env.PG_HOST,
                    port: process.env.PG_PORT
                });
                DB.client = await pool.connect();
                const query1 = `
                    CREATE TABLE IF NOT EXISTS ${process.env.PG_SCHEMA}.users (
                        id SERIAL, username VARCHAR(128), key VARCHAR(128), admin BOOLEAN DEFAULT FALSE,
                        PRIMARY KEY(id)
                    );
                    INSERT INTO velvet.users (username, key, admin)
                        SELECT '${process.env.DEFAULT_ADMIN_USERNAME}', '${crypto.createHash('sha1').update(`${process.env.DEFAULT_ADMIN_PASSWORD}`).digest('hex')}', TRUE
                        WHERE NOT EXISTS (SELECT * FROM velvet.users WHERE id = 1);
                    CREATE TABLE IF NOT EXISTS ${process.env.PG_SCHEMA}.markers (
                        id SERIAL,
                        label VARCHAR(128),
                        lat FLOAT DEFAULT 0,
                        lon FLOAT DEFAULT 0,
                        icon VARCHAR(64),
                        bg_color VARCHAR(7) DEFAULT '#000000',
                        hidden BOOLEAN DEFAULT TRUE,
                        PRIMARY KEY(id)
                    );
                    CREATE TABLE IF NOT EXISTS ${process.env.PG_SCHEMA}.events (
                        id SERIAL,
                        start_date DATE,
                        end_date DATE,
                        title VARCHAR(128),
                        color VARCHAR(7) DEFAULT '#000000',
                        hidden BOOLEAN DEFAULT TRUE,
                        PRIMARY KEY(id)
                    );
                    CREATE TABLE IF NOT EXISTS ${process.env.PG_SCHEMA}.day (
                        id SERIAL, date DATE, time_slot VARCHAR(64), mirror BOOLEAN DEFAULT FALSE,
                        PRIMARY KEY(id)
                    );
                    INSERT INTO velvet.day (date, time_slot)
                        SELECT '${process.env.DEFAULT_START_DATE}', 'day'
                        WHERE NOT EXISTS (SELECT * FROM velvet.day WHERE id = 1);
                    CREATE TABLE IF NOT EXISTS ${process.env.PG_SCHEMA}.weathers (
                        date DATE, code VARCHAR(64), temperature FLOAT,
                        PRIMARY KEY(date)
                    );
                `;
                await DB.client.query(query1);
                const query2 = `
                    CREATE TABLE IF NOT EXISTS ${process.env.PG_SCHEMA}.rolls (
                        id SERIAL, type VARCHAR(128), value INTEGER, detail VARCHAR(256), timestamp TIMESTAMP WITH TIME ZONE, user_id INTEGER,
                        PRIMARY KEY(id),
                        FOREIGN KEY(user_id) REFERENCES ${process.env.PG_SCHEMA}.users(id) ON DELETE CASCADE
                    );
                    CREATE TABLE IF NOT EXISTS ${process.env.PG_SCHEMA}.confidants (
                        id SERIAL,
                        arcana VARCHAR(64)[],
                        name VARCHAR(128)[],
                        lvl INTEGER[],
                        exp INTEGER[],
                        user_id INTEGER,
                        PRIMARY KEY(id),
                        FOREIGN KEY(user_id) REFERENCES ${process.env.PG_SCHEMA}.users(id) ON DELETE CASCADE
                    );
                    CREATE TABLE IF NOT EXISTS ${process.env.PG_SCHEMA}.personas (
                        id SERIAL,
                        name VARCHAR(128),
                        arcana VARCHAR(64),
                        suit VARCHAR(64),
                        lvl INTEGER,
                        exp INTEGER,
                        str INTEGER,
                        mag INTEGER,
                        "end" INTEGER,
                        agi INTEGER,
                        luc INTEGER,
                        affinities VARCHAR(16)[],
                        attacks VARCHAR(128)[],
                        attack_types VARCHAR(64)[],
                        attack_damages VARCHAR(32)[],
                        skills VARCHAR(128)[],
                        skill_costs VARCHAR(16)[],
                        skill_effects TEXT[],
                        user_id INTEGER,
                        PRIMARY KEY(id),
                        FOREIGN KEY(user_id) REFERENCES ${process.env.PG_SCHEMA}.users(id) ON DELETE CASCADE
                    );
                    CREATE TABLE IF NOT EXISTS ${process.env.PG_SCHEMA}.inventory (
                        id SERIAL,
                        items VARCHAR(256)[],
                        notes TEXT,
                        user_id INTEGER,
                        PRIMARY KEY(id),
                        FOREIGN KEY(user_id) REFERENCES ${process.env.PG_SCHEMA}.users(id) ON DELETE CASCADE
                    );
                    CREATE TABLE IF NOT EXISTS ${process.env.PG_SCHEMA}.characters (
                        id SERIAL,
                        name VARCHAR(128),
                        ath INTEGER,
                        pro INTEGER,
                        gut INTEGER,
                        kno INTEGER,
                        cha INTEGER,
                        ath_exp INTEGER,
                        pro_exp INTEGER,
                        gut_exp INTEGER,
                        kno_exp INTEGER,
                        cha_exp INTEGER,
                        curr_hp INTEGER,
                        total_hp INTEGER,
                        curr_sp INTEGER,
                        total_sp INTEGER,
                        curr_luc INTEGER,
                        will INTEGER,
                        wild INTEGER,
                        weapon VARCHAR(128),
                        weapon_stat VARCHAR(64),
                        weapon_effect VARCHAR(256),
                        armor VARCHAR(128),
                        armor_stat VARCHAR(64),
                        armor_effect VARCHAR(256),
                        accessory VARCHAR(128),
                        accessory_effect VARCHAR(256),
                        track1 INTEGER,
                        track2 INTEGER,
                        track3 INTEGER,
                        track4 INTEGER,
                        track5 INTEGER,
                        exp_trigger1 VARCHAR(256),
                        exp_trigger2 VARCHAR(256),
                        exp_trigger3 VARCHAR(256),
                        money INTEGER,
                        user_id INTEGER,
                        PRIMARY KEY(id),
                        FOREIGN KEY(user_id) REFERENCES ${process.env.PG_SCHEMA}.users(id) ON DELETE CASCADE
                    );
                `;
                await DB.client.query(query2);
            } catch (err) {
                console.error(err);
                console.error("Exit application...");
                process.exit(-1);
            }
        }
        return DB.client;
    }
}
