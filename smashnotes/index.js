const express = require('express');
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
        res.status(201).json({ authToken });
    }
});

apiRouter.post('/player/login', async (req, res) => {
    const newPlayer = req.body;
    const user = await DB.getUser(newPlayer.username);
    if (user) {
        if (await bcrypt.compare(newPlayer.password, user.password)) {
            const authToken = user.token;
            return res.status(200).json({ authToken });
        }
        else {
            return res.status(400).send({ msg: 'Incorrect Password' });
        }
    }
    res.status(400).send({ msg: 'Username not found' });
});

apiRouter.get('/player', async (req, res) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const authToken = authHeader.split(' ')[1]; // Extract the token from the Authorization header
    const user = await DB.getUserByToken(authToken);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    const username = user.username;
    res.status(200).json({ username });
});

apiRouter.get('/notes', async (req, res) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const authToken = authHeader.split(' ')[1]; // Extract the token from the Authorization header
    const user = await DB.getUserByToken(authToken);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    const notes = user.notes;
    res.status(200).json(notes);
});

apiRouter.post('/notes', async (req, res) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const authToken = authHeader.split(' ')[1]; // Extract the token from the Authorization header
    const user = await DB.getUserByToken(authToken);
    if (user) {
        let notes = user.notes || [];
        // Check if the request body contains the expected structure
        if (req.body && req.body.character && req.body.note) {
            const character = req.body.character;
            const note = req.body.note;

            // Find the index of the existing note for the given character, if it exists
            const existingNoteIndex = notes.findIndex(entry => entry[0] === character);

            if (existingNoteIndex !== -1) {
                // Update the existing note
                notes[existingNoteIndex][1] = note;
            } else {
                // Create a new note if it doesn't exist
                notes.push([character, note]);
            }
            const result = await DB.updateNotes(authToken, notes);
            if (result.success) {
                res.status(200).json(notes);
            }
            else {
                res.status(404).json({ error: result.message });
            }
            
        } else {
            res.status(400).json({ error: 'Invalid request body' });
        }
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

apiRouter.get('/main', async (req, res) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const authToken = authHeader.split(' ')[1]; // Extract the token from the Authorization header
    const user = await DB.getUserByToken(authToken);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    const main = user.main;
    res.status(200).json(main);
})

apiRouter.post('/main', async (req, res) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const authToken = authHeader.split(' ')[1]; // Extract the token from the Authorization header
    const result = await DB.updateMainByToken(authToken, req.body.main);
    if (result.success) {
        return res.status(200).json(req.body.main);
    }
    else {
        res.status(404).json({ error: result.message });
    }
})

apiRouter.get('/privacy', async (req, res) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const authToken = authHeader.split(' ')[1]; // Extract the token from the Authorization header
    const user = await DB.getUserByToken(authToken);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    const privacy = user.privacy;
    res.status(200).json(privacy);
})

apiRouter.post('/privacy', async (req, res) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const authToken = authHeader.split(' ')[1]; // Extract the token from the Authorization header
    const user = await DB.getUserByToken(authToken);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    let privacy = "false";
    if (user.privacy === "false") {
        privacy = "true";
    }
    const result = await DB.updatePrivacy(authToken, privacy);
    if (result.success) {
        return res.status(200).json(privacy);
    }
    else {
        res.status(404).json({ error: result.message });
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
