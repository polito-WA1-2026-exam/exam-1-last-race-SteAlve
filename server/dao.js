import sqlite from 'sqlite3';
import crypto from 'crypto';

const db = new sqlite.Database('./last-race.sqlite', err => {
  if (err) throw err;
});

// USERS
export const getUser = (email, password) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM user WHERE email = ?";
    db.get(sql, [email], (err, row) => {
      if (err) {
        reject(err);
      }
      else if (row === undefined) {
        resolve(false);
      }
      else {
        const user = { id: row.id, username: row.email, name: row.name };

        crypto.scrypt(password, row.salt, 16, function (err, hashedPassword) {
          if (err) reject(err);
          if (!crypto.timingSafeEqual(Buffer.from(row.hashed_password, "hex"), hashedPassword))
            resolve(false);
          else
            resolve(user);
        });
      }
    });
  });
};

//NETWORK
export const getNetwork = () => {
    return new Promise((resolve, reject) => {
        const sql = `
          SELECT l.id AS lineId, l.name AS lineName,
          s.id AS stationId, s.name AS stationName
          FROM line_station ls, line l, station s
          WHERE ls.line_id = l.id
            AND ls.station_id = s.id
          ORDER BY l.id, ls.position
        `;
        db.all(sql, [], (err, rows) => {
            if (err) { reject(err); return; }

            const linesMap = new Map();
            for (const row of rows) {
                if (!linesMap.has(row.lineId))
                    //Map of lines, each line contains an array of stations (the index in the array is the position of the station)
                    linesMap.set(row.lineId, { id: row.lineId, name: row.lineName, stations: [] });
                linesMap.get(row.lineId).stations.push({ id: row.stationId, name: row.stationName });
            }
            //Return an array because we don't need a direct access to lines
            resolve({ lines: Array.from(linesMap.values()) });
        });
    });
};