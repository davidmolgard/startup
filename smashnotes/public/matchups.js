document.getElementById("username").textContent = getUsername();

function getNotes(character) {
    localStorage.setItem("notesCharacter", character);
    window.location.href = "notes.html";
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