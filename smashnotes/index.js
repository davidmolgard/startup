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
//postPlayer
apiRouter.post('/player', (req, res) => {
    if (currentPlayers.find())
    addPlayer(req.body);
})



class Player {
    username;
    password;
    main;
    private;
    notes;
}