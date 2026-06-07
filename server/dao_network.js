import sqlite from 'sqlite3';

const db = new sqlite.Database('./last-race.sqlite', err => {
    if (err) throw err;
});

// NETWORK
export const getSegments = () => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT s1.id AS fromId, s1.name AS fromName,
                   s2.id AS toId, s2.name AS toName
            FROM line_station ls1, line_station ls2, station s1, station s2
            WHERE ls1.line_id = ls2.line_id
              AND ls1.position+1 = ls2.position
              AND ls1.station_id = s1.id
              AND ls2.station_id = s2.id
        `;
        db.all(sql, [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};