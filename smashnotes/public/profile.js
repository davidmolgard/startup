document.getElementById("username").textContent = getUsername();
document.getElementById("myMain").textContent = localStorage.getItem("myMain");
updateMainImage();

function updateMainImage() {
    var myMain = getMain();

    //base URL and an image ID
    var baseURL = "https://ultimateframedata.com/characterart/";
    var imageID = "myMain";

    // Construct the full image URL with a timestamp
    var imageURL = baseURL + myMain + ".webp";

    // Get the image element by ID and set the source
    var myMainImage = document.getElementById(imageID);
    if (myMainImage) {
        myMainImage.src = imageURL;
    }
}

function loadPrivacy() {
    let currentPrivacy = localStorage.getItem("private") || "false";
    if (currentPrivacy === "true") {
        document.getElementById("private").textContent = "PRIVATE";
        document.getElementById("privacyButton").textContent = "Set Public";
    }
    else {
        document.getElementById("private").textContent = "PUBLIC";
        document.getElementById("privacyButton").textContent = "Set Private";
    }
}

function updateMain(main) {
    localStorage.setItem("myMain", main);
    updatePlayerMain(getUsername(), main);
    updateMainImage();
}

function getMain() {
    return localStorage.getItem("myMain") || mario; 
}

function getUsername() {
    return localStorage.getItem("username");
}

function changePrivacy() {
    let currentPrivacy = localStorage.getItem("private") || "false";
    if (currentPrivacy === "false") {
        localStorage.setItem("private", "true");
        updatePlayerPrivacy(getUsername, "true");
    }
    else {
        localStorage.setItem("private", "false");
        updatePlayerPrivacy(getUsername, "false");
    }
    loadPrivacy();
}

function findPlayerByUsername(username) {
    let currentPlayers = JSON.parse(localStorage.getItem("currentPlayers"));
    return currentPlayers.find(player => player.username === username);
}

function updatePlayerPrivacy(username, privacy) {
    let currentPlayers = JSON.parse(localStorage.getItem("currentPlayers"));
    let playerToUpdate = currentPlayers.find(player => player.username === username);
    if (playerToUpdate) {
        playerToUpdate.private = privacy;
        localStorage.setItem("currentPlayers", JSON.stringify(currentPlayers));
    }
}

function updatePlayerMain(username, main) {
    let currentPlayers = JSON.parse(localStorage.getItem("currentPlayers"));
    let playerToUpdate = currentPlayers.find(player => player.username === username);
    if (playerToUpdate) {
        playerToUpdate.main = main;
        localStorage.setItem("currentPlayers", JSON.stringify(currentPlayers));
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