document.getElementById("username").textContent = getUsername();
document.getElementById("note-box").textContent = getNote(getNotesCharacter());
updateCharacterImage();

function updateCharacterImage() {
    var character = getNotesCharacter();
    //base URL and an image ID
    var baseURL = "https://ultimateframedata.com/characterart/";
    var imageID = "notesCharacter";
    // Construct the full image URL with a timestamp
    var imageURL = baseURL + character + ".webp";
    // Get the image element by ID and set the source
    var myMainImage = document.getElementById(imageID);
    if (myMainImage) {
        myMainImage.src = imageURL;
    }
}

function updateNote() {
    let note = document.getElementById("note-box").textContent;
    let username = getUsername(); // Get the current username
    let currentPlayers = JSON.parse(localStorage.getItem("currentPlayers"));
    // Find the player by username
    let player = currentPlayers.find(player => player.username === username);
    // Get the character for which the note is being updated
    let character = getNotesCharacter();
    // Check if the player and notes array exist
    if (player && player.notes) {
        // Check if there is an existing note for the character
        let existingNote = player.notes.find(entry => entry[0] === character);

        if (existingNote) {
            // Update the existing note
            existingNote[1] = note;
        } else {
            // Add a new note entry for the character
            player.notes.push([character, note]);
        }
        // Save the updated player data back to local storage
        localStorage.setItem("currentPlayers", JSON.stringify(currentPlayers));
        // Optionally, you can also update the displayed note on the page
        document.getElementById("note-box").textContent = note;
    }
    document.getElementById("saved").textContent = "Saved";
}

function getNotesCharacter() {
    return localStorage.getItem("notesCharacter");
}

function getUsername() {
    return localStorage.getItem("username");
}

function getNote(character) {
    let player = findPlayerByUsername(getUsername());
    return findNote(character, player.notes);
}

function findPlayerByUsername(username) {
    let currentPlayers = JSON.parse(localStorage.getItem("currentPlayers"));
    return currentPlayers.find(player => player.username === username);
}

function findNote(character , notesArray) {
    if (notesArray) {
        for (const innerArray of notesArray) {
            if (innerArray[0] === character) {
                return innerArray[1];
            }
        }
    }
    return "Enter note here";
}

class Player {
    username;
    password;
    main;
    private;
    notes;

    constructor() {
        this.username = localStorage.getItem("username");
        this.password = localStorage.getItem("password");
        this.main = localStorage.getItem("myMain");
        this.private = localStorage.getItem("private");
        this.notes = localStorage.getItem("notes") ? notes : [];
    }
}