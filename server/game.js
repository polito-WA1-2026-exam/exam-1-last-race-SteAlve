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

