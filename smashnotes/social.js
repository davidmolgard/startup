document.getElementById("username").textContent = getUsername();
updateOnlinePlayers();
//updateTournamentInfo();

function getPlayers() {
    return JSON.parse(localStorage.getItem("currentPlayers")) || [];
}

function updateOnlinePlayers() {
    let currentPlayers = getPlayers();
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
    /*for (let i = 1; i <= 3; i++) {
        const id = "tournament" + i;
        const tournamentData = await getTournamentfromAPI(i);
        document.getElementById(id).textContent = tournamentData;
    } */
}


function getUsername() {
    return localStorage.getItem("username");
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
        this.username = localStorage.getItem("username");
        this.password = localStorage.getItem("password");
        this.main = localStorage.getItem("myMain");
        this.private = localStorage.getItem("private");
        this.notes = localStorage.getItem("notes") ? notes : [];
    }
}