// canvas elements
var game;
var paddles;
var play = false;
var canvas = document.getElementById("game-board");
var ctx = canvas.getContext("2d");

// ball elements
var ballRadius = 8;
var ballX = canvas.width/2;
var ballY;
var ballDX = .75;
var ballDY = -.75;

//paddle elements
var paddleWidth = 10;
var paddleLength = 70;

// user paddle elements
var paddleX = 15;
var paddleY = canvas.height/2 - paddleLength/2;
var paddleDX = 10;
var up = false;
var down = false;

// cpu paddle elements
var cpuPaddleX = canvas.width - paddleX - paddleWidth;
var cpuPaddleY = canvas.height/2 - paddleLength/2;

// score elements
var userScore = 0;
var cpuScore = 0;

// FUNCTIONS

function drawBall() {
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, 2 * Math.PI);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.closePath();
}

function drawBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawScore();
  if (play) {
    playGame();
  } else {
    ctx.font = '50px Roboto Condensed';
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText('press space to start', canvas.width/2, canvas.height/2 - 35);
  }


  ctx.beginPath();
  ctx.fillStyle = "white";
  ctx.fillRect(paddleX, paddleY, paddleWidth, paddleLength);
  ctx.fillRect(cpuPaddleX, cpuPaddleY, paddleWidth, paddleLength);
  ctx.closePath();

  movePaddle();
  if (play) {
    moveCPUPaddle();
  }
}

function drawScore() {

  ctx.font = '70px Roboto Condensed';
  ctx.textAlign = "center";
  ctx.fillStyle = "grey";
  for (var i = 70; i < canvas.height; i += 100) {
    ctx.fillText('|', canvas.width/2, i);
  }

  ctx.font = '70px Roboto Condensed';
  ctx.fillStyle = "white";
  ctx.textAlign = "center";

  if (userScore < 10) {
    ctx.fillText('0' + userScore, canvas.width/4, canvas.height/3);
  } else {
    ctx.fillText(userScore, canvas.width/4, canvas.height/3);
  }

  if (userScore < 10) {
    ctx.fillText('0' + cpuScore, 3*canvas.width/4, canvas.height/3);
  } else {
    ctx.fillText(cpuScore, canvas.width/4, canvas.height/3);
  }

}

function moveBall() {

  if(ballY + ballDY > canvas.height-ballRadius || ballY + ballDY < ballRadius) {
    ballDY = -ballDY;
  }

  if ((ballX + ballDX > cpuPaddleX - ballRadius) &&
  (ballY + ballDY > cpuPaddleY && ballY + ballDY < cpuPaddleY + paddleLength)) {
    ballDY = -ballDY;
    ballDX = -ballDX;
  }

  if((ballX + ballDX < ballRadius + paddleX) &&
    (ballY + ballDY > paddleY && ballY + ballDY < paddleY + paddleLength)) {
    ballDY = -ballDY;
    ballDX = -ballDX;
  }

  if (ballX <= 0) {
    cpuScore++;
    ballDX = -ballDX;
    stopGame();
  } else if (ballX >= canvas.width) {
    userScore++;
    ballDX= -ballDX;
    stopGame();
  }

  ballX += ballDX;
  ballY += ballDY;
}

// response to arrow keys
function userMove(e) {
  var key_code = e.which || e.key_code;
  switch(key_code) {
    case 32:
      if (play) {
        stopGame();
      } else {
        play = true;
        startGame();
      }
      break;
    case 38: //up arrow key
      up = true;
      break;
    case 40: //down arrow key
      down = true;
  }

}

function movePaddle() {
  if (up) {
    if (paddleY - paddleDX <= 0) {
      paddleY = 0;
    } else {
      paddleY -= paddleDX;
    }
    up = false;
  } else if (down) {
    if (paddleY + paddleDX >= canvas.height - paddleLength) {
      paddleY = canvas.height - paddleLength;
    } else {
      paddleY += paddleDX;
    }
    down = false;
  }
}

function moveCPUPaddle() {
  if (ballY < cpuPaddleY) {
    cpuPaddleY--;
  } else if (ballY > cpuPaddleY) {
    cpuPaddleY++;
  }
}

// draws ball and sets new coordinates
function playGame() {
  drawBall();
  moveBall();
}

// start GAME
function startGame() {
  ballX = canvas.width/2;
  ballY = Math.random() * (((canvas.height - 10) - ballRadius) - ballRadius) + ballRadius + 10;
  game = setInterval(playGame, 10);

}

function stopGame() {
  play = false;
  clearInterval(game);
}

// main method, runs game
function main() {

  paddles = setInterval(drawBoard, .5);
  document.addEventListener('keydown', function() {
    userMove(event)
  });
}

main();
