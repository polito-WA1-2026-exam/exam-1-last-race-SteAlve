// Sends login credentials to the server and returns the user object
async function doLogin(username, password) {
    const response = await fetch('http://localhost:3001/api/sessions', {
        method: 'POST',
        body: JSON.stringify({
            username: username,
            password: password
        }),
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })

    if (response.ok) {
        const user = await response.json()
        return user
    } else {
        throw new Error("Login failed")
    }
}

// Destroys the current session on the server
async function doLogout() {
    const response = await fetch('http://localhost:3001/api/sessions/current', {
        method: 'DELETE',
        credentials: 'include'
    })

    if (response.ok) {
        return true
    } else {
        throw new Error("Logout failed")
    }
}

// Checks if a session is active and returns the current user, or null
async function checkSession() {
    const response = await fetch('http://localhost:3001/api/sessions/current', {
        credentials: "include"
    })
    if (response.ok) {
        return await response.json()
    } else {
        return null
    }
}

export { doLogin, doLogout, checkSession }