document.getElementById("username").textContent = getUsername();
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

function updateNotes() {
    
}

function getNotesCharacter() {
    return localStorage.getItem("notesCharacter");
}

function getUsername() {
    return localStorage.getItem("username");
}