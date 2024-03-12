const express = require('express');
const app = express();

// The service port. In production, the front-end code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// JSON body parsing using built-in middleware
app.use(express.json());

app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

// Router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

let currentPlayers = [];
let authTokens = new Map();

// Endpoint to add a new player
apiRouter.post('/player', (req, res) => {
    const newPlayer = req.body; // Express already parses JSON body, no need for JSON.parse

    // Check if the username already exists
    const existingPlayer = currentPlayers.find(player => player.username === newPlayer.username);

    if (existingPlayer) {
        if (existingPlayer.password != newPlayer.password) {
            return res.status(401).json({ error: 'Incorrect password' });
        }
    } else {
        // Add the new player to the array
        currentPlayers.push(newPlayer);
    }

    // Generate a random authToken
    const authToken = generateRandomAuthToken();

    // Store authToken with player's username
    authTokens.set(authToken, newPlayer.username);

    // Return the authToken
    res.status(201).json({ authToken });
});

apiRouter.get('/player', (req, res) => {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const authToken = authHeader.split(' ')[1]; // Extract the token from the Authorization header
    const username = authTokens.get(authToken);

    if (username) {
        res.status(200).json({ username });
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

apiRouter.get('/notes', (req, res) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const authToken = authHeader.split(' ')[1]; // Extract the token from the Authorization header
    const username = authTokens.get(authToken);
    if (username) {
        const existingPlayer = currentPlayers.find(player => player.username === username);
        res.status(200).json(existingPlayer.notes);
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

apiRouter.post('/notes', (req, res) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const authToken = authHeader.split(' ')[1]; // Extract the token from the Authorization header
    const username = authTokens.get(authToken);
    if (username) {
        const existingPlayer = currentPlayers.find(player => player.username === username);

        // Check if the request body contains the expected structure
        if (req.body && req.body.character && req.body.note) {
            const character = req.body.character;
            const note = req.body.note;

            // Find the index of the existing note for the given character, if it exists
            const existingNoteIndex = existingPlayer.notes.findIndex(entry => entry[0] === character);

            if (existingNoteIndex !== -1) {
                // Update the existing note
                existingPlayer.notes[existingNoteIndex][1] = note;
            } else {
                // Create a new note if it doesn't exist
                existingPlayer.notes.push([character, note]);
            }

            res.status(200).json(existingPlayer.notes);
        } else {
            res.status(400).json({ error: 'Invalid request body' });
        }
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

// Function to generate a random authToken
function generateRandomAuthToken() {
    const authToken = Math.random().toString(36).substr(2); // Generate a random string
    return authToken;
}

class Player {
    username;
    password;
    main;
    private;
    notes;

    constructor() {
        this.username = "";
        this.password = "";
        this.main = "mario";
        this.private = "false";
        this.notes = [];
    }
}

// Return the application's default page if the path is unknown
app.use((_req, res) => {
    res.sendFile('index.html', { root: 'public' });
});
