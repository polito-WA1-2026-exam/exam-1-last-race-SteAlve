// Retrieves all network segments
async function getSegments() {
    try {
        const response = await fetch('http://localhost:3001/api/segments', {
            credentials: 'include'
        });
        if (response.ok) {
            return await response.json();
        } else {
            throw new Error('HTTP error in getSegments, code=' + response.status);
        }
    } catch (ex) {
        throw new Error('Network error in getSegments', { cause: ex });
    }
}

// Creates a new game and returns the assigned start and end stations
async function startGame() {
    try {
        const response = await fetch('http://localhost:3001/api/games', {
            method: 'POST',
            credentials: 'include'
        });
        if (response.ok) {
            return await response.json();
        } else {
            throw new Error('HTTP error in startGame, code=' + response.status);
        }
    } catch (ex) {
        throw new Error('Network error in startGame', { cause: ex });
    }
}

// Submits the player's route and returns the validation result and execution steps
async function submitRoute(gameId, route) {
    try {
        const response = await fetch(`http://localhost:3001/api/games/${gameId}/route`, {
            method: 'POST',
            body: JSON.stringify({ route: route }),
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        if (response.ok) {
            return await response.json();
        } else {
            throw new Error('HTTP error in submitRoute, code=' + response.status);
        }
    } catch (ex) {
        throw new Error('Network error in submitRoute', { cause: ex });
    }
}

// Retrieves the leaderboard with the best score per user
async function getLeaderboard() {
    try {
        const response = await fetch('http://localhost:3001/api/leaderboard', {
            credentials: 'include'
        });
        if (response.ok) {
            return await response.json();
        } else {
            throw new Error('HTTP error in getLeaderboard, code=' + response.status);
        }
    } catch (ex) {
        throw new Error('Network error in getLeaderboard', { cause: ex });
    }
}

export { getSegments, startGame, submitRoute, getLeaderboard };