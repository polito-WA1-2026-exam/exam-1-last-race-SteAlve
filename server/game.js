//GRAPH
export function buildGraph(segments) {
    const graph = new Map();
    for (const seg of segments) {
        if (!graph.has(seg.fromId)) graph.set(seg.fromId, new Set());
        if (!graph.has(seg.toId)) graph.set(seg.toId, new Set());
        graph.get(seg.fromId).add(seg.toId);
        graph.get(seg.toId).add(seg.fromId);
    }
    return graph;
}

// BFS
function bfs(graph, startId) {
    const dist = new Map([[startId, 0]]);
    const queue = [startId];
    while (queue.length > 0) {
        const curr = queue.shift();
        for (const neighbor of graph.get(curr)) {
            if (!dist.has(neighbor)) {
                dist.set(neighbor, dist.get(curr) + 1);
                queue.push(neighbor);
            }
        }
    }
    return dist;
}

// PICK START/END
export function pickStartEnd(graph) {
    const ids = [...graph.keys()];
    const shuffled = [...ids].sort(() => Math.random() - 0.5);
    for (const startId of shuffled) {
        const dist = bfs(graph, startId);
        const candidates = ids.filter(id => dist.get(id) >= 3);
        if (candidates.length > 0) {
            const endId = candidates[Math.floor(Math.random() * candidates.length)];
            return { startId, endId };
        }
    }
    throw new Error('No valid start/end pair found');
}

// VALIDATE ROUTE
// route is an array of [fromId, toId] pairs
export function validateRoute(graph, route, startId, endId) {
    if (!Array.isArray(route) || route.length < 1) return false;

    const [a0, b0] = route[0];
    if (a0 !== startId && b0 !== startId) return false;
    if (!graph.get(a0)?.has(b0)) return false;

    const path = [startId, a0 === startId ? b0 : a0];

    for (let i = 1; i < route.length; i++) {
        const [c, d] = route[i];
        if (!graph.get(c)?.has(d)) return false;
        const last = path[path.length - 1];
        if      (last === c) path.push(d);
        else if (last === d) path.push(c);
        else return false;
    }

    return path[path.length - 1] === endId;
}

// EXECUTE ROUTE
// route is an array of [fromId, toId] pairs
export function executeRoute(stationMap, events, route) {
    let coins = 20;
    const steps = [];
    for (const [fromId, toId] of route) {
        const event = events[Math.floor(Math.random() * events.length)];
        coins += event.effect;
        steps.push({
            from: stationMap.get(fromId),
            to: stationMap.get(toId),
            event: event.description,
            effect: event.effect,
            coinsAfter: coins,
        });
    }
    return { steps, finalScore: Math.max(0, coins) };
}

// STATION MAP
export function buildStationMap(segments) {
    const map = new Map();
    for (const seg of segments) {
        map.set(seg.fromId, seg.fromName);
        map.set(seg.toId, seg.toName);
    }
    return map;
}