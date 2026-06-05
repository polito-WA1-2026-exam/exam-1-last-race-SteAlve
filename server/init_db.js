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
        "The Iron Keep",       // 1  - Red + Blue interchange
        "Eastgate Crossing",   // 2  - Red + Green interchange
        "Brigand's Alley",     // 3  - Red only
        "Gallows Square",      // 4  - Red + Yellow interchange
        "Witch's Well",        // 5  - Blue + Green interchange
        "Friar's Borough",     // 6  - Blue only
        "Usurer's Tower",      // 7  - Blue + Yellow interchange
        "The Fallen Bastion",  // 8  - Green + Yellow interchange
        "Martyrs' Field",      // 9  - Green + Yellow interchange
        "Northpyre Gate",      // 10 - Red only
        "The Black Raven Inn", // 11 - Blue only
        "Outcast Forest",      // 12 - Green only
    ];
    for (const name of stations)
        await run(`INSERT INTO station(name) VALUES (?)`, [name]);

    // lines
    const lines = ["Red Line", "Blue Line", "Green Line", "Yellow Line"];
    for (const name of lines)
        await run(`INSERT INTO line(name) VALUES (?)`, [name]);

    // line_station [line_id, station_id, position]
    const lineStations = [
        // Red Line:    The Iron Keep → Eastgate Crossing → Brigand's Alley → Gallows Square → Northpyre Gate
        [1, 1, 0], [1, 2, 1], [1, 3, 2], [1, 4, 3], [1, 10, 4],
        // Blue Line:   The Iron Keep → Witch's Well → Friar's Borough → Usurer's Tower → The Black Raven Inn
        [2, 1, 0], [2, 5, 1], [2, 6, 2], [2, 7, 3], [2, 11, 4],
        // Green Line:  Eastgate Crossing → Witch's Well → The Fallen Bastion → Martyrs' Field → Outcast Forest
        [3, 2, 0], [3, 5, 1], [3, 8, 2], [3, 9, 3], [3, 12, 4],
        // Yellow Line: Gallows Square → The Fallen Bastion → Usurer's Tower → Martyrs' Field
        [4, 4, 0], [4, 8, 1], [4, 7, 2], [4, 9, 3],
    ];
    for (const [lineId, stationId, position] of lineStations)
        await run(`INSERT INTO line_station(line_id, station_id, position) VALUES (?,?,?)`,
            [lineId, stationId, position]);

    // events
    const events = [
        ["The passage is clear, not a soul in sight", 0],
        ["A bard's cheerful tune quickens your step", 1],
        ["A friendly friar reveals a hidden shortcut", 2],
        ["A merchant's cart carries you past the next gate", 3],
        ["You stumble upon a forgotten treasure in the tunnel", 4],
        ["A surly guard demands a toll at the gate", -1],
        ["The tunnel floods ankle-deep after the rain", -2],
        ["A pickpocket relieves you of some coin at the crossing", -3],
        ["The torchbearer falls asleep, you wander in darkness", -4],
    ];
    for (const [description, effect] of events)
        await run(`INSERT INTO event(description, effect) VALUES (?,?)`, [description, effect]);

    // users
    const users = [
        ["aldric@lastrace.it", "Aldric of Ironkeep", "password1"],
        ["mira@lastrace.it", "Mira Blackthorn", "password2"],
        ["godfrey@lastrace.it", "Godfrey the Bold", "password3"],
        ["stefano@lastrace.it", "Stefano Alverino", "password4"],
    ];
    for (const [email, name, password] of users) {
        const { hash, salt } = await hashPassword(password);
        await run(`INSERT INTO user(email, name, hashed_password, salt) VALUES (?,?,?,?)`,
            [email, name, hash, salt]);
    }

    // games (Aldric and Mira have already played)
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