import sqlite from 'sqlite3';

const db = new sqlite.Database('./last-race.sqlite', err => {
  if (err) throw err;
});

//EVENTS
export const getEvents = () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT id, description, effect FROM event', [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};