// Gameboard module
const Gameboard = (() => {
  let board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;

  const setCell = (index, marker) => {
    if (board[index] === "") {
      board[index] = marker;
      return true;
    }
    return false;
  };

  const reset = () => {
    board = ["", "", "", "", "", "", "", "", ""];
  };

  return { getBoard, setCell, reset };
})();

// Player factory
const Player = (name, marker) => {
  return { name, marker };
};

// Game controller
const GameController = (() => {
  let player1, player2, currentPlayer;
  let isGameOver = false;

  const startGame = (name1, name2) => {
    player1 = Player(name1, "X");
    player2 = Player(name2, "O");
    currentPlayer = player1;
    isGameOver = false;
    Gameboard.reset();
    DisplayController.render();
    DisplayController.setMessage(`${currentPlayer.name}'s turn`);
  };

  const playTurn = (index) => {
    if (isGameOver || !Gameboard.setCell(index, currentPlayer.marker)) return;
    DisplayController.render();
    if (checkWin(currentPlayer.marker)) {
      DisplayController.setMessage(`${currentPlayer.name} wins!`);
      isGameOver = true;
    } else if (checkTie()) {
      DisplayController.setMessage("It's a tie!");
      isGameOver = true;
    } else {
      switchPlayer();
      DisplayController.setMessage(`${currentPlayer.name}'s turn`);
    }
  };

  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  const checkWin = (marker) => {
    const b = Gameboard.getBoard();
    const winCombos = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    return winCombos.some(combo => combo.every(index => b[index] === marker));
  };

  const checkTie = () => {
    return Gameboard.getBoard().every(cell => cell !== "");
  };

  return { startGame, playTurn };
})();

// Display controller
const DisplayController = (() => {
  const boardDiv = document.getElementById("gameboard");
  const messageDiv = document.getElementById("message");
  const startBtn = document.getElementById("startBtn");
  const restartBtn = document.getElementById("restartBtn");

  const render = () => {
    boardDiv.innerHTML = "";
    const board = Gameboard.getBoard();
    board.forEach((cell, index) => {
      const cellDiv = document.createElement("div");
      cellDiv.classList.add("cell");
      cellDiv.textContent = cell;
      cellDiv.addEventListener("click", () => GameController.playTurn(index));
      boardDiv.appendChild(cellDiv);
    });
    restartBtn.style.display = "block";
  };

  const setMessage = (msg) => {
    messageDiv.textContent = msg;
  };

  startBtn.addEventListener("click", () => {
    const name1 = document.getElementById("player1").value || "Player 1";
    const name2 = document.getElementById("player2").value || "Player 2";
    GameController.startGame(name1, name2);
  });

  restartBtn.addEventListener("click", () => {
    location.reload(); // Simple reload for full reset
  });

  return { render, setMessage };
})();
