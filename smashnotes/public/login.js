function login() {
    const nameEl = document.querySelector("#username");
    localStorage.setItem("username", nameEl.value);
    const passwordEl = document.querySelector("#password");
    localStorage.setItem("password", passwordEl.value);
    const currentPlayer = new Player();
    currentPlayer.username = nameEl.value;
    currentPlayer.password = passwordEl.value;
    currentPlayer.private = "false";
    let currentPlayers = JSON.parse(localStorage.getItem('currentPlayers')) || [];
    currentPlayers.push(currentPlayer);
    localStorage.setItem("currentPlayers", JSON.stringify(currentPlayers));
    window.location.href = "matchups.html";
}

class Player {
    username;
    password;
    main;
    private;
    notes;
}