function login() {
    const currentPlayer = new Player();
    const nameEl = document.querySelector("#username");
    const passwordEl = document.querySelector("#password");
    currentPlayer.username = nameEl.value;
    currentPlayer.password = passwordEl.value;
    currentPlayer.private = "false";
    addPlayer(currentPlayer);
    window.location.href = "matchups.html";
}

async function addPlayer(player) {
    try {
        const response = await fetch('/api/player', {
          method: 'POST',
          headers: {'content-type': 'application/json'},
          body: JSON.stringify(player),
        });
  
        // Store what the service gave us as the high scores
        const authToken = await response.json();
        localStorage.setItem('authToken', authToken);
      } catch {
        // If there was an error then just track scores locally
        localStorage.setItem('username', player.username);
      }
}

class Player {
    username;
    password;
    main;
    private;
    notes;
}