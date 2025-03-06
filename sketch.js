// Game configuration
const config = {
  canvasWidth: 600,
  canvasHeight: 500,
  gridSize: 20,
  frameRate: 7.5,
  snakeCount: 2,
  foodCount: 10,
  snakeColors: [
    [255, 82, 82],   // Red (Player)
    [33, 150, 243],  // Blue (AI)
  ],
  foodColor: [76, 175, 80], // Green
  backgroundColor: [18, 18, 18],
  pauseButtonSize: 40,
  winScore: 25      // Changed from 50 to 25 points needed to win
};

// Game states
const GAME_STATE = {
  MENU: 'menu',
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAME_OVER: 'game_over',
  WIN: 'win',
  SETTINGS: 'settings'
};

// Game state
let snakes = [];
let foods = [];
let scores = [];
let gameState = GAME_STATE.MENU;
let playerDirection = { x: 1, y: 0 };
let nextPlayerDirection = { x: 1, y: 0 };
let selectedWinScore = 25; // Default win score that can be changed by the user

function setup() {
  // Create canvas and place it in the canvas-container
  const canvas = createCanvas(config.canvasWidth, config.canvasHeight);
  canvas.parent('canvas-container');
  
  // Set frame rate
  frameRate(config.frameRate);
  
  // Initialize game
  initGame();
}

function draw() {
  background(config.backgroundColor);
  
  // Draw grid
  drawGrid();
  
  switch (gameState) {
    case GAME_STATE.MENU:
      drawMenu();
      break;
    case GAME_STATE.SETTINGS:
      drawSettings();
      break;
    case GAME_STATE.PLAYING:
      // Update and draw food
      drawFood();
      
      // Update and draw snakes
      updateSnakes();
      drawSnakes();
      
      // Update scoreboard
      updateScoreboard();
      
      // Draw pause button
      drawPauseButton();
      break;
    case GAME_STATE.PAUSED:
      // Draw food and snakes in their current state
      drawFood();
      drawSnakes();
      drawPauseMenu();
      
      // Draw pause button (in play state)
      drawPauseButton(true);
      break;
    case GAME_STATE.GAME_OVER:
      // Draw food and snakes in their current state
      drawFood();
      drawSnakes();
      drawGameOver();
      break;
    case GAME_STATE.WIN:
      // Draw food and snakes in their current state
      drawFood();
      drawSnakes();
      drawWinScreen();
      break;
  }
}

function keyPressed() {
  // Handle player controls
  if (gameState === GAME_STATE.PLAYING) {
    if (keyCode === UP_ARROW && playerDirection.y !== 1) {
      nextPlayerDirection = { x: 0, y: -1 };
    } else if (keyCode === DOWN_ARROW && playerDirection.y !== -1) {
      nextPlayerDirection = { x: 0, y: 1 };
    } else if (keyCode === LEFT_ARROW && playerDirection.x !== 1) {
      nextPlayerDirection = { x: -1, y: 0 };
    } else if (keyCode === RIGHT_ARROW && playerDirection.x !== -1) {
      nextPlayerDirection = { x: 1, y: 0 };
    }
  }
  
  // Handle game state controls
  if (keyCode === 32) { // Space bar
    if (gameState === GAME_STATE.MENU) {
      startGame();
    } else if (gameState === GAME_STATE.PLAYING) {
      gameState = GAME_STATE.PAUSED;
    } else if (gameState === GAME_STATE.PAUSED) {
      gameState = GAME_STATE.PLAYING;
    } else if (gameState === GAME_STATE.SETTINGS) {
      gameState = GAME_STATE.MENU;
    } else if (gameState === GAME_STATE.GAME_OVER || gameState === GAME_STATE.WIN) {
      initGame();
      gameState = GAME_STATE.MENU;
    }
  }
  
  // Handle escape key to go back to menu
  if (keyCode === 27) { // ESC key
    if (gameState === GAME_STATE.SETTINGS) {
      gameState = GAME_STATE.MENU;
    }
  }
  
  // Prevent default behavior for arrow keys (scrolling)
  if (keyCode === UP_ARROW || keyCode === DOWN_ARROW || 
      keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW || 
      keyCode === 32) {
    return false;
  }
}

