let p1 = document.getElementById('p1');
let p2 = document.getElementById('p2');
let ball = document.getElementById('ball');
let score1El = document.getElementById('score1');
let score2El = document.getElementById('score2');

const tableW = 800;
const tableH = 500;
const paddleH = 100;
const ballSize = 20;

let score1 = 0;
let score2 = 0;


let p1y = (tableH - paddleH) / 2;
let p2y = (tableH - paddleH) / 2;


let ballX = (tableW - ballSize) / 2;
let ballY = (tableH - ballSize) / 2;


let ballSpeedX = 4;
let ballSpeedY = 3;

let step = 10;

const keys = {
    w: false,
    s: false,
    ArrowUp: false,
    ArrowDown: false,
};

document.addEventListener('keydown', function (e) {
    keys[e.key] = true;
});

document.addEventListener('keyup', function (e) {
    keys[e.key] = false;
});

function movePlayer() {
    if (keys["w"] && p1y > 0)
        p1y -= step;

    if (keys["s"] && p1y < (tableH - paddleH))
        p1y += step;

    if (keys["ArrowUp"] && p2y > 0)
        p2y -= step;

    if (keys["ArrowDown"] && p2y < (tableH - paddleH))
        p2y += step;

    p1.style.top = p1y + 'px';
    p2.style.top = p2y + 'px';
}



function hitPaddle() {


    if (ballSpeedX > 0) {
        if (ballX >= 740) {

            if (ballY >= p2y) {
                if (ballY <= p2y + paddleH) {
                    return true;
                }
            }
        }
    }


    if (ballSpeedX < 0) {
        if (ballX <= 40) {
            if (ballY >= p1y) {
                if (ballY <= p1y + paddleH) {
                    return true;
                }
            }
        }
    }


    return false;
}




function outline() {

    if (ballX < 0) {
        return true;
    }

    if (ballX > tableW) {
        return true;
    }

    return false;
}


function wall() {

    if (ballY < 0) {
        return true;
    }
    if (ballY > tableH - ballSize) {
        return true;
    }

    return false;
}



function resetBall() {

    ballX = (tableW - ballSize) / 2;

    ballY = (tableH - ballSize) / 2;

}

function moveBall() {

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (hitPaddle()) {
        ballSpeedX = -ballSpeedX;
    }

    if (wall()) {
        ballSpeedY = -ballSpeedY;
    }

    if (outline()) {
        if (ballX < 0) {
            score2 += 1;
            score2El.textContent = score2;
        } else {
            score1 += 1;
            score1El.textContent = score1;
        }
        resetBall();
    }


    ball.style.left = ballX + 'px';
    ball.style.top = ballY + 'px';
}

function loopGame() {
    movePlayer();
    moveBall();
    requestAnimationFrame(loopGame);
}


resetBall();

loopGame();
