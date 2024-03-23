const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const app = express();
const DB = require('./database.js');
const config = require('./config.json');

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
apiRouter.post('/player/create', async (req, res) => {
    const newPlayer = req.body; 

    if (await DB.getUser(newPlayer.username)) {
        res.status(409).send({ msg: 'Existing user' });
    } else {
        const user = await DB.createUser(newPlayer.username, newPlayer.password);
        const authToken = user.token;
        // Set the cookie
        setAuthCookie(res, authToken);
    
        res.status(201).json({ authToken });
    }
});

apiRouter.post('/player/login', async (req, res) => {
    const newPlayer = req.body;
    const user = await DB.getUser(newPlayer.username);
    if (user) {
        if (await bcrypt.compare(newPlayer.password, user.password)) {
            const authToken = user.token;
            setAuthCookie(res, authToken);
            return res.status(200).json({ authToken });
        }
    }
    res.status(401).send({ msg: 'Unauthorized' });
});

apiRouter.get('/player', async (req, res) => {
    const authHeader = req.headers['authorization'];
    const authToken = authHeader.split(' ')[1]; // Extract the token from the Authorization header
    const user = await DB.getUserByToken(authToken);
    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const username = user.username;
    res.status(200).json({ username });
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
        existingPlayer.notes = existingPlayer.notes || [];
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

apiRouter.get('/main', (req, res) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const authToken = authHeader.split(' ')[1]; // Extract the token from the Authorization header
    const username = authTokens.get(authToken);
    if (username) {
        const existingPlayer = currentPlayers.find(player => player.username === username);
        res.status(200).json(existingPlayer.main);
    }
    else {
        res.status(404).json({ error: 'User not found' });
    }
})

apiRouter.post('/main', (req, res) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const authToken = authHeader.split(' ')[1]; // Extract the token from the Authorization header
    const username = authTokens.get(authToken);
    if (username) {
        const existingPlayer = currentPlayers.find(player => player.username === username);
        existingPlayer.main = req.body.main;
        res.status(200).json(existingPlayer.main);
    }
    else {
        res.status(404).json({ error: 'User not found' });
    }
})

apiRouter.get('/privacy', (req, res) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const authToken = authHeader.split(' ')[1]; // Extract the token from the Authorization header
    const username = authTokens.get(authToken);
    if (username) {
        const existingPlayer = currentPlayers.find(player => player.username === username);
        res.status(200).json(existingPlayer.privacy);
    }
    else {
        res.status(404).json({ error: 'User not found' });
    }
})

apiRouter.post('/privacy', (req, res) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const authToken = authHeader.split(' ')[1]; // Extract the token from the Authorization header
    const username = authTokens.get(authToken);
    if (username) {
        const existingPlayer = currentPlayers.find(player => player.username === username);
        if (existingPlayer.privacy === "false") {
            existingPlayer.privacy = "true";
        }
        else {
            existingPlayer.privacy = "false";
        }
        res.status(200).json(existingPlayer.privacy);
    }
    else {
        res.status(404).json({ error: 'User not found' });
    }
})

apiRouter.get("/players", (req, res) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const authToken = authHeader.split(' ')[1]; // Extract the token from the Authorization header
    const username = authTokens.get(authToken);
    if (username) {
        res.status(200).json(currentPlayers);
    }
    else {
        res.status(404).json({ error: 'User not found' });
    }
})

apiRouter.get("/startgg", (req, res) => {
    res.status(200).json({"authToken" : `${config.authToken}`});
})

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
