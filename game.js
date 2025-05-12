const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const width = window.innerWidth;
const height = window.innerHeight;

//init the snake on a weird location
let snakeBody = [
    [8, 5],
    [7, 5],
    [6, 5],
    [5, 5]
];

let direction = "RIGHT"; //RIGHT, LEFT, UP, DOWN - a pretty fragile way of doing this, but it should work... i hope (just dont parse nything weird into it lol)
let score = 0; //collected apples
let lastUpdateTime = 0;
let gameInterval = 100;
let apple = [0, 0];
let obstacles = [];
let gameActive = false;

// 2d rendering loop
function renderGame() {
       //snake
       ctx.fillStyle = "#000000";
       ctx.clearRect(0, 0, canvas.width, canvas.height);
        
      let size = 10;
      ctx.fillStyle = "green";
      for (let i = 0; i < snakeBody.length; i++) {
               ctx.fillRect(snakeBody[i][0] * size, snakeBody[i][1] * size, size, size);
      }

       document.getElementById('snakeLength').innerText = snakeBody.length;
        document.getElementById('obstacleCount').innerText = obstacles.length;
        
      //apple
      ctx.fillStyle = "red";
      ctx.fillRect(apple[0] * size, apple[1] * size, size, size);

      //obstacles
      ctx.fillStyle = "gray";
      for(let i = 0; i < obstacles.length; i++) {
           ctx.fillRect(obstacles[i][0] * size, obstacles[i][1] * size, size, size);
      }
}

// snake update loop
function updateSnake() {
     let newHead = [snakeBody[0][0], snakeBody[0][1]];   
    newHead = moveSnake(newHead); 

    // check for collisions
    if (newHead[0] < 0 || newHead[0] * 10 >= canvas.width || newHead[1] < 0 || newHead[1] * 10 >= canvas.height) {
        endGame();
        return;
    }

    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeBody[i][0] === newHead[0] && snakeBody[i][1] === newHead[1]) {
            endGame();
            return;
        }
    }

    for (let i = 0; i < obstacles.length; i++) {
        if (newHead[0] === obstacles[i][0] && newHead[1] === obstacles[i][1]) {
            endGame();
            return;
        }
    }

    let gotApple = false;
    if (newHead[0] === apple[0] && newHead[1] === apple[1]) {
        apple = generateApple();
        gotApple = true;
        score += 1;
        if(Math.floor(Math.random() * 10) + 1 == 10) { // 1 out of 10 chance to generate an obstacle
            generateObstacle();
        }
        document.getElementById('gameScore').innerText = score;
    }

    if(!gotApple) {
        snakeBody.pop();
    }
    snakeBody.unshift(newHead);
}

function moveSnake(newHead) {
     switch (direction) {
        case "UP":
          newHead[1] -= 1;
          break;
        case "DOWN":
          newHead[1] += 1;
          break;
        case "LEFT":
          newHead[0] -= 1;
          break;
        case "RIGHT":
          newHead[0] += 1;
          break;
    }
    return newHead;
}

function ascend() {
    if(score >= 2) {
        snakeBody.pop();
        obstacles.pop();
        score -= 2;
        document.getElementById('gameScore').innerText = score;
    }
}

function generateApple() {
    let appleX = Math.floor(Math.random() * (canvas.width / 10));
    let appleY = Math.floor(Math.random() * (canvas.height / 10));

    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeBody[i][0] === appleX && snakeBody[i][1] === appleY) {
            return generateApple();
        }
    }
    
    return [appleX, appleY];
}

function generateObstacle() {
    let obstacleX = Math.floor(Math.random() * (canvas.width / 10));
    let obstacleY = Math.floor(Math.random() * (canvas.height / 10));

    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeBody[i][0] === obstacleX && snakeBody[i][1] === obstacleY) {
            generateObstacle();
            break;
        }
    }
    
    obstacles.unshift([obstacleX, obstacleY]);
}

