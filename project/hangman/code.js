const dic = [
    { name: "america", pic: "pic/America.png" },
    { name: "brazil", pic: "pic/Brazil.png" },
    { name: "canada", pic: "pic/Canada.png" },
    { name: "china", pic: "pic/China.png" },
    { name: "france", pic: "pic/France.png" },
    { name: "italy", pic: "pic/Italy.png" },
    { name: "japan", pic: "pic/Japan.png" },
    { name: "pakistan", pic: "pic/Pakistan.png" },
    { name: "russia", pic: "pic/Russia.png" },
    { name: "turkiye", pic: "pic/Turkiye.png" },
];


const MAX_ATTEMPTS = 5;

const picBox = document.getElementById("pic_box");
const heder = document.getElementById("heder");
const box = document.getElementById("box");
const hint = document.getElementById("hint");
const livesEl = document.getElementById("lives");
const wrongLettersEl = document.getElementById("wrong-letters");
const restartBtn = document.getElementById("restart");
const photoFrame = document.getElementById("d1");


let carName = "";
let crc = [];
let wrong = MAX_ATTEMPTS;
let guessed = new Set();
let gameOver = false;
let prevCrc = [];

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function initGame() {
    const r = rand(0, dic.length - 1);

    carName = dic[r].name;
    crc = Array(carName.length).fill("-");
    wrong = MAX_ATTEMPTS;
    guessed = new Set();
    gameOver = false;
    prevCrc = [...crc];

    picBox.style.backgroundImage = `url(${dic[r].pic})`;
    picBox.classList.remove("revealed");
    photoFrame.classList.remove("revealed");

    box.classList.remove("shake", "game-over", "game-won");
    hint.classList.remove("win", "lose");
    hint.textContent = "Type a letter to guess";
    wrongLettersEl.innerHTML = "";
    restartBtn.hidden = true;
    restartBtn.classList.remove("visible");

    drawLives();
    drawTiles();
}

function drawLives() {
    livesEl.innerHTML = "";
    for (let i = 0; i < MAX_ATTEMPTS; i++) {
        const dot = document.createElement("span");
        dot.className = "life-dot" + (i >= wrong ? " lost" : "");
        livesEl.appendChild(dot);
    }
}

function drawTiles(state) {
    heder.innerHTML = "";

    for (let i = 0; i < crc.length; i++) {
        const tile = document.createElement("span");
        tile.className = "tile";
        if (state) tile.classList.add(state);

        if (crc[i] !== "-") {
            tile.textContent = crc[i];
            if (prevCrc[i] === "-" && !gameOver) {
                tile.classList.add("filled");
            }
        }

        heder.appendChild(tile);
    }

    prevCrc = [...crc];
}

function drawWrongLetters() {
    wrongLettersEl.innerHTML = "";
    [...guessed].sort().forEach((letter) => {
        if (!carName.includes(letter)) {
            const span = document.createElement("span");
            span.className = "wrong-letter";
            span.textContent = letter;
            wrongLettersEl.appendChild(span);
        }
    });
}

function revealPhoto() {
    picBox.classList.add("revealed");
    photoFrame.classList.add("revealed");
}

function endGame(won) {
    gameOver = true;
    revealPhoto();
    restartBtn.hidden = false;
    restartBtn.classList.add("visible");

    if (won) {
        box.classList.add("game-won");
        hint.classList.add("win");
        hint.textContent = "Entry approved — correct country!";
        drawTiles("win");
    } else {
        crc = carName.split("");
        box.classList.add("game-over");
        hint.classList.add("lose");
        hint.textContent = `Entry denied — it was "${carName.toUpperCase()}"`;
        drawTiles("lose");
    }
}

function run(e) {
    if (gameOver) return;

    const x = e.key.toLowerCase();

    if (x.length !== 1 || x < "a" || x > "z") return;
    if (guessed.has(x)) return;

    guessed.add(x);
    let found = false;

    for (let i = 0; i < carName.length; i++) {
        if (x === carName[i]) {
            crc[i] = x;
            found = true;
        }
    }

    if (!found) {
        wrong -= 1;
        box.classList.add("shake");
        setTimeout(() => box.classList.remove("shake"), 350);
    }

    drawLives();
    drawWrongLetters();

    if (wrong <= 0) {
        endGame(false);
    } else if (crc.join("") === carName) {
        endGame(true);
    } else {
        drawTiles();
    }
}

document.addEventListener("keydown", run);
restartBtn.addEventListener("click", initGame);

initGame();
