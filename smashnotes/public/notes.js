document.getElementById("username").textContent = getUsername();
updateNoteOnScreen();
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

async function updateNoteOnScreen() {
    let note = await getNote(getNotesCharacter());
    document.getElementById("note-box").textContent = note;
}

function updateNote() {
    let note = document.getElementById("note-box").textContent;
    let character = getNotesCharacter();

       // Get the authentication token from localStorage
       let authToken = localStorage.getItem('authToken');

       // Check if authToken is present
       if (!authToken) {
           console.error('Authentication token not found');
           return;
       }
   
       // Create an object with the character and note data
       const requestBody = {
           character: character,
           note: note
       };
   
       // Make a POST request to the /api/notes endpoint
       fetch('/api/notes', {
           method: 'POST',
           headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${authToken}`
           },
           body: JSON.stringify(requestBody)
       })
       .then(response => {
           // Check if the response status is OK (200)
           if (response.ok) {
               return response.json(); // Return the JSON data from the response
           } else {
               throw new Error(`Failed to save/update note: ${response.status}`);
           }
       })
       .then(data => {
           // Handle the data returned from the server if needed
           console.log('Note saved/updated successfully:', data);
       })
       .catch(error => {
           // Handle errors during the fetch operation
           console.error('Error saving/updating note:', error);
       });
        // Optionally, you can also update the displayed note on the page
    document.getElementById("note-box").textContent = note;
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

        // Check if the response body is empty
        if (response.headers.get('content-length') === '0') {
            console.warn('Empty response body received.');
            return [];
        }

        return response.json();
    })
    .then(data => {
        console.log('Data received from server:', data);
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