function saveScore(score) {
    let highscore = parseInt(localStorage.getItem('highscore'));
    if (score > highscore) {
        localStorage.setItem('highscore', score);
    }

    let topScores = JSON.parse(localStorage.getItem('topScores'));
    topScores.push(score);
    topScores.sort((a, b) => b - a);
    topScores = topScores.slice(0, 5);
    localStorage.setItem('topScores', JSON.stringify(topScores));

    let lastGames = JSON.parse(localStorage.getItem('lastGames'));
    lastGames.push(score);
    if (lastGames.length > 5) {
        lastGames.shift();
    }
    localStorage.setItem('lastGames', JSON.stringify(lastGames));
}

function showLeaderboard() {
    let highscore = localStorage.getItem('highscore');
    let topScores = JSON.parse(localStorage.getItem('topScores'));
    let lastGames = JSON.parse(localStorage.getItem('lastGames'));

    document.getElementById('highscore').textContent = highscore;

    let topScoresList = document.getElementById('topScores');
    topScoresList.innerHTML = '';
    topScores.forEach(score => {
        let li = document.createElement('li');
        li.textContent = score;
        topScoresList.appendChild(li);
    });

    let lastGamesList = document.getElementById('lastGames');
    lastGamesList.innerHTML = '';
    lastGames.forEach(score => {
        let li = document.createElement('li');
        li.textContent = score;
        lastGamesList.appendChild(li);
    });

    leaderboard.style.display = 'block';
    game.style.display = 'none';
    start.style.display = 'none';
    gameOver.style.display = 'none';
}

function showStartMenu() {
    gameOver.style.display = 'none';
    game.style.display = 'none';
    leaderboard.style.display = 'none';
    start.style.display = 'flex';
}

function showAbout() {
    alert("I literally have no idea what to put here, so i guess enjoy? (The UI looks bad without the extra button)");
}

function handleKeyDown(event) {
    switch (event.key) {
        case "ArrowUp":
            if (direction !== "DOWN") direction = "UP";
            break;
        case "ArrowDown":
            if (direction !== "UP") direction = "DOWN";
            break;
        case "ArrowLeft":
            if (direction !== "RIGHT") direction = "LEFT";
            break;
        case "ArrowRight":
            if (direction !== "LEFT") direction = "RIGHT";
            break;
        case "a":
            ascend();
            break;
    }
}

function endGame() {
      document.getElementById('endScore').innerText = score;
     gameActive = false;
     snakeBody = [];
     saveScore(score);
     game.style.display = 'none';
     gameOver.style.display = 'block';
}

function startGame() {
   score = 0;
   direction = "RIGHT";
   snakeBody = [
        [8, 5],
        [7, 5],
        [6, 5],
        [5, 5]
    ]; //reset the snake body, otherwise we would end the game right at each "Play Again"
    obstacles = [];
    game.style.display = 'block'; //show the game canvas and elements, because im also using this for restarting the game after gameover
    //hide the gameover and start screens, fairly self-explanatory
    start.style.display = 'none';
    gameOver.style.display = 'none'; 
    leaderboard.style.display = 'none'; //just in case
    document.addEventListener("keydown", handleKeyDown); //setup the keyevents
    apple = generateApple(); //generate first apple
    document.getElementById('gameScore').innerText = score;
    gameActive = true;
    requestAnimationFrame(gameLoop);
}

function gameLoop(currentTime) {
    if (currentTime - lastUpdateTime >= gameInterval) {
         if(gameActive) {
            updateSnake();
            renderGame();
         }
         lastUpdateTime = currentTime;
    }

    requestAnimationFrame(gameLoop);
}

if (!localStorage.getItem('highscore')) {
    localStorage.setItem('highscore', 0);
}

if (!localStorage.getItem('topScores')) {
    localStorage.setItem('topScores', JSON.stringify([]));
}

if (!localStorage.getItem('lastGames')) {
    localStorage.setItem('lastGames', JSON.stringify([]));
}
