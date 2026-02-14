const gameBoard = document.getElementById("game-board");
const movesDisplay = document.getElementById("moves");
const timerDisplay = document.getElementById("timer");
const restartButton = document.getElementById("restart");

// Win modal
const winModal = document.getElementById("win-modal");
const finalStats = document.getElementById("final-stats");
const playAgainBtn = document.getElementById("play-again");

// Lose modal
const loseModal = document.getElementById("lose-modal");
const loseStats = document.getElementById("lose-stats");
const tryAgainBtn = document.getElementById("try-again");

// Safety: if any modal element is missing, don't crash the whole game
if (!gameBoard || !movesDisplay || !timerDisplay || !restartButton) {
  throw new Error("Missing core game elements (game-board/moves/timer/restart).");
}

const symbols = ["🌈","🌸","🦋","🧚","🌼","🦄","☁️","✨"];
const TIME_LIMIT = 40;

let cards = [];
let flippedCards = [];
let matchedCount = 0;
let moves = 0;

let timer = 0;
let timerInterval = null;
let isTimerRunning = false;
let gameOver = false;

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function hideModals() {
  if (winModal) winModal.classList.remove("show");
  if (loseModal) loseModal.classList.remove("show");
}

function stopTimer() {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = null;
  isTimerRunning = false;
}

function startTimer() {
  timer = 0;
  timerDisplay.textContent = `Time: ${timer}s`;

  timerInterval = setInterval(() => {
    timer++;
    timerDisplay.textContent = `Time: ${timer}s`;

    if (timer >= TIME_LIMIT) {
      stopTimer();
      showLoseModal();
    }
  }, 1000);
}

function createCard(symbol) {
  const card = document.createElement("div");
  card.classList.add("card");
  card.matched = false;

  card.innerHTML = `
    <div class="front">?</div>
    <div class="back">${symbol}</div>
  `;

  card.addEventListener("click", () => flipCard(card));
  return card;
}

function createCards() {
  const deck = shuffle([...symbols, ...symbols]);
  return deck.map(createCard);
}

function flipCard(card) {
  if (gameOver) return;

  if (!isTimerRunning) {
    startTimer();
    isTimerRunning = true;
  }

  if (flippedCards.length >= 2) return;
  if (card.classList.contains("flipped")) return;
  if (card.matched) return;

  card.classList.add("flipped");
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    moves++;
    movesDisplay.textContent = `Moves: ${moves}`;
    checkMatch();
  }
}

function checkMatch() {
  const [card1, card2] = flippedCards;

  const s1 = card1.querySelector(".back").textContent;
  const s2 = card2.querySelector(".back").textContent;

  if (s1 === s2) {
    card1.matched = true;
    card2.matched = true;
    matchedCount += 2;
    flippedCards = [];

    if (matchedCount === symbols.length * 2) {
      stopTimer();
      showWinModal();
    }
  } else {
    setTimeout(() => {
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");
      flippedCards = [];
    }, 900);
  }
}

function showWinModal() {
  gameOver = true;
  if (finalStats) finalStats.textContent = `Time: ${timer}s • Moves: ${moves}`;
  if (winModal) winModal.classList.add("show");
}

function showLoseModal() {
  gameOver = true;

  // flip any currently flipped cards back
  flippedCards.forEach(c => c.classList.remove("flipped"));
  flippedCards = [];

  if (loseStats) loseStats.textContent = `You matched ${matchedCount / 2} / ${symbols.length} pairs`;
  if (loseModal) loseModal.classList.add("show");
}

function restartGame() {
  stopTimer();
  hideModals();

  cards = [];
  flippedCards = [];
  matchedCount = 0;
  moves = 0;
  timer = 0;
  gameOver = false;

  movesDisplay.textContent = `Moves: ${moves}`;
  timerDisplay.textContent = `Time: 0s`;

  gameBoard.innerHTML = "";
  initializeGame();
}

function initializeGame() {
  cards = createCards();
  cards.forEach(card => gameBoard.appendChild(card));
}

restartButton.addEventListener("click", restartGame);

if (playAgainBtn) {
  playAgainBtn.addEventListener("click", () => {
    if (winModal) winModal.classList.remove("show");
    restartGame();
  });
}

if (tryAgainBtn) {
  tryAgainBtn.addEventListener("click", () => {
    if (loseModal) loseModal.classList.remove("show");
    restartGame();
  });
}

// Start
hideModals();
initializeGame();
