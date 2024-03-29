async function login() {
    const currentPlayer = new Player();
    const nameEl = document.querySelector("#username");
    const passwordEl = document.querySelector("#password");
    currentPlayer.username = nameEl.value;
    currentPlayer.password = passwordEl.value;

    try {
        const href = await loginPlayer(currentPlayer);
        window.location.href = href;
    } catch (error) {
        // Handle error, for example, display an error message
        document.getElementById("login-message").textContent = "Error: " + error.message;
    }
}

async function create() {
    const currentPlayer = new Player();
    const nameEl = document.querySelector("#username");
    const passwordEl = document.querySelector("#password");
    currentPlayer.main = "mario";
    currentPlayer.username = nameEl.value;
    currentPlayer.password = passwordEl.value;
    currentPlayer.private = "false";

    try {
        const href = await addPlayer(currentPlayer);
        window.location.href = href;
    } catch (error) {
        // Handle error, for example, display an error message
        document.getElementById("login-message").textContent = "Error: " + error.message;
    }
}

async function addPlayer(player) {
    try {
        const response = await fetch('/api/player/create', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(player),
        });

        if (response.ok) {
            const { authToken } = await response.json();
            localStorage.setItem('authToken', authToken);
            return "matchups.html";
        }
        else {
            const responseData = await response.json();
            throw new Error(responseData.msg);
        }
    } catch (error) {
        // If there was an error then throw it
        throw error;
    }
}

async function loginPlayer(player) {
    try {
        const response = await fetch('/api/player/login', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(player),
        });

        if (response.ok) {
            const { authToken } = await response.json();
            localStorage.setItem('authToken', authToken);
            return "matchups.html";
        }
        else {
            const responseData = await response.json();
            throw new Error(responseData.msg);
        }
    } catch (error) {
        // If there was an error then throw it
        throw error;
    }
}

class Player {
    username;
    password;
    main;
    private;
    notes;
}