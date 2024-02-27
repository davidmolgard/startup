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
function updateMain(main) {
    localStorage.setItem("myMain", main);
    updateMainImage();
}

function getMain() {
    return localStorage.getItem("myMain") || mario; 
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