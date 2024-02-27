document.getElementById("username").textContent = localStorage.getItem("username");
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
    updateMainImage();
}

function getMain() {
    return localStorage.getItem("myMain") || mario; 
}

function changePrivacy() {
    let currentPrivacy = localStorage.getItem("private") || "false";
    if (currentPrivacy === "false") {
        localStorage.setItem("private", "true");
    }
    else {
        localStorage.setItem("private", "false");
    }
    loadPrivacy();
}

class Player {
    username;
    password;
    main;
    private;

    constructor() {
        this.username = localStorage.getItem("username");
        this.password = localStorage.getItem("password");
        this.main = localStorage.getItem("myMain");
        this.private = localStorage.getItem("private");
    }
}