function mousePressed() {
  // Check if pause button is clicked
  if ((gameState === GAME_STATE.PLAYING || gameState === GAME_STATE.PAUSED)) {
    const x = config.canvasWidth - config.pauseButtonSize - 10;
    const y = 10;
    const size = config.pauseButtonSize;
    
    if (mouseX >= x && mouseX <= x + size && mouseY >= y && mouseY <= y + size) {
      if (gameState === GAME_STATE.PLAYING) {
        gameState = GAME_STATE.PAUSED;
      } else {
        gameState = GAME_STATE.PLAYING;
      }
      return; // Don't process other clicks if pause button was clicked
    }
  }
  
  // Handle button clicks in menus
  if (gameState === GAME_STATE.MENU) {
    const buttonWidth = 200;
    const buttonHeight = 60;
    
    // Check if start button is clicked
    const startButtonX = config.canvasWidth / 2;
    const startButtonY = config.canvasHeight / 2;
    
    if (mouseX >= startButtonX - buttonWidth/2 && 
        mouseX <= startButtonX + buttonWidth/2 && 
        mouseY >= startButtonY - buttonHeight/2 && 
        mouseY <= startButtonY + buttonHeight/2) {
      startGame();
      return;
    }
    
    // Check if settings button is clicked
    const settingsButtonX = config.canvasWidth / 2;
    const settingsButtonY = config.canvasHeight / 2 + 80;
    
    if (mouseX >= settingsButtonX - buttonWidth/2 && 
        mouseX <= settingsButtonX + buttonWidth/2 && 
        mouseY >= settingsButtonY - buttonHeight/2 && 
        mouseY <= settingsButtonY + buttonHeight/2) {
      gameState = GAME_STATE.SETTINGS;
      return;
    }
  } else if (gameState === GAME_STATE.SETTINGS) {
    // Handle win score selection
    const scoreOptions = [10, 25, 50, 100];
    const buttonWidth = 70;
    const buttonSpacing = 20;
    const totalWidth = scoreOptions.length * buttonWidth + (scoreOptions.length - 1) * buttonSpacing;
    let startX = config.canvasWidth / 2 - totalWidth / 2;
    const y = config.canvasHeight / 2;
    
    // Check if any score option is clicked
    for (let i = 0; i < scoreOptions.length; i++) {
      const score = scoreOptions[i];
      const x = startX + i * (buttonWidth + buttonSpacing);
      
      if (mouseX >= x && mouseX <= x + buttonWidth && 
          mouseY >= y - 20 && mouseY <= y + 20) {
        selectedWinScore = score;
        // Update the config win score
        config.winScore = selectedWinScore;
        return;
      }
    }
    
    // Check if back button is clicked
    const backButtonX = config.canvasWidth / 2;
    const backButtonY = config.canvasHeight / 2 + 100;
    const buttonWidth2 = 200;
    const buttonHeight2 = 60;
    
    if (mouseX >= backButtonX - buttonWidth2/2 && 
        mouseX <= backButtonX + buttonWidth2/2 && 
        mouseY >= backButtonY - buttonHeight2/2 && 
        mouseY <= backButtonY + buttonHeight2/2) {
      gameState = GAME_STATE.MENU;
      return;
    }
  } else if (gameState === GAME_STATE.PAUSED) {
    // Check if resume button is clicked
    const resumeButtonX = config.canvasWidth / 2;
    const resumeButtonY = config.canvasHeight / 2;
    const buttonWidth = 200;
    const buttonHeight = 60;
    
    if (mouseX >= resumeButtonX - buttonWidth/2 && 
        mouseX <= resumeButtonX + buttonWidth/2 && 
        mouseY >= resumeButtonY - buttonHeight/2 && 
        mouseY <= resumeButtonY + buttonHeight/2) {
      gameState = GAME_STATE.PLAYING;
    }
    
    // Check if menu button is clicked
    const menuButtonX = config.canvasWidth / 2;
    const menuButtonY = config.canvasHeight / 2 + 80;
    
    if (mouseX >= menuButtonX - buttonWidth/2 && 
        mouseX <= menuButtonX + buttonWidth/2 && 
        mouseY >= menuButtonY - buttonHeight/2 && 
        mouseY <= menuButtonY + buttonHeight/2) {
      initGame();
      gameState = GAME_STATE.MENU;
    }
  } else if (gameState === GAME_STATE.GAME_OVER || gameState === GAME_STATE.WIN) {
    // Check if restart button is clicked
    const restartButtonX = config.canvasWidth / 2;
    const restartButtonY = config.canvasHeight / 2 + 50;
    const buttonWidth = 200;
    const buttonHeight = 60;
    
    if (mouseX >= restartButtonX - buttonWidth/2 && 
        mouseX <= restartButtonX + buttonWidth/2 && 
        mouseY >= restartButtonY - buttonHeight/2 && 
        mouseY <= restartButtonY + buttonHeight/2) {
      startGame();
    }
    
    // Check if menu button is clicked
    const menuButtonX = config.canvasWidth / 2;
    const menuButtonY = config.canvasHeight / 2 + 130;
    
    if (mouseX >= menuButtonX - buttonWidth/2 && 
        mouseX <= menuButtonX + buttonWidth/2 && 
        mouseY >= menuButtonY - buttonHeight/2 && 
        mouseY <= menuButtonY + buttonHeight/2) {
      initGame();
      gameState = GAME_STATE.MENU;
    }
  }
}

