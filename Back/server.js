import express from 'express';
import http from 'http'
import dotenv from 'dotenv';
import crypto from 'crypto';
import cors from 'cors';
import fs from 'fs';
import https from 'https';
import {DB} from './src/config/DB.js';
import {Server} from 'socket.io';
import {UserDAO} from './src/dao/UserDAO.js';
import {MarkerDAO} from './src/dao/MarkerDAO.js';
import {EventDAO} from './src/dao/EventDAO.js';
import {DayDAO} from './src/dao/DayDAO.js';
import {WeatherDAO} from './src/dao/WeatherDAO.js';
import {RollDAO} from './src/dao/RollDAO.js';
import {ConfidantDAO} from './src/dao/ConfidantDAO.js';
import {PersonaDAO} from './src/dao/PersonaDAO.js';
import {InventoryDAO} from './src/dao/InventoryDAO.js';
import {CharacterDAO} from './src/dao/CharacterDAO.js';
import {Marker} from './src/models/Marker.js';
import {Event} from './src/models/Event.js';
import {Day} from './src/models/Day.js';
import {Weather} from './src/models/Weather.js';
import {Roll} from './src/models/Roll.js';
import {User} from './src/models/User.js';
import {Confidant} from './src/models/Confidant.js';
import {Persona} from './src/models/Persona.js';
import {Inventory} from './src/models/Inventory.js';
import {Character} from './src/models/Character.js';



// SETUP
// -----

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
const userDAO = new UserDAO();
const markerDAO = new MarkerDAO();
const eventDAO = new EventDAO();
const dayDAO = new DayDAO();
const weatherDAO = new WeatherDAO();
const rollDAO = new RollDAO();
const confidantDAO = new ConfidantDAO();
const personaDAO = new PersonaDAO();
const inventoryDAO = new InventoryDAO();
const characterDAO = new CharacterDAO();
const RESSOURCE_NOT_FOUND = "The requested ressource is not available."

const options = {
    key: fs.readFileSync(process.env.KEY_FILE),
    cert: fs.readFileSync(process.env.CERT_FILE)
};


// USER OPERATIONS
// ---------------

app.post('/login', async (req, res) => {
    try {
        if (!req.body.username || !req.body.key) {
            return res.status(401).json({message: 'Erreur. Mauvais identifiant ou clé.'});
        }

        const keyResult = await userDAO.getKey(req.body.username);

        if (!keyResult) {
            return res.status(401).json({message: 'Erreur. Mauvais identifiant ou clé.'});
        }

        if (crypto.createHash('sha1').update(req.body.key).digest('hex') === keyResult.key) {
            return res.status(200).json({id: keyResult.id, admin: keyResult.admin});
        } else {
            return res.status(401).json({message: 'Erreur. Mauvais identifiant ou mot de passe.'});
        }
    } catch (err) {
        res.status(500).send({errName: err.name, errMessage: err.message});
    }
});

app.get('/users', async (req, res) => {
    try {
        return res.status(200).json(await userDAO.getAll());
    } catch (err) {
        res.status(500).send({errName: err.name, errMessage: err.message});
    }
});

app.post('/users', async (req, res) => {
    try {
        const body = req.body;
        res.status(201).send(await userDAO.add(
            body.username,
            crypto.createHash('sha1').update(req.body.key).digest('hex')
        ));
        io.emit('users-updated');
    } catch (err) {
        res.status(500).send({errName: err.name, errMessage: err.message});
    }
});

app.put('/users/:id', async (req, res) => {
    try {
        const body = req.body;
        const data = await userDAO.update(
            new User(
                body.id,
                body.username,
                crypto.createHash('sha1').update(req.body.key).digest('hex'),
                false
            ));
            io.emit('users-updated');
        data ? res.send(data) : res.status(404).send(RESSOURCE_NOT_FOUND);
    } catch (err) {
        res.status(500).send({errName: err.name, errMessage: err.message});
    }
});

app.delete('/users/:id', async (req, res) => {
    try {
        const data = await userDAO.remove(req.params.id);
        data ? res.send(data) : res.status(404).send(RESSOURCE_NOT_FOUND);
        io.emit('users-updated');
    } catch (err) {
        res.status(500).send({errName: err.name, errMessage: err.message});
    }
});



