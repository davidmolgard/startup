document.getElementById("username").textContent = getUsername();

function getNotes(character) {
    localStorage.setItem("notesCharacter", character);
    window.location.href = "notes.html";
}

function getUsername() {
    return localStorage.getItem("username");
}