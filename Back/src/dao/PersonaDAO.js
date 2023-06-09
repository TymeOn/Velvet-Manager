import dotenv from 'dotenv';
import { DB } from '../config/DB.js';
import { Persona } from '../models/Persona.js';
import { UserDAO } from './UserDAO.js'
dotenv.config();

export class PersonaDAO {

    // get a persona from its user
    async getFromUser(userId) {
        const client = await DB.open();
        const query = {
            text: `SELECT * FROM ${process.env.PG_SCHEMA}.personas WHERE user_id=$1`,
            values: [userId],
        };
        const result = await client.query(query);
        let data;
        if(result && result.rows && result.rows[0]) {
            const userDAO = new UserDAO();
            const u = await userDAO.get(result.rows[0].user_id);
            data = new Persona(
                result.rows[0].id,
                result.rows[0].name,
                result.rows[0].arcana,
                result.rows[0].suit,
                result.rows[0].lvl,
                result.rows[0].exp,
                result.rows[0].str,
                result.rows[0].mag,
                result.rows[0].end,
                result.rows[0].agi,
                result.rows[0].luc,
                result.rows[0].affinities,
                result.rows[0].attacks,
                result.rows[0].attack_types,
                result.rows[0].attack_damages,
                result.rows[0].skills,
                result.rows[0].skill_costs,
                result.rows[0].skill_effects,
                u
            );
        } else {
            data = null;
        }
        return data;
    }

    // add a persona
    async add(name, arcana, suit, lvl, exp, str, mag, end, agi, luc, affinities, attacks, attackTypes, attackDamages, skills, skillCosts, skillEffects, user) {
        const client = await DB.open();
        const query = {
            text: `INSERT INTO ${process.env.PG_SCHEMA}.personas(name, arcana, suit, lvl, exp, str, mag, "end", agi, luc, 
                    affinities, attacks, attack_types, attack_damages, skills, skill_costs, skill_effects, user_id) 
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) RETURNING *`,
            values: [
                name,
                arcana,
                suit,
                lvl,
                exp,
                str,
                mag,
                end,
                agi,
                luc,
                affinities,
                attacks,
                attackTypes,
                attackDamages,
                skills,
                skillCosts,
                skillEffects,
                user.getId()
            ],
        };
        const result = await client.query(query);
        let data;
        if(result && result.rows && result.rows[0]) {
            const userDAO = new UserDAO();
            const u = await userDAO.get(result.rows[0].user_id);
            data = new Persona(
                result.rows[0].id,
                result.rows[0].name,
                result.rows[0].arcana,
                result.rows[0].suit,
                result.rows[0].lvl,
                result.rows[0].exp,
                result.rows[0].str,
                result.rows[0].mag,
                result.rows[0].end,
                result.rows[0].agi,
                result.rows[0].luc,
                result.rows[0].affinities,
                result.rows[0].attacks,
                result.rows[0].attack_types,
                result.rows[0].attack_damages,
                result.rows[0].skills,
                result.rows[0].skill_costs,
                result.rows[0].skill_effects,
                u
            );
        } else {
           data = null;
        }
        return data;
    }

    // update a persona
    async update(persona) {
        let data = null;
        if (await this.getFromUser(persona.getUser().getId())) {
            const client = await DB.open();
            const query = {
                text: `UPDATE ${process.env.PG_SCHEMA}.personas 
                        SET name=$2, arcana=$3, suit=$4, lvl=$5, exp=$6, str=$7, mag=$8, "end"=$9, agi=$10, luc=$11, 
                        affinities=$12, attacks=$13, attack_types=$14, attack_damages=$15, skills=$16, skill_costs=$17, skill_effects=$18
                        WHERE id=$1
                        RETURNING *`,
                values: [
                    persona.getId(),
                    persona.getName(),
                    persona.getArcana(),
                    persona.getSuit(),
                    persona.getLvl(),
                    persona.getExp(),
                    persona.getStr(),
                    persona.getMag(),
                    persona.getEnd(),
                    persona.getAgi(),
                    persona.getLuc(),
                    persona.getAffinities(),
                    persona.getAttacks(),
                    persona.getAttackTypes(),
                    persona.getAttackDamages(),
                    persona.getSkills(),
                    persona.getSkillCosts(),
                    persona.getSkillEffects()
                ],
            }
            const result = await client.query(query);
            if(result && result.rows && result.rows[0]) {
                const userDAO = new UserDAO();
                const u = await userDAO.get(result.rows[0].user_id);
                data = new Persona(
                    result.rows[0].id,
                    result.rows[0].name,
                    result.rows[0].arcana,
                    result.rows[0].suit,
                    result.rows[0].lvl,
                    result.rows[0].exp,
                    result.rows[0].str,
                    result.rows[0].mag,
                    result.rows[0].end,
                    result.rows[0].agi,
                    result.rows[0].luc,
                    result.rows[0].affinities,
                    result.rows[0].attacks,
                    result.rows[0].attack_types,
                    result.rows[0].attack_damages,
                    result.rows[0].skills,
                    result.rows[0].skill_costs,
                    result.rows[0].skill_effects,
                    u
                );
            }
        }
        return data;
    }

}
