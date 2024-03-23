const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const config = require('./config.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('smashnotes');
const userCollection = db.collection('user');

// This will asynchronously test the connection and exit the process if it fails
(async function testConnection() {
  await client.connect();
  await db.command({ ping: 1 });
})().catch((ex) => {
  console.log(`Unable to connect to database with ${url} because ${ex.message}`);
  process.exit(1);
});

function getUser(username) {
    return userCollection.findOne({ username: username });
}

function getUserByToken(token) {
    return userCollection.findOne({ token: token });
}

async function updateMainByUsername(username, newMain) {
    const filter = { username: username };
    const update = { $set: { main: newMain } };

    const result = await userCollection.updateOne(filter, update);

    if (result.modifiedCount === 1) {
        return { success: true, message: `Main updated successfully for user ${username}` };
    } else {
        return { success: false, message: `User ${username} not found or main already set to ${newMain}` };
    }
}

async function createUser(username, password) {
    // Hash the password before we insert it into the database
    const passwordHash = await bcrypt.hash(password, 10);

    const user = {
        username: username,
        password: passwordHash,
        token: uuid.v4(),
        main: "mario",
        notes: [],
    };
    await userCollection.insertOne(user);

    return user;
}

module.exports = {
    getUser,
    getUserByToken,
    createUser,
};