function startGame() {
  initGame();
  gameState = GAME_STATE.PLAYING;
}

function initGame() {
  // Initialize snakes
  snakes = [];
  scores = Array(config.snakeCount).fill(0);
  playerDirection = { x: 1, y: 0 };
  nextPlayerDirection = { x: 1, y: 0 };
  
  // Set the win score from the user selection
  config.winScore = selectedWinScore;
  
  for (let i = 0; i < config.snakeCount; i++) {
    // Place snakes in different areas of the grid
    const x = floor(random(2, config.canvasWidth / config.gridSize - 2)) * config.gridSize;
    const y = floor(random(2, config.canvasHeight / config.gridSize - 2)) * config.gridSize;
    
    snakes.push({
      body: [{x, y}],
      direction: i === 0 ? playerDirection : randomDirection(),
      color: config.snakeColors[i],
      alive: true,
      id: i,
      isPlayer: i === 0 // First snake is the player
    });
  }
  
  // Initialize food
  spawnFood(config.foodCount);
  
  // Initialize scoreboard
  initScoreboard();
}

function randomDirection() {
  const directions = [{x: 1, y: 0}, {x: 0, y: 1}, {x: -1, y: 0}, {x: 0, y: -1}];
  return directions[floor(random(4))];
}

function spawnFood(count) {
  foods = [];
  for (let i = 0; i < count; i++) {
    addNewFood();
  }
}

function addNewFood() {
  let newFood;
  let validPosition = false;
  
  // Try to find a valid position for the food
  while (!validPosition) {
    const x = floor(random(1, config.canvasWidth / config.gridSize - 1)) * config.gridSize;
    const y = floor(random(1, config.canvasHeight / config.gridSize - 1)) * config.gridSize;
    newFood = {x, y};
    
    // Check if position is valid (not on a snake)
    validPosition = true;
    for (const snake of snakes) {
      for (const segment of snake.body) {
        if (segment.x === newFood.x && segment.y === newFood.y) {
          validPosition = false;
          break;
        }
      }
      if (!validPosition) break;
    }
    
    // Check if position is not on another food
    if (validPosition) {
      for (const food of foods) {
        if (food.x === newFood.x && food.y === newFood.y) {
          validPosition = false;
          break;
        }
      }
    }
  }
  
  foods.push(newFood);
}

function drawGrid() {
  stroke(40);
  strokeWeight(1);
  
  // Draw vertical lines
  for (let x = 0; x <= config.canvasWidth; x += config.gridSize) {
    line(x, 0, x, config.canvasHeight);
  }
  
  // Draw horizontal lines
  for (let y = 0; y <= config.canvasHeight; y += config.gridSize) {
    line(0, y, config.canvasWidth, y);
  }
}