// MARKERS
// -------

app.get('/markers', async (req, res) => {
    try {
        const showAll = req.query.showAll ? req.query.showAll : false;
        res.send(await markerDAO.getAll(showAll));
    } catch (err) {
        res.status(500).send({errName: err.name, errMessage: err.message});
    }
});

app.get('/markers/:id', async (req, res) => {
    try {
        const data = await markerDAO.get(req.params.id);
        data ? res.send(data) : res.status(404).send(RESSOURCE_NOT_FOUND);
    } catch (err) {
        res.status(500).send({errName: err.name, errMessage: err.message});
    }
});

app.post('/markers', async (req, res) => {
    try {
        const body = req.body;
        res.status(201).send(await markerDAO.add(
            body.label,
            body.lat,
            body.lon,
            body.icon,
            body.bgColor,
            body.hidden
        ));
        io.emit('markers-updated');
    } catch (err) {
        res.status(500).send({errName: err.name, errMessage: err.message});
    }
});

app.put('/markers/:id', async (req, res) => {
    try {
        const body = req.body;
        const data = await markerDAO.update(
            new Marker(
                req.params.id,
                body.label,
                body.lat,
                body.lon,
                body.icon,
                body.bgColor,
                body.hidden
            ));
            io.emit('markers-updated');
        data ? res.send(data) : res.status(404).send(RESSOURCE_NOT_FOUND);
    } catch (err) {
        res.status(500).send({errName: err.name, errMessage: err.message});
    }
});

app.delete('/markers/:id', async (req, res) => {
    try {
        const data = await markerDAO.remove(req.params.id);
        data ? res.send(data) : res.status(404).send(RESSOURCE_NOT_FOUND);
        io.emit('markers-updated');
    } catch (err) {
        res.status(500).send({errName: err.name, errMessage: err.message});
    }
});



// EVENTS
// ------

app.get('/events', async (req, res) => {
    try {
        const showAll = req.query.showAll ? req.query.showAll : false;
        res.send(await eventDAO.getAll(false, showAll));
    } catch (err) {
        res.status(500).send({errName: err.name, errMessage: err.message});
    }
});

app.get('/events-ongoing', async (req, res) => {
    try {
        const showAll = req.query.showAll ? req.query.showAll : false;
        res.send(await eventDAO.getAll(true, showAll));
    } catch (err) {
        res.status(500).send({errName: err.name, errMessage: err.message});
    }
});

app.get('/events-current', async (req, res) => {
    try {
        const showAll = req.query.showAll ? req.query.showAll : false;
        res.send(await eventDAO.getCurrent(showAll));
    } catch (err) {
        res.status(500).send({errName: err.name, errMessage: err.message});
    }
});

app.get('/events/:id', async (req, res) => {
    try {
        const data = await eventDAO.get(req.params.id);
        data ? res.send(data) : res.status(404).send(RESSOURCE_NOT_FOUND);
    } catch (err) {
        res.status(500).send({errName: err.name, errMessage: err.message});
    }
});

app.post('/events', async (req, res) => {
    try {
        const body = req.body;
        res.status(201).send(await eventDAO.add(
            body.startDate,
            body.endDate,
            body.title,
            body.color,
            body.hidden
        ));
        io.emit('events-updated');
    } catch (err) {
        res.status(500).send({errName: err.name, errMessage: err.message});
    }
});

app.put('/events/:id', async (req, res) => {
    try {
        const body = req.body;
        const data = await eventDAO.update(
            new Event(
                req.params.id,
                body.startDate,
                body.endDate,
                body.title,
                body.color,
                body.hidden
            ));
        data ? res.send(data) : res.status(404).send(RESSOURCE_NOT_FOUND);
        io.emit('events-updated');
    } catch (err) {
        res.status(500).send({errName: err.name, errMessage: err.message});
    }
});

