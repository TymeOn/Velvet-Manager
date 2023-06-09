import dotenv from 'dotenv';
import { DB } from '../config/DB.js';
import { Character } from '../models/Character.js';
import { UserDAO } from './UserDAO.js'
dotenv.config();

export class CharacterDAO {

    // get a character from its user
    async getFromUser(userId) {
        const client = await DB.open();
        const query = {
            text: `SELECT * FROM ${process.env.PG_SCHEMA}.characters WHERE user_id=$1`,
            values: [userId],
        };
        const result = await client.query(query);
        let data;
        if(result && result.rows && result.rows[0]) {
            const userDAO = new UserDAO();
            const u = await userDAO.get(result.rows[0].user_id);
            data = new Character(
                result.rows[0].id,
                result.rows[0].name,
                result.rows[0].ath,
                result.rows[0].pro,
                result.rows[0].gut,
                result.rows[0].kno,
                result.rows[0].cha,
                result.rows[0].ath_exp,
                result.rows[0].pro_exp,
                result.rows[0].gut_exp,
                result.rows[0].kno_exp,
                result.rows[0].cha_exp,
                result.rows[0].curr_hp,
                result.rows[0].total_hp,
                result.rows[0].curr_sp,
                result.rows[0].total_sp,
                result.rows[0].curr_luc,
                result.rows[0].will,
                result.rows[0].wild,
                result.rows[0].weapon,
                result.rows[0].weapon_stat,
                result.rows[0].weapon_effect,
                result.rows[0].armor,
                result.rows[0].armor_stat,
                result.rows[0].armor_effect,
                result.rows[0].accessory,
                result.rows[0].accessory_effect,
                result.rows[0].track1,
                result.rows[0].track2,
                result.rows[0].track3,
                result.rows[0].track4,
                result.rows[0].track5,
                u
            );
        } else {
            data = null;
        }
        return data;
    }

    // add a character
    async add(name, ath, pro, gut, kno, cha, athExp, proExp, gutExp, knoExp, chaExp, currHp, totalHp, currSp, totalSp, currLuc, will, wild, weapon, weaponStat, weaponEffect, armor, armorStat, armorEffect, accessory, accessoryEffect, track1, track2, track3, track4, track5, user) {
        const client = await DB.open();
        const query = {
            text: `INSERT INTO ${process.env.PG_SCHEMA}.characters(name, ath, pro, gut, kno, cha, ath_exp, pro_exp, gut_exp, kno_exp, cha_exp,
                curr_hp, total_hp, curr_sp, total_sp, curr_luc, will, wild, weapon, weapon_stat, weapon_effect, armor, armor_stat, armor_effect,
                accessory, accessory_effect, track1, track2, track3, track4, track5, user_id) 
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, 
                        $24, $25, $26, $27, $28, $29, $30, $31, $32) RETURNING *`,
            values: [
                name,
                ath,
                pro,
                gut,
                kno,
                cha,
                athExp,
                proExp,
                gutExp,
                knoExp,
                chaExp,
                currHp,
                totalHp,
                currSp,
                totalSp,
                currLuc,
                will,
                wild,
                weapon,
                weaponStat,
                weaponEffect,
                armor,
                armorStat,
                armorEffect,
                accessory,
                accessoryEffect,
                track1,
                track2,
                track3,
                track4, 
                track5,
                user.getId()
            ],
        };
        const result = await client.query(query);
        let data;
        if(result && result.rows && result.rows[0]) {
            const userDAO = new UserDAO();
            const u = await userDAO.get(result.rows[0].user_id);
            data = new Character(
                result.rows[0].id,
                result.rows[0].name,
                result.rows[0].ath,
                result.rows[0].pro,
                result.rows[0].gut,
                result.rows[0].kno,
                result.rows[0].cha,
                result.rows[0].ath_exp,
                result.rows[0].pro_exp,
                result.rows[0].gut_exp,
                result.rows[0].kno_exp,
                result.rows[0].cha_exp,
                result.rows[0].curr_hp,
                result.rows[0].total_hp,
                result.rows[0].curr_sp,
                result.rows[0].total_sp,
                result.rows[0].curr_luc,
                result.rows[0].will,
                result.rows[0].wild,
                result.rows[0].weapon,
                result.rows[0].weapon_stat,
                result.rows[0].weapon_effect,
                result.rows[0].armor,
                result.rows[0].armor_stat,
                result.rows[0].armor_effect,
                result.rows[0].accessory,
                result.rows[0].accessory_effect,
                result.rows[0].track1,
                result.rows[0].track2,
                result.rows[0].track3,
                result.rows[0].track4,
                result.rows[0].track5,
                u
            );
        } else {
           data = null;
        }
        return data;
    }

    // update a character
    async update(character) {
        let data = null;
        if (await this.getFromUser(character.getUser().getId())) {
            const client = await DB.open();
            const query = {
                text: `UPDATE ${process.env.PG_SCHEMA}.characters
                        SET name=$2, ath=$3, pro=$4, gut=$5, kno=$6, cha=$7, ath_exp=$8, pro_exp=$9, gut_exp=$10, kno_exp=$11, cha_exp=$12,
                            curr_hp=$13, total_hp=$14, curr_sp=$15, total_sp=$16, curr_luc=$17, will=$18, wild=$19,
                            weapon=$20, weapon_stat=$21, weapon_effect=$22, armor=$23, armor_stat=$24, armor_effect=$25, 
                            accessory=$26, accessory_effect=$27, track1=$28, track2=$29, track3=$30, track4=$31, track5=$32
                        WHERE id=$1
                        RETURNING *`,
                values: [
                    character.getId(),
                    character.getName(),
                    character.getAth(),
                    character.getPro(),
                    character.getGut(),
                    character.getKno(),
                    character.getCha(),
                    character.getAthExp(),
                    character.getProExp(),
                    character.getGutExp(),
                    character.getKnoExp(),
                    character.getChaExp(),
                    character.getCurrHp(),
                    character.getTotalHp(),
                    character.getCurrSp(),
                    character.getTotalSp(),
                    character.getCurrLuc(),
                    character.getWill(),
                    character.getWild(),
                    character.getWeapon(),
                    character.getWeaponStat(),
                    character.getWeaponEffect(),
                    character.getArmor(),
                    character.getArmorStat(),
                    character.getArmorEffect(),
                    character.getAccessory(),
                    character.getAccessoryEffect(),
                    character.getTrack1(),
                    character.getTrack2(),
                    character.getTrack3(),
                    character.getTrack4(),
                    character.getTrack5()
                ],
            }
            const result = await client.query(query);
            if(result && result.rows && result.rows[0]) {
                const userDAO = new UserDAO();
                const u = await userDAO.get(result.rows[0].user_id);
                data = new Character(
                    result.rows[0].id,
                    result.rows[0].name,
                    result.rows[0].ath,
                    result.rows[0].pro,
                    result.rows[0].gut,
                    result.rows[0].kno,
                    result.rows[0].cha,
                    result.rows[0].ath_exp,
                    result.rows[0].pro_exp,
                    result.rows[0].gut_exp,
                    result.rows[0].kno_exp,
                    result.rows[0].cha_exp,
                    result.rows[0].curr_hp,
                    result.rows[0].total_hp,
                    result.rows[0].curr_sp,
                    result.rows[0].total_sp,
                    result.rows[0].curr_luc,
                    result.rows[0].will,
                    result.rows[0].wild,
                    result.rows[0].weapon,
                    result.rows[0].weapon_stat,
                    result.rows[0].weapon_effect,
                    result.rows[0].armor,
                    result.rows[0].armor_stat,
                    result.rows[0].armor_effect,
                    result.rows[0].accessory,
                    result.rows[0].accessory_effect,
                    result.rows[0].track1,
                    result.rows[0].track2,
                    result.rows[0].track3,
                    result.rows[0].track4,
                    result.rows[0].track5,
                    u
                );
            }
        }
        return data;
    }

}