function drawFood() {
  noStroke();
  fill(config.foodColor);
  
  for (const food of foods) {
    // Draw food with a pulsating effect
    const pulseSize = sin(frameCount * 0.1) * 2;
    const size = config.gridSize - 4 + pulseSize;
    
    // Draw a circle for the food
    circle(food.x + config.gridSize / 2, food.y + config.gridSize / 2, size);
  }
}

function updateSnakes() {
  // Update player direction
  if (snakes[0] && snakes[0].alive) {
    playerDirection = nextPlayerDirection;
    snakes[0].direction = playerDirection;
  }
  
  for (let i = 0; i < snakes.length; i++) {
    const snake = snakes[i];
    if (!snake.alive) continue;
    
    // AI decision making for non-player snakes
    if (!snake.isPlayer) {
      decideDirection(snake, i);
    }
    
    // Move snake
    const head = {
      x: snake.body[0].x + snake.direction.x * config.gridSize,
      y: snake.body[0].y + snake.direction.y * config.gridSize
    };
    
    // Check for collisions with walls
    if (head.x < 0 || head.x >= config.canvasWidth || 
        head.y < 0 || head.y >= config.canvasHeight) {
      snake.alive = false;
      
      // If player died
      if (snake.isPlayer) {
        // Check if AI is alive and hasn't reached win score
        if (snakes[1] && snakes[1].alive && scores[1] < config.winScore) {
          // Respawn player after a delay
          setTimeout(() => {
            respawnPlayer();
          }, 2000);
        } else {
          // Otherwise game over
          setTimeout(() => {
            gameState = GAME_STATE.GAME_OVER;
          }, 1000);
        }
      } else {
        // If AI snake died, respawn it after a delay
        setTimeout(() => {
          respawnAISnake();
        }, 3000);
      }
      continue;
    }
    
    // Check for collisions with self or other snakes
    let collision = false;
    for (const otherSnake of snakes) {
      for (const segment of otherSnake.body) {
        if (head.x === segment.x && head.y === segment.y) {
          collision = true;
          break;
        }
      }
      if (collision) break;
    }
    
    if (collision) {
      snake.alive = false;
      
      // If player died
      if (snake.isPlayer) {
        // Check if AI is alive and hasn't reached win score
        if (snakes[1] && snakes[1].alive && scores[1] < config.winScore) {
          // Respawn player after a delay
          setTimeout(() => {
            respawnPlayer();
          }, 2000);
        } else {
          // Otherwise game over
          setTimeout(() => {
            gameState = GAME_STATE.GAME_OVER;
          }, 1000);
        }
      } else {
        // If AI snake died, respawn it after a delay
        setTimeout(() => {
          respawnAISnake();
        }, 3000);
      }
      continue;
    }
    
    // Add new head
    snake.body.unshift(head);
    
    // Check if snake ate food
    let foodEaten = false;
    for (let j = 0; j < foods.length; j++) {
      if (head.x === foods[j].x && head.y === foods[j].y) {
        foods.splice(j, 1);
        scores[i]++;
        foodEaten = true;
        addNewFood();
        
        // Check if this snake has reached the win score
        if (scores[i] >= config.winScore) {
          setTimeout(() => {
            gameState = GAME_STATE.WIN;
          }, 1000);
        }
        
        break;
      }
    }
    
    // Remove tail if no food was eaten
    if (!foodEaten) {
      snake.body.pop();
    }
  }
}