app.delete('/events/:id', async (req, res) => {
    try {
        const data = await eventDAO.remove(req.params.id);
        data ? res.send(data) : res.status(404).send(RESSOURCE_NOT_FOUND);
        io.emit('events-updated');
    } catch (err) {
        console.log(err);
        res.status(500).send({errName: err.name, errMessage: err.message});
    }
});



// DAY
// ---

app.get('/day', async (req, res) => {
    try {
        res.send(await dayDAO.get());
    } catch (err) {
        res.status(500).send({errName: err.name, errMessage: err.message});
    }
});

app.put('/day', async (req, res) => {
    try {
        const body = req.body;
        const data = await dayDAO.update(
            new Day(
                1,
                body.date,
                body.timeslot,
                body.mirror
            ));
        data ? res.send(data) : res.status(404).send(RESSOURCE_NOT_FOUND);
        io.emit('day-updated');
    } catch (err) {
        res.status(500).send({errName: err.name, errMessage: err.message});
    }
});

app.get('/day-move-forward', async (req, res) => {
    try {
        res.send(await dayDAO.moveForward());
        io.emit('day-updated');
    } catch (err) {
        res.status(500).send({errName: err.name, errMessage: err.message});
    }
});

app.get('/day-move-backward', async (req, res) => {
    try {
        res.send(await dayDAO.moveBackward());
        io.emit('day-updated');
    } catch (err) {
        res.status(500).send({errName: err.name, errMessage: err.message});
    }
});



// WEATHER
// -------

app.get('/weathers', async (req, res) => {
    try {
        res.send(await weatherDAO.getAll(false));
    } catch (err) {
        res.status(500).send({errName: err.name, errMessage: err.message});
    }
});

app.get('/weathers-ongoing', async (req, res) => {
    try {
        res.send(await weatherDAO.getAll(true));
    } catch (err) {
        res.status(500).send({errName: err.name, errMessage: err.message});
    }
});

app.get('/weathers-current', async (req, res) => {
    try {
        res.send(await weatherDAO.getCurrent());
    } catch (err) {
        res.status(500).send({errName: err.name, errMessage: err.message});
    }
});

app.get('/weathers/:date', async (req, res) => {
    try {
        const data = await weatherDAO.get(req.params.date);
        data ? res.send(data) : res.status(404).send(RESSOURCE_NOT_FOUND);
    } catch (err) {
        res.status(500).send({errName: err.name, errMessage: err.message});
    }
});

app.put('/weathers/:date', async (req, res) => {
    try {
        const body = req.body;
        const data = await weatherDAO.update(
            new Weather(
                req.params.date,
                body.code,
                body.temperature
            ));
        data ? res.send(data) : res.status(404).send(RESSOURCE_NOT_FOUND);
    } catch (err) {
        res.status(500).send({errName: err.name, errMessage: err.message});
    }
});



// ROLLS
// -----

app.get('/rolls', async (req, res) => {
    try {
        res.send(await rollDAO.getAll(false));
    } catch (err) {
        res.status(500).send({errName: err.name, errMessage: err.message});
    }
});

app.get('/rolls-latest', async (req, res) => {
    try {
        let rolls = await rollDAO.getAll(true);
        rolls = rolls.reverse();
        res.send(rolls);
    } catch (err) {
        res.status(500).send({errName: err.name, errMessage: err.message});
    }
});

app.post('/rolls', async (req, res) => {
    try {
        const body = req.body;
        res.status(201).send(await rollDAO.add(body.type, body.value, body.detail, body.timestamp, new User(body.user.id, '', '', false)));
        io.emit('rolls-updated');
    } catch (err) {
        res.status(500).send({errName: err.name, errMessage: err.message});
    }
});



// CONFIDANTS
// ----------

app.get('/confidants-from-user/:userId', async (req, res) => {
    try {
        const data = await confidantDAO.getFromUser(req.params.userId);
        data ? res.send(data) : res.status(404).send(RESSOURCE_NOT_FOUND);
    } catch (err) {
        res.status(500).send({errName: err.name, errMessage: err.message});
    }
});

