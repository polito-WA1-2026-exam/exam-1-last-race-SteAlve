// imports
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import { check, validationResult } from 'express-validator';

import { getUser } from './dao_user.js';
import { getEvents } from './dao_events.js'
import { createGame, getGame, saveGameScore, getLeaderboard } from './dao_game.js'
import { getSegments } from './dao_network.js';
import { buildGraph, buildStationMap, pickStartEnd, validateRoute, executeRoute } from './game.js';

// init express
const app = new express();
const port = 3001;

// middleware
app.use(express.json());
app.use(morgan('dev'));

const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
  credentials: true,
};
app.use(cors(corsOptions));

// passport
passport.use(new LocalStrategy(async function verify(username, password, cb) {
  const user = await getUser(username, password);

  if (!user)
    //null -> no error, invalid credetials, message
    return cb(null, false, "Incorrect username or password."); // error message in the WWW-Authenticated header of the response

  return cb(null, user);
}));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user, cb) {
  return cb(null, user);
});

app.use(session({
  secret: 'last-race-secret',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate('session'));

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  console.log(req.user)
  return res.status(401).json({ error: "Not authorized" });
}

// POST /api/sessions
app.post("/api/sessions", passport.authenticate("local"), function (req, res) {
  return res.status(201).json(req.user);
});

// GET /api/sessions/current
app.get("/api/sessions/current", (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  }
  else
    res.status(401).json({ error: "Not authenticated" });
});

// DELETE /api/session/current
app.delete("/api/sessions/current", (req, res) => {
  req.logout(() => {
    res.end();
  });
});

// GET /api/segments
app.get("/api/segments", isLoggedIn, async (req, res) => {
  try {
    const segments = await getSegments();
    res.json(segments);
  } catch {
    res.status(500).end();
  }
});

// POST /api/games
app.post("/api/games", isLoggedIn, async (req, res) => {
  try {
    const segments = await getSegments();
    const graph = buildGraph(segments);
    const stationMap = buildStationMap(segments);
    const { startId, endId } = pickStartEnd(graph);
    const gameId = await createGame(req.user.id, startId, endId);
    res.status(201).json({
      id: gameId,
      startStation: { id: startId, name: stationMap.get(startId) },
      endStation: { id: endId, name: stationMap.get(endId) },
    });
  } catch {
    res.status(500).json({ error: "Could not create game." });
  }
});

// POST /api/games/:id/route
app.post("/api/games/:id/route", isLoggedIn, check("route").isArray({ min: 1 }), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

  try {
    const game = await getGame(parseInt(req.params.id));
    if (!game) return res.status(404).json({ error: "Game not found." });
    if (game.user_id !== req.user.id) return res.status(403).json({ error: "Forbidden." });
    if (game.score !== null) return res.status(409).json({ error: "Game already completed." });

    const segments = await getSegments();
    const events = await getEvents();
    const graph = buildGraph(segments);
    const route = req.body.route;
    const valid = validateRoute(graph, route, game.start_station_id, game.end_station_id);

    if (!valid) {
      await saveGameScore(game.id, 0);
      return res.json({ valid: false, finalScore: 0 });
    }

    const { steps, finalScore } = executeRoute(segments, events, route);
    await saveGameScore(game.id, finalScore);
    res.json({ valid: true, steps, finalScore });
  } catch {
    res.status(500).json({ error: "Error processing route." });
  }
});

// GET /api/leaderboard
app.get("/api/leaderboard", isLoggedIn, async (req, res) => {
  try {
    const leaderboard = await getLeaderboard();
    res.json(leaderboard);
  } catch {
    res.status(500).end();
  }
});

// activate the server
app.listen(port, () => { console.log(`API server started at http://localhost:${port}`) });