function decideDirection(snake, index) {
  // Simple AI for snake movement
  // 1. Try to find the nearest food
  // 2. Try to avoid walls and other snakes
  
  const head = snake.body[0];
  let nearestFood = null;
  let minDistance = Infinity;
  
  // Find the nearest food
  for (const food of foods) {
    const distance = abs(head.x - food.x) + abs(head.y - food.y);
    if (distance < minDistance) {
      minDistance = distance;
      nearestFood = food;
    }
  }
  
  if (!nearestFood) return;
  
  // Possible directions
  const directions = [
    {x: 1, y: 0},   // right
    {x: 0, y: 1},   // down
    {x: -1, y: 0},  // left
    {x: 0, y: -1}   // up
  ];
  
  // Filter out the opposite of current direction (can't go backwards)
  const validDirections = directions.filter(dir => 
    !(dir.x === -snake.direction.x && dir.y === -snake.direction.y)
  );
  
  // Score each direction
  const directionScores = validDirections.map(dir => {
    const newX = head.x + dir.x * config.gridSize;
    const newY = head.y + dir.y * config.gridSize;
    
    // Check if this direction leads to a wall
    if (newX < 0 || newX >= config.canvasWidth || 
        newY < 0 || newY >= config.canvasHeight) {
      return -1000;
    }
    
    // Check if this direction leads to a snake
    for (const otherSnake of snakes) {
      for (const segment of otherSnake.body) {
        if (newX === segment.x && newY === segment.y) {
          return -1000;
        }
      }
    }
    
    // Score based on distance to food
    const distanceToFood = abs(newX - nearestFood.x) + abs(newY - nearestFood.y);
    return -distanceToFood;
  });
  
  // Find the best direction
  let bestScore = -Infinity;
  let bestIndex = 0;
  
  for (let i = 0; i < directionScores.length; i++) {
    if (directionScores[i] > bestScore) {
      bestScore = directionScores[i];
      bestIndex = i;
    }
  }
  
  // Add some randomness to make it more interesting
  if (random() < 0.1) {
    bestIndex = floor(random(validDirections.length));
  }
  
  // Set the new direction
  if (bestScore > -1000) {
    snake.direction = validDirections[bestIndex];
  } else {
    // If all directions are bad, just pick a random valid one
    snake.direction = validDirections[floor(random(validDirections.length))];
  }
}

// Function to respawn the AI snake
function respawnAISnake() {
  // Only respawn if the game is still playing and player is alive
  if (gameState === GAME_STATE.PLAYING && snakes[0] && snakes[0].alive) {
    // Find a safe position for the new snake
    let validPosition = false;
    let x, y;
    
    while (!validPosition) {
      x = floor(random(2, config.canvasWidth / config.gridSize - 2)) * config.gridSize;
      y = floor(random(2, config.canvasHeight / config.gridSize - 2)) * config.gridSize;
      
      // Check if position is not on player snake
      validPosition = true;
      for (const segment of snakes[0].body) {
        if (segment.x === x && segment.y === y) {
          validPosition = false;
          break;
        }
      }
      
      // Check if position is not on food
      if (validPosition) {
        for (const food of foods) {
          if (food.x === x && food.y === y) {
            validPosition = false;
            break;
          }
        }
      }
    }
    
    // Reset the AI snake
    snakes[1] = {
      body: [{x, y}],
      direction: randomDirection(),
      color: config.snakeColors[1],
      alive: true,
      id: 1,
      isPlayer: false
    };
    
    // Reset AI score
    scores[1] = 0;
    
    // Update scoreboard
    updateScoreboard();
  }
}

