// Based on: https://www.youtube.com/watch?v=sNn_Gxph3TY

//selectors
const gameBoard = document.querySelector('#board');
const info = document.querySelector('#info');
let turn;
const winningCombos = [
  [0, 1, 2], // top row
  [3, 4, 5], // middle row
  [6, 7, 8], // bottom row
  [0, 3, 6], // left col
  [1, 4, 7], // middle col
  [2, 5, 8], // right col
  [0, 4, 8], // main diag
  [2, 4, 6], // off diag
];

//creat the gameboard
function createGameboard() {
  const emptyTiles = ' '.repeat(9).split('');
  const tileGrid = emptyTiles
    .map((t) => `<button class="tile"></button>`)
    .join('');
  gameBoard.innerHTML = tileGrid;
  turn = 'X';
  document.documentElement.style.setProperty('--hue', 10);
  info.textContent = `${turn}'s turn`;
  gameBoard.addEventListener('click', handleGameboardClick);
  const allTiles = [...document.querySelectorAll('.tile')];
  allTiles.forEach((tile) => {
    tile.addEventListener('mouseenter', handleMouseEnter);
    tile.addEventListener('mouseleave', handleMouseLeave);
  });
  gameBoard.removeAttribute('inert');
}

createGameboard();

function updateTurn() {
  turn = turn === 'X' ? 'O' : 'X';
  info.textContent = `${turn}'s turn`;
  document.documentElement.style.setProperty('--hue', turn === 'X' ? 10 : 200);
}

function restartGame() {
  let seconds = 3;
  const timer = setInterval(() => {
    info.textContent = `Restarting in ${seconds}...`;
    seconds--;
    if (seconds === 0) {
      clearInterval(timer);
      createGameboard();
    }
  }, 1000);
}

function showCongrats() {
  info.textContent = `${turn} wins!`;
  gameBoard.setAttribute('inert', true);
  setTimeout(restartGame, 1000);
  const jsConfetti = new JSConfetti();

  jsConfetti.addConfetti();
}

function checkScore() {
  const allTiles = [...document.querySelectorAll('.tile')];
  const tileValues = allTiles.map((t) => t.dataset.value);
  const isWinner = winningCombos.some((combo) => {
    const [a, b, c] = combo;
    return (
      tileValues[a] &&
      tileValues[a] === tileValues[b] &&
      tileValues[a] === tileValues[c]
    );
  });

  if (isWinner) {
    return showCongrats();
  }
  updateTurn();
}

function handleGameboardClick(e) {
  const valueExists = e.target.dataset.value;
  if (!valueExists) {
    e.target.dataset.value = turn;
    e.target.style.setProperty('--hue', turn === 'X' ? 10 : 200);
    checkScore();
  }
}

function handleMouseEnter(e) {
  const valueExists = e.target.dataset.value;
  if (!valueExists) {
    e.target.dataset.hover = turn;
    e.target.style.setProperty('--hue', turn === 'X' ? 10 : 200);
  }
}

function handleMouseLeave(e) {
  e.target.dataset.hover = '';
}
