document.getElementById("username").textContent = getUsername();
updateMainImage();

async function updateMainImage() {
    try {
        // Call the updated getMain function to get the main character
        const myMain = await getMain();

        //base URL and an image ID
        const baseURL = "https://ultimateframedata.com/characterart/";
        const imageID = "myMain";

        // Construct the full image URL with the main character
        const imageURL = baseURL + myMain + ".webp";

        // Get the image element by ID and set the source
        const myMainImage = document.getElementById(imageID);
        if (myMainImage) {
            myMainImage.src = imageURL;
        }
    } catch (error) {
        // Handle errors, e.g., display an error message
        console.error('Error updating main image:', error);
    }
}

async function loadPrivacy() {
    // Get the authentication token from localStorage
    let authToken = localStorage.getItem('authToken');

    // Check if authToken is present
    if (!authToken) {
        console.error('Authentication token not found');
        return;
    }

    try {
        // Make a GET request to the /api/privacy endpoint
        const response = await fetch('/api/privacy', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
        });

        // Check if the response status is OK (200)
        if (response.ok) {
            // Update the UI based on the privacy setting
            const data = await response.json();
            if (data === "true") {
                document.getElementById("private").textContent = "PRIVATE";
                document.getElementById("privacyButton").textContent = "Set Public";
            } else {
                document.getElementById("private").textContent = "PUBLIC";
                document.getElementById("privacyButton").textContent = "Set Private";
            }
        } else {
            // Handle non-OK response, e.g., display an error message
            console.error(`Failed to fetch privacy setting: ${response.status}`);
        }
    } catch (error) {
        // Handle fetch errors, e.g., display an error message
        console.error('Error fetching privacy setting:', error);
    }
}

async function updateMain(main) {
    try {
        // Call the API endpoint to update the main character
        const response = await fetch('/api/main', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify({ main })
        });

        // Check if the response status is OK (200)
        if (response.ok) {
            // After updating the main character, update the main image
            updateMainImage();
        } else {
            // Handle non-OK response, e.g., display an error message
            console.error(`Failed to update main character: ${response.status}`);
        }
    } catch (error) {
        // Handle fetch errors, e.g., display an error message
        console.error('Error updating main character:', error);
    }
}


async function getMain() {
    // Get the authentication token from localStorage
    let authToken = localStorage.getItem('authToken');

    // Check if authToken is present
    if (!authToken) {
        console.error('Authentication token not found');
        return null;
    }

    try {
        // Make a GET request to the /api/main endpoint
        const response = await fetch('/api/main', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
        });

        // Check if the response status is OK (200)
        if (response.ok) {
            // Return the JSON data from the response
            const data = await response.json();
            return data || "mario";
        } else {
            throw new Error(`Failed to fetch main: ${response.status}`);
        }
    } catch (error) {
        // Handle errors during the fetch operation
        console.error('Error fetching main:', error);
        return "mario";
    }
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

async function changePrivacy() {
    // Get the authentication token from localStorage
    let authToken = localStorage.getItem('authToken');

    // Check if authToken is present
    if (!authToken) {
        console.error('Authentication token not found');
        return;
    }

    try {
        // Make a POST request to the /api/privacy endpoint
        const response = await fetch('/api/privacy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
        });

        // Check if the response status is OK (200)
        if (response.ok) {
            // After updating the privacy setting, update the UI
            const data = await response.json();
            loadPrivacy();
        } else {
            // Handle non-OK response, e.g., display an error message
            console.error(`Failed to update privacy setting: ${response.status}`);
        }
    } catch (error) {
        // Handle fetch errors, e.g., display an error message
        console.error('Error updating privacy setting:', error);
    }
}