function drawSnakes() {
  for (let i = 0; i < snakes.length; i++) {
    const snake = snakes[i];
    
    // Set snake color
    fill(snake.color);
    
    // Draw each segment of the snake
    for (let j = 0; j < snake.body.length; j++) {
      const segment = snake.body[j];
      
      if (j === 0) {
        // Draw head
        noStroke();
        rect(segment.x, segment.y, config.gridSize, config.gridSize, 5);
        
        // Draw eyes
        fill(0);
        const eyeSize = config.gridSize / 5;
        const eyeOffset = config.gridSize / 4;
        
        if (snake.direction.x === 1) {
          // Right
          ellipse(segment.x + config.gridSize - eyeOffset, segment.y + eyeOffset, eyeSize);
          ellipse(segment.x + config.gridSize - eyeOffset, segment.y + config.gridSize - eyeOffset, eyeSize);
        } else if (snake.direction.x === -1) {
          // Left
          ellipse(segment.x + eyeOffset, segment.y + eyeOffset, eyeSize);
          ellipse(segment.x + eyeOffset, segment.y + config.gridSize - eyeOffset, eyeSize);
        } else if (snake.direction.y === 1) {
          // Down
          ellipse(segment.x + eyeOffset, segment.y + config.gridSize - eyeOffset, eyeSize);
          ellipse(segment.x + config.gridSize - eyeOffset, segment.y + config.gridSize - eyeOffset, eyeSize);
        } else {
          // Up
          ellipse(segment.x + eyeOffset, segment.y + eyeOffset, eyeSize);
          ellipse(segment.x + config.gridSize - eyeOffset, segment.y + eyeOffset, eyeSize);
        }
        
        // Add a crown to the player snake
        if (snake.isPlayer) {
          fill(255, 215, 0); // Gold color
          triangle(
            segment.x + config.gridSize / 2, segment.y - 5,
            segment.x + config.gridSize / 4, segment.y + 5,
            segment.x + config.gridSize * 3/4, segment.y + 5
          );
        }
        
        fill(snake.color);
      } else {
        // Draw body segments with slight transparency for a trail effect
        const alpha = map(j, 0, snake.body.length, 255, 150);
        fill(snake.color[0], snake.color[1], snake.color[2], alpha);
        noStroke();
        
        // Draw rounded rectangles for body segments
        rect(segment.x, segment.y, config.gridSize, config.gridSize, 2);
      }
    }
  }
}

function drawMenu() {
  // Draw title
  fill(255);
  textSize(48);
  textAlign(CENTER, CENTER);
  text("Snake Battle", config.canvasWidth / 2, config.canvasHeight / 4);
  
  // Draw subtitle
  textSize(24);
  text("Control the red snake with arrow keys", config.canvasWidth / 2, config.canvasHeight / 4 + 50);
  
  // Draw additional info
  textSize(18);
  text("Compete against the blue AI snake", config.canvasWidth / 2, config.canvasHeight / 4 + 85);
  
  // Draw start button
  drawButton("Start Game", config.canvasWidth / 2, config.canvasHeight / 2, 200, 60);
  
  // Draw settings button
  drawButton("Settings", config.canvasWidth / 2, config.canvasHeight / 2 + 80, 200, 60);
  
  // Draw win score info
  textSize(16);
  fill(76, 175, 80); // Green color for emphasis
  text(`First to reach ${selectedWinScore} points wins!`, config.canvasWidth / 2, config.canvasHeight / 2 + 150);
  
  // Draw controls info
  fill(255); // Reset to white
  textSize(16);
  text("Controls: Arrow Keys to move, Space to pause", config.canvasWidth / 2, config.canvasHeight - 20);
}

function drawPauseMenu() {
  // Semi-transparent overlay
  fill(0, 0, 0, 150);
  rect(0, 0, config.canvasWidth, config.canvasHeight);
  
  // Draw title
  fill(255);
  textSize(48);
  textAlign(CENTER, CENTER);
  text("Game Paused", config.canvasWidth / 2, config.canvasHeight / 3);
  
  // Draw resume button
  drawButton("Resume", config.canvasWidth / 2, config.canvasHeight / 2, 200, 60);
  
  // Draw menu button
  drawButton("Main Menu", config.canvasWidth / 2, config.canvasHeight / 2 + 80, 200, 60);
}

function drawGameOver() {
  // Semi-transparent overlay
  fill(0, 0, 0, 150);
  rect(0, 0, config.canvasWidth, config.canvasHeight);
  
  // Draw title
  fill(255);
  textSize(48);
  textAlign(CENTER, CENTER);
  text("Game Over", config.canvasWidth / 2, config.canvasHeight / 3);
  
  // Draw score
  textSize(24);
  text(`Your Score: ${scores[0]}`, config.canvasWidth / 2, config.canvasHeight / 3 + 60);
  
  // Draw restart button
  drawButton("Play Again", config.canvasWidth / 2, config.canvasHeight / 2 + 50, 200, 60);
  
  // Draw menu button
  drawButton("Main Menu", config.canvasWidth / 2, config.canvasHeight / 2 + 130, 200, 60);
}

