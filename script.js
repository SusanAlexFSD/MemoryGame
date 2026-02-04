// These lines select specific HTML elements by the id
const gameBoard = document.getElementById('game-board'); // The container where the game cards will be displayed
const movesDisplay = document.getElementById('moves'); // This element shows the number of moves the player has made
const timerDisplay = document.getElementById('timer'); // This element shows the elapsed time
const restartButton = document.getElementById('restart'); // This is a button element for restarting the game

// These variables track the game's state
let cards = []; // The array of all the card elements
let flippedCards = []; // An array holding the currently flipped cards (up to two at a time)
let matchedCount = 0; // A count of how many cards have been matched so far
let moves = 0; // The number of moves the player has made
let timer = 0; // The elapsed time in seconds
let timerInterval; // Stores the interval ID for the timer, which allows stopping it later
let isTimerRunning = false; // A flag to track if the timer has started

// Symbols for the cards
// This is an array of emoji symbols representing the card faces. Each symbol will appear twice in the game to form pairs
const symbols = ['🍎', '🍌', '🍇', '🍓', '🍒', '🍍', '🥝', '🍉'];

// Create and shuffle cards
function createCards() {
    const deck = [...symbols, ...symbols]; // Duplicate symbols for pairs
    return deck.sort(() => Math.random() - 0.5).map(symbol => createCard(symbol)); // Randomly shuffles the array and transforms each symbol into a card element
}

// Create card element
// This creates a div for the card and assigns it the class "card"
// It then sets the card's HTML structure with a front (hidden face) and a back (showing the symbol)
// Adds an event listener to handle flipping the card
function createCard(symbol) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
        <div class="front"></div>
        <div class="back">${symbol}</div>
    `;
    card.addEventListener('click', () => flipCard(card));
    return card;
}

// Flip card logic
// This section ensures the player can flip only two cards at a time
// Prevents flipping cards that are already flipped or matched
// Updates the card's visual state by adding the flipped class and adds the card to flippedCards
// If two cards are flipped, increments the move counter and checks if they match 
function flipCard(card) {
    if (
        flippedCards.length < 2 && // Only allow flipping two cards at a time
        !card.classList.contains('flipped') && // Prevent re-flipping the same card
        !card.matched // Ignore already matched cards
    ) {
        // Start the timer when the first card is clicked
        if (!isTimerRunning) {
            startTimer();
            isTimerRunning = true;
        }

        card.classList.add('flipped'); // Add flipped class to reveal the card
        flippedCards.push(card); // Add the card to the flipped cards array

        if (flippedCards.length === 2) {
            moves++;
            movesDisplay.textContent = `Moves: ${moves}`;
            checkMatch(); // Check if the two flipped cards match
        }
    }
}

// Check if cards match
// This function handles the logic to check if two flipped cards are a matching pair
function checkMatch() {
    const [card1, card2] = flippedCards; // Destructs the flippedCards array to assign the first and second flipped cards to card1 and card2
    if (card1.innerHTML === card2.innerHTML) { //Compares the inner HMTL of the two cards to determine if they match (same symbol)
        card1.matched = card2.matched = true; //Marks both cards as matched by adding a custom property matched=true to prevent re-flipping them later
        matchedCount += 2; //Increments the count of matched cards by 2 since a pair has been matched
        if (matchedCount === cards.length) { //Checks if all cards have been matched by comparing ,atchedCount to the total number of cards
            clearInterval(timerInterval);
            alert(`You won! Time: ${timer}s, Moves: ${moves}`); //Stops the timer and shows an alert displaying time and moves 
        }
        flippedCards = []; //Resets the flippedCards array so the player can flip new cards
    } else {
        setTimeout(() => { // This bit removes the flipped class from both cards to hide their symbols after 1 second, giving the player a breif moment to see them 
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = []; //Resets the flippedCards array
        }, 1000);
    }
}

// Start the timer
function startTimer() {
    timer = 0; //Sets the times to 0 and updates the timerDisplay element to show 0s
    timerDisplay.textContent = `Time: ${timer}s`;
    timerInterval = setInterval(() => { //Starts the setInterval that increments the timer every second and updates the timerDisplay to reflect the elapsed time
        timer++;
        timerDisplay.textContent = `Time: ${timer}s`;
    }, 1000);
}

// Restart the game
function restartGame() {
    clearInterval(timerInterval); //Stops the time, ensuring it doesnt continue running after the game resets
    moves = 0;
    matchedCount = 0;
    flippedCards = [];
    isTimerRunning = false; // Reset the timer running flag
    movesDisplay.textContent = `Moves: ${moves}`; //Updates the moveDisplay and timerDisplay to show the reset values
    timerDisplay.textContent = `Time: 0s`;
    gameBoard.innerHTML = '';  //Clears all cards elements from the gameBoard to prepare for a new set of shuffled cards
    initializeGame(); //Calls initializeGame to restart the game setup
}

// Initialize the game
function initializeGame() {
    cards = createCards();  //Calls createCards() to generate a shuffled deck of cards and assigns it to the cards array
    cards.forEach(card => gameBoard.appendChild(card)); //Iterates through the cards array and appends each card element to the gameBoard to display them on the screen
}

// Event listener for the restart button
restartButton.addEventListener('click', restartGame); //Adds an event listenet to the "Restart" button. When clicked, it calls the restartGmes function to reset the game 

// Start the game initially
initializeGame(); //Automatically calls initializeGame to set up and start the game when the page loads
