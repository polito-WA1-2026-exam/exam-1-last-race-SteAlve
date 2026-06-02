import sqlite from 'sqlite3';
import crypto from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(crypto.scrypt);

const db = new sqlite.Database('./last-race.sqlite', err => {
    if (err) throw err;
});

const run = (sql, params = []) =>
    new Promise((resolve, reject) =>
        db.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve(this);
        })
    );

async function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = await scryptAsync(password, salt, 16);
    return { hash: hash.toString('hex'), salt };
}

async function initDb() {

    // drop
    await run(`DROP TABLE IF EXISTS game`);
    await run(`DROP TABLE IF EXISTS line_station`);
    await run(`DROP TABLE IF EXISTS event`);
    await run(`DROP TABLE IF EXISTS user`);
    await run(`DROP TABLE IF EXISTS station`);
    await run(`DROP TABLE IF EXISTS line`);

    // create
    await run(`CREATE TABLE station (
        id   INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
    )`);

    await run(`CREATE TABLE line (
        id   INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
    )`);

    await run(`CREATE TABLE line_station (
        line_id    INTEGER NOT NULL REFERENCES line(id),
        station_id INTEGER NOT NULL REFERENCES station(id),
        position   INTEGER NOT NULL,
        PRIMARY KEY (line_id, station_id)
    )`);

    await run(`CREATE TABLE event (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        description TEXT NOT NULL,
        effect      INTEGER NOT NULL CHECK(effect BETWEEN -4 AND 4)
    )`);

    await run(`CREATE TABLE user (
        id              INTEGER PRIMARY KEY AUTOINCREMENT,
        email           TEXT NOT NULL UNIQUE,
        name            TEXT NOT NULL,
        hashed_password TEXT NOT NULL,
        salt            TEXT NOT NULL
    )`);

    await run(`CREATE TABLE game (
        id               INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id          INTEGER NOT NULL REFERENCES user(id),
        start_station_id INTEGER NOT NULL REFERENCES station(id),
        end_station_id   INTEGER NOT NULL REFERENCES station(id),
        score            INTEGER
    )`);

    const stations = [
        "Centrale",            // 1  - Red + Blue interchange
        "Porta Velaria",       // 2  - Red + Green interchange
        "Crocevia del Falco",  // 3  - Red only
        "Piazza delle Lanterne", // 4 - Red + Yellow interchange
        "Fontana Oscura",      // 5  - Blue + Green interchange
        "Borgo Sereno",        // 6  - Blue only
        "Viale dei Mosaici",   // 7  - Blue + Yellow interchange
        "Torre Cinerea",       // 8  - Green + Yellow interchange
        "Campo dell'Eco",      // 9  - Green + Yellow interchange
        "Faro del Nord",       // 10 - Red extension
        "Porto Vecchio",       // 11 - Blue extension
        "Bosco dei Cervi",     // 12 - Green extension
    ];
    for (const name of stations)
        await run(`INSERT INTO station(name) VALUES (?)`, [name]);

    // lines
    const lines = ["Red Line", "Blue Line", "Green Line", "Yellow Line"];
    for (const name of lines)
        await run(`INSERT INTO line(name) VALUES (?)`, [name]);

    // line_station [line_id, station_id, position]
    const lineStations = [
        // Red Line: Centrale - Porta Velaria - Crocevia del Falco - Piazza delle Lanterne - Faro del Nord
        [1, 1, 0], [1, 2, 1], [1, 3, 2], [1, 4, 3], [1, 10, 4],
        // Blue Line: Centrale - Fontana Oscura - Borgo Sereno - Viale dei Mosaici - Porto Vecchio
        [2, 1, 0], [2, 5, 1], [2, 6, 2], [2, 7, 3], [2, 11, 4],
        // Green Line: Porta Velaria - Fontana Oscura - Torre Cinerea - Campo dell'Eco - Bosco dei Cervi
        [3, 2, 0], [3, 5, 1], [3, 8, 2], [3, 9, 3], [3, 12, 4],
        // Yellow Line: Piazza delle Lanterne - Torre Cinerea - Viale dei Mosaici - Campo dell'Eco
        [4, 4, 0], [4, 8, 1], [4, 7, 2], [4, 9, 3],
    ];
    for (const [lineId, stationId, position] of lineStations)
        await run(`INSERT INTO line_station(line_id, station_id, position) VALUES (?,?,?)`,
            [lineId, stationId, position]);

    // events
    const events = [
        ["Quiet journey, nothing to report", 0],
        ["The AC is finally working, you feel refreshed", 2],
        ["You find a coin forgotten on the seat", 1],
        ["A kind stranger shares their snacks with you", 3],
        ["Train arrives just as you step on the platform", 4],
        ["You sit on someone's forgotten sandwich", -1],
        ["Train doors close on your backpack", -2],
        ["A tourist mistakes you for a tour guide", -2],
        ["Someone's pizza slice drips on your shoe", -3],
        ["Train breaks down, you wait in the dark", -4],
    ];
    for (const [description, effect] of events)
        await run(`INSERT INTO event(description, effect) VALUES (?,?)`, [description, effect]);

    // users
    const users = [
        ["mario.rossi@lastrace.it", "Mario Rossi", "password"],
        ["giulia.bianchi@lastrace.it", "Giulia Bianchi", "password"],
        ["luca.verde@lastrace.it", "Luca Verde", "password"],
    ];
    for (const [email, name, password] of users) {
        const { hash, salt } = await hashPassword(password);
        await run(`INSERT INTO user(email, name, hashed_password, salt) VALUES (?,?,?,?)`,
            [email, name, hash, salt]);
    }

    // games (Mario e Giulia have already played)
    const games = [
        [1, 10, 12, 22],
        [1, 11, 3, 8],
        [2, 1, 12, 18],
        [2, 10, 11, 5],
    ];
    for (const [userId, startId, endId, score] of games)
        await run(`INSERT INTO game(user_id, start_station_id, end_station_id, score) VALUES (?,?,?,?)`,
            [userId, startId, endId, score]);

    console.log('Database initialized successfully.');
    db.close();
}

initDb().catch(err => { console.error(err); db.close(); });