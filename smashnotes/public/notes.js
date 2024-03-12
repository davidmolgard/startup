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
    const authToken = localStorage.getItem("authToken");

    // Check if authToken is available
    if (authToken) {
        fetch('/api/player', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,  // Include the authToken in the Authorization header
            },
        })
        .then(response => {
            if (response.ok) {
                // If the response is successful, parse the JSON
                return response.json();
            } else {
                // If the response is not successful, handle the error
                throw new Error('Failed to fetch username');
            }
        })
        .then(data => {
            // Update the UI with the retrieved username
            document.getElementById("username").textContent = data.username;
        })
        .catch(error => {
            // Handle errors, e.g., display an error message
            console.error('Error:', error.message);
        });
    } else {
        console.error('Auth token not found');
    }
}

function getNote(character) {
    const authHeader = localStorage.getItem('authToken');
    
    if (!authHeader) {
        // Handle unauthorized access
        console.error('Unauthorized access. Please log in.');
        return Promise.reject('Unauthorized');
    }

    return fetch('/api/notes', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${authHeader}`,
            'Content-Type': 'application/json'
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // Assuming data is an array of notes
        return findNote(character, data);
    })
    .catch(error => {
        console.error('Error fetching notes:', error);
        return Promise.reject(error);
    });
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