app.put('/confidants/:id', async (req, res) => {
    try {
        const body = req.body;
        const data = await confidantDAO.update(
            new Confidant(
                req.params.id,
                body.arcana,
                body.name,
                body.lvl,
                body.exp,
                new User(body.user.id, null, null, null)
            ));
        data ? res.send(data) : res.status(404).send(RESSOURCE_NOT_FOUND);
        io.emit('confidants-updated', body.user.id);
    } catch (err) {
        res.status(500).send({errName: err.name, errMessage: err.message});
    }
});



// PERSONAS
// --------

app.get('/persona-from-user/:userId', async (req, res) => {
    try {
        const data = await personaDAO.getFromUser(req.params.userId);
        data ? res.send(data) : res.status(404).send(RESSOURCE_NOT_FOUND);
    } catch (err) {
        res.status(500).send({errName: err.name, errMessage: err.message});
    }
});

app.put('/persona/:id', async (req, res) => {
    try {
        const body = req.body;
        const data = await personaDAO.update(
            new Persona(
                req.params.id,
                body.name,
                body.arcana,
                body.suit,
                body.lvl,
                body.exp,
                body.str,
                body.mag,
                body.end,
                body.agi,
                body.luc,
                body.affinities,
                body.attacks,
                body.attackTypes,
                body.attackDamages,
                body.skills,
                body.skillCosts,
                body.skillEffects,
                new User(body.user.id, null, null, null)
            ));
        data ? res.send(data) : res.status(404).send(RESSOURCE_NOT_FOUND);
        io.emit('persona-updated', body.user.id);
    } catch (err) {
        res.status(500).send({errName: err.name, errMessage: err.message});
    }
});



// INVENTORY
// ---------

app.get('/inventory-from-user/:userId', async (req, res) => {
    try {
        const data = await inventoryDAO.getFromUser(req.params.userId);
        data ? res.send(data) : res.status(404).send(RESSOURCE_NOT_FOUND);
    } catch (err) {
        res.status(500).send({errName: err.name, errMessage: err.message});
    }
});

app.put('/inventory/:id', async (req, res) => {
    try {
        const body = req.body;
        const data = await inventoryDAO.update(
            new Inventory(
                req.params.id,
                body.items,
                body.notes,
                new User(body.user.id, null, null, null)
            ));
        data ? res.send(data) : res.status(404).send(RESSOURCE_NOT_FOUND);
        io.emit('inventory-updated', body.user.id);
    } catch (err) {
        res.status(500).send({errName: err.name, errMessage: err.message});
    }
});


// CHARACTERS
// --------

app.get('/character-from-user/:userId', async (req, res) => {
    try {
        const data = await characterDAO.getFromUser(req.params.userId);
        data ? res.send(data) : res.status(404).send(RESSOURCE_NOT_FOUND);
    } catch (err) {
        res.status(500).send({errName: err.name, errMessage: err.message});
    }
});

app.put('/character/:id', async (req, res) => {
    try {
        const body = req.body;
        const data = await characterDAO.update(
            new Character(
                req.params.id,
                body.name,
                body.ath,
                body.pro,
                body.gut,
                body.kno,
                body.cha,
                body.athExp,
                body.proExp,
                body.gutExp,
                body.knoExp,
                body.chaExp,
                body.currHp,
                body.totalHp,
                body.currSp,
                body.totalSp,
                body.currLuc,
                body.will,
                body.wild,
                body.weapon,
                body.weaponStat,
                body.weaponEffect,
                body.armor,
                body.armorStat,
                body.armorEffect,
                body.accessory,
                body.accessoryEffect,
                body.track1,
                body.track2,
                body.track3,
                body.track4, 
                body.track5,
                new User(body.user.id, null, null, null)
            ));
        data ? res.send(data) : res.status(404).send(RESSOURCE_NOT_FOUND);
        io.emit('character-updated', body.user.id);
    } catch (err) {
        res.status(500).send({errName: err.name, errMessage: err.message});
    }
});


// STARTUP
// -------

const server = https.createServer(options, app).listen(process.env.PORT, () => {
    console.log('Velvet-Manager-Back running on port ' + process.env.PORT);
    DB.open();
});

const io = new Server(server, { cors: { origin: '*' } });
