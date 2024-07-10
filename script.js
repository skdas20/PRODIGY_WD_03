const gameBoard = document.querySelector('.game-board');
const cells = document.querySelectorAll('.cell');
const gameStatus = document.getElementById('game-status');
const restartButton = document.getElementById('restart-button');

const moveSound = new Audio('assets/bell1.wav');
const winSound = new Audio('assets/bell2.wav');

let currentPlayer = 'X';
let gameActive = true;
const boardState = ['', '', '', '', '', '', '', '', ''];

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (boardState[clickedCellIndex] !== '' || !gameActive || currentPlayer === 'O') {
        return;
    }

    boardState[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = `<img src="assets/${currentPlayer}.png" alt="${currentPlayer}">`;
    moveSound.play();
    handleResultValidation();
    if (gameActive) {
        switchPlayer();
        if (currentPlayer === 'O') {
            setTimeout(computerMove, 500);
        }
    }
}

function handleResultValidation() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        let a = boardState[winCondition[0]];
        let b = boardState[winCondition[1]];
        let c = boardState[winCondition[2]];

        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        gameStatus.innerHTML = `Player ${currentPlayer} has won!`;
        gameActive = false;
        winSound.play();
        return;
    }

    const roundDraw = !boardState.includes('');
    if (roundDraw) {
        gameStatus.innerHTML = 'Game ended in a draw!';
        gameActive = false;
        return;
    }
}

function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    gameStatus.innerHTML = `Player ${currentPlayer}'s turn`;
}

function computerMove() {
    for (let i = 0; i < boardState.length; i++) {
        if (boardState[i] === '') {
            boardState[i] = 'O';
            cells[i].innerHTML = `<img src="assets/O.png" alt="O">`;
            moveSound.play();
            handleResultValidation();
            if (gameActive) {
                switchPlayer();
            }
            break;
        }
    }
}

function handleRestartGame() {
    currentPlayer = 'X';
    gameActive = true;
    boardState.fill('');
    gameStatus.innerHTML = `Player ${currentPlayer}'s turn`;

    cells.forEach(cell => {
        cell.innerHTML = '';
    });
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', handleRestartGame);