function drawButton(label, x, y, width, height) {
  // Check if mouse is over button
  const isHovered = mouseX >= x - width/2 && mouseX <= x + width/2 && 
                    mouseY >= y - height/2 && mouseY <= y + height/2;
  
  // Button background
  if (isHovered) {
    fill(76, 175, 80); // Green when hovered
  } else {
    fill(50, 120, 50); // Darker green normally
  }
  
  // Draw button
  noStroke();
  rect(x - width/2, y - height/2, width, height, 10);
  
  // Button text
  fill(255);
  textSize(24);
  textAlign(CENTER, CENTER);
  text(label, x, y);
}

function initScoreboard() {
  const scoresList = document.getElementById('scores');
  scoresList.innerHTML = '';
  
  for (let i = 0; i < config.snakeCount; i++) {
    const li = document.createElement('li');
    li.className = `snake-${i}`;
    li.textContent = i === 0 ? `You: 0` : `Snake ${i}: 0`;
    scoresList.appendChild(li);
  }
}

function updateScoreboard() {
  const scoresList = document.getElementById('scores');
  const items = scoresList.getElementsByTagName('li');
  
  for (let i = 0; i < config.snakeCount; i++) {
    items[i].textContent = i === 0 ? `You: ${scores[i]}` : `Snake ${i}: ${scores[i]}`;
    
    // Add visual indicator if snake is dead
    if (!snakes[i].alive) {
      items[i].textContent += ' (Dead)';
      items[i].style.opacity = '0.5';
    } else {
      items[i].style.opacity = '1';
    }
  }
}

// Function to draw the pause button
function drawPauseButton(isPlaying = false) {
  // Position at top right with some margin
  const x = config.canvasWidth - config.pauseButtonSize - 10;
  const y = 10;
  const size = config.pauseButtonSize;
  
  // Check if mouse is over button
  const isHovered = mouseX >= x && mouseX <= x + size && 
                    mouseY >= y && mouseY <= y + size;
  
  // Button background
  if (isHovered) {
    fill(76, 175, 80, 220); // Green when hovered
  } else {
    fill(50, 120, 50, 180); // Darker green normally
  }
  
  // Draw button background
  noStroke();
  rect(x, y, size, size, 5);
  
  // Draw pause/play icon
  stroke(255);
  strokeWeight(2);
  if (isPlaying) { // Draw play triangle
    fill(255);
    triangle(
      x + size * 0.3, y + size * 0.25,
      x + size * 0.3, y + size * 0.75,
      x + size * 0.75, y + size * 0.5
    );
  } else { // Draw pause bars
    fill(255);
    rect(x + size * 0.3, y + size * 0.25, size * 0.15, size * 0.5, 2);
    rect(x + size * 0.55, y + size * 0.25, size * 0.15, size * 0.5, 2);
  }
}

function drawWinScreen() {
  // Semi-transparent overlay
  fill(0, 0, 0, 150);
  rect(0, 0, config.canvasWidth, config.canvasHeight);
  
  // Determine the winner
  let winnerText = "";
  let winnerColor;
  
  if (scores[0] >= config.winScore) {
    winnerText = "You Win!";
    winnerColor = config.snakeColors[0];
  } else if (scores[1] >= config.winScore) {
    winnerText = "AI Wins!";
    winnerColor = config.snakeColors[1];
  }
  
  // Draw title with winner's color
  fill(winnerColor);
  textSize(48);
  textAlign(CENTER, CENTER);
  text(winnerText, config.canvasWidth / 2, config.canvasHeight / 3);
  
  // Draw score
  fill(255);
  textSize(24);
  text(`Final Score: ${scores[0]} - ${scores[1]}`, config.canvasWidth / 2, config.canvasHeight / 3 + 60);
  
  // Draw restart button
  drawButton("Play Again", config.canvasWidth / 2, config.canvasHeight / 2 + 50, 200, 60);
  
  // Draw menu button
  drawButton("Main Menu", config.canvasWidth / 2, config.canvasHeight / 2 + 130, 200, 60);
}

