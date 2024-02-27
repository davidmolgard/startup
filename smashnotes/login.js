function login() {
    const nameEl = document.querySelector("#username");
    localStorage.setItem("username", nameEl.value);
    const passwordEl = document.querySelector("#password");
    localStorage.setItem("password", passwordEl.value);
    let currentPlayers = JSON.parse(localStorage.getItem('currentPlayers')) || [];
    let currentPlayer = [nameEl.value, passwordEl.value];
    currentPlayers.push(currentPlayer);
    localStorage.setItem("currentPlayers", JSON.stringify(currentPlayers));
    window.location.href = "matchups.html";
  }