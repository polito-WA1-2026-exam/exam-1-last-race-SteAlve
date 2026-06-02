import sqlite from 'sqlite3';

const db = new sqlite.Database('./last-race.sqlite', err => {
  if (err) throw err;
});

//GAMES
export const createGame = (userId, startStationId, endStationId) => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO game(user_id, start_station_id, end_station_id) VALUES (?, ?, ?)`;
        db.run(sql, [userId, startStationId, endStationId], function (err) {
            if (err) reject(err);
            else resolve(this.lastID);
        });
    });
};

export const getGame = (gameId) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM game WHERE id = ?', [gameId], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

export const saveGameScore = (gameId, score) => {
    return new Promise((resolve, reject) => {
        db.run('UPDATE game SET score = ? WHERE id = ?', [score, gameId], function (err) {
            if (err) reject(err);
            else resolve(this.changes);
        });
    });
};

// LEADERBOARD
export const getLeaderboard = () => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT u.name, MAX(g.score) AS bestScore
            FROM game g, user u
            WHERE g.user_id = u.id
              AND g.score IS NOT NULL
            GROUP BY u.id
            ORDER BY bestScore DESC
        `;
        db.all(sql, [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};