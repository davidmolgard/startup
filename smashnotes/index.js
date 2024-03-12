const express = require('express');
const app = express();

// The service port. In production the front-end code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// JSON body parsing using built-in middleware
app.use(express.json());


app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

// Return the application's default page if the path is unknown
app.use((_req, res) => {
    res.sendFile('index.html', { root: 'public' });
  });

// Router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);


let currentPlayers = [];
let authTokens = new Map();

// Endpoint to add a new player
apiRouter.post('/player', (req, res) => {
  const newPlayer = req.body;

  // Check if the username already exists
  const existingPlayer = currentPlayers.find(player => player.username === newPlayer.username);

  if (existingPlayer) {
    if (existingPlayer.password != player.password) {
        return res.status(401).json({ error: 'Incorrect password' });
    }
  }

  // Add the new player to the array
  currentPlayers.push(newPlayer);

  // Generate a random authToken
  const authToken = generateRandomAuthToken();

  // Store authToken with player's username
  authTokens.set(newPlayer.username, authToken);

  // Return the authToken
  res.status(201).json({ authToken });
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