// Function to respawn the player
function respawnPlayer() {
  // Only respawn if the game is still playing and AI is alive and hasn't reached win score
  if (gameState === GAME_STATE.PLAYING && snakes[1] && snakes[1].alive && scores[1] < selectedWinScore) {
    // Find a safe position for the player
    let validPosition = false;
    let x, y;
    
    while (!validPosition) {
      x = floor(random(2, config.canvasWidth / config.gridSize - 2)) * config.gridSize;
      y = floor(random(2, config.canvasHeight / config.gridSize - 2)) * config.gridSize;
      
      // Check if position is not on AI snake
      validPosition = true;
      for (const segment of snakes[1].body) {
        if (segment.x === x && segment.y === y) {
          validPosition = false;
          break;
        }
      }
      
      // Check if position is not on food
      if (validPosition) {
        for (const food of foods) {
          if (food.x === x && food.y === y) {
            validPosition = false;
            break;
          }
        }
      }
    }
    
    // Reset the player snake
    snakes[0] = {
      body: [{x, y}],
      direction: { x: 1, y: 0 },
      color: config.snakeColors[0],
      alive: true,
      id: 0,
      isPlayer: true
    };
    
    // Reset player direction
    playerDirection = { x: 1, y: 0 };
    nextPlayerDirection = { x: 1, y: 0 };
    
    // Reset player score
    scores[0] = 0;
    
    // Update scoreboard
    updateScoreboard();
    
    // Show respawn message
    showRespawnMessage();
  }
}

// Function to show a temporary respawn message
function showRespawnMessage() {
  const messageDiv = document.createElement('div');
  messageDiv.textContent = 'You died! Respawning with 0 points...';
  messageDiv.style.position = 'absolute';
  messageDiv.style.top = '50%';
  messageDiv.style.left = '50%';
  messageDiv.style.transform = 'translate(-50%, -50%)';
  messageDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  messageDiv.style.color = '#fff';
  messageDiv.style.padding = '20px';
  messageDiv.style.borderRadius = '10px';
  messageDiv.style.fontSize = '18px';
  messageDiv.style.fontWeight = 'bold';
  messageDiv.style.zIndex = '1000';
  
  document.body.appendChild(messageDiv);
  
  // Remove the message after 2 seconds
  setTimeout(() => {
    document.body.removeChild(messageDiv);
  }, 2000);
}

// Function to draw the settings screen
function drawSettings() {
  // Semi-transparent overlay
  fill(0, 0, 0, 150);
  rect(0, 0, config.canvasWidth, config.canvasHeight);
  
  // Draw title
  fill(255);
  textSize(48);
  textAlign(CENTER, CENTER);
  text("Settings", config.canvasWidth / 2, config.canvasHeight / 4);
  
  // Draw win score selector
  textSize(24);
  text("Points to Win:", config.canvasWidth / 2, config.canvasHeight / 2 - 50);
  
  // Draw score options
  const scoreOptions = [10, 25, 50, 100];
  const buttonWidth = 70;
  const buttonSpacing = 20;
  const totalWidth = scoreOptions.length * buttonWidth + (scoreOptions.length - 1) * buttonSpacing;
  let startX = config.canvasWidth / 2 - totalWidth / 2;
  
  for (let i = 0; i < scoreOptions.length; i++) {
    const score = scoreOptions[i];
    const x = startX + i * (buttonWidth + buttonSpacing);
    const y = config.canvasHeight / 2;
    
    // Highlight selected score
    if (score === selectedWinScore) {
      fill(76, 175, 80); // Green for selected
    } else {
      fill(50, 50, 50); // Dark gray for unselected
    }
    
    rect(x, y - 20, buttonWidth, 40, 5);
    
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(20);
    text(score, x + buttonWidth / 2, y);
  }
  
  // Draw back button
  drawButton("Back to Menu", config.canvasWidth / 2, config.canvasHeight / 2 + 100, 200, 60);
} 