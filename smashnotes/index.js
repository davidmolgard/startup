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