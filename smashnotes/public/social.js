document.getElementById("username").textContent = getUsername();
updateOnlinePlayers();
updateTournamentInfo();

async function getPlayers() {
    // Get the authentication token from localStorage
    let authToken = localStorage.getItem('authToken');

    // Check if authToken is present
    if (!authToken) {
        console.error('Authentication token not found');
        return [];
    }

    try {
        // Make a GET request to the /api/players endpoint
        const response = await fetch('/api/players', {
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
            return data || [];
        } else {
            throw new Error(`Failed to fetch players: ${response.status}`);
        }
    } catch (error) {
        // Handle errors during the fetch operation
        console.error('Error fetching players:', error);
        return [];
    }
}

async function updateOnlinePlayers() {
    let currentPlayers = await getPlayers();
    length = currentPlayers.length;
    if (length > 0) {
        switch(length) {
            default:
                document.getElementById("Player3").textContent = currentPlayers[2].username;
                updateCharacterImage(currentPlayers[2].main, "imgPlayer3")
            case 2:
                document.getElementById("Player2").textContent = currentPlayers[1].username;
                updateCharacterImage(currentPlayers[1].main, "imgPlayer2")
            case 1:
                document.getElementById("Player1").textContent = currentPlayers[0].username;
                updateCharacterImage(currentPlayers[0].main, "imgPlayer1")
                break;
        }
    }
}

async function updateTournamentInfo() {
    const endpoint = 'https://api.start.gg/gql/alpha'; 

    const query = `
    query TournamentsByVideogame {
        tournaments(query: {
        perPage: 3
        page: 1
        sortBy: "startAt asc"
        filter: {
            upcoming: true
            videogameIds: [1386]
            countryCode: "US"
        }
        }) {
        nodes {
            name
            slug
        }
        }
    }
    `;
    try {
        // Fetch authToken from backend
        const authTokenResponse = await fetch('/api/startgg', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        if (!authTokenResponse.ok) {
            throw new Error('Failed to fetch startgg authToken');
        }
        const authTokenData = await authTokenResponse.json();
        
        // Use authToken to fetch tournament data
        const tournamentResponse = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authTokenData.authToken,
            },
            body: JSON.stringify({ "query" : query }),
        });
        if (!tournamentResponse.ok) {
            throw new Error('Failed to fetch tournaments data');
        }
        const tournamentData = await tournamentResponse.json();
        
        // Update UI with tournament data
        for (let i = 1; i <= 3; i++) {
            const tournamentId = "tournament" + i;
            const linkId = "link" + i;
            document.getElementById(tournamentId).textContent = tournamentData.data.tournaments.nodes[i-1].name;
            document.getElementById(linkId).href = "https://start.gg/" + tournamentData.data.tournaments.nodes[i-1].slug;
        }
    } catch (error) {
        // Handle errors, e.g., display an error message
        console.error('Error:', error.message);
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

function updateCharacterImage(character, imageID) {
    //base URL
    var baseURL = "https://ultimateframedata.com/characterart/";
    // Construct the full image URL with a timestamp
    var imageURL = baseURL + character + ".webp";
    // Get the image element by ID and set the source
    var myMainImage = document.getElementById(imageID);
    if (myMainImage) {
        myMainImage.src = imageURL;
    }
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