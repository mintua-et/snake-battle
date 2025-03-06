# Snake Battle

A visually appealing snake game where you control one snake while competing against an autonomous AI snake to eat food and survive the longest.

## Features

- Player-controlled red snake with arrow key controls
- One autonomous blue AI snake as your opponent
- AI snake respawns after dying, allowing continuous gameplay
- Player respawns with 0 points if they die before the game ends
- Compact playing area for quick and intense gameplay
- Pause button at the top right corner for easy access
- Configurable win condition (10, 25, 50, or 100 points) in settings menu
- Start menu, pause menu, and game over screen
- Victory screen announcing the winner
- Visually appealing graphics with p5.js
- Real-time scoreboard
- Grid-based gameplay
- Collision detection (walls, other snakes)
- Food spawning system
- Game ends when either snake reaches the target score

## How to Play

1. Clone this repository
2. Open `index.html` in your web browser
3. Optionally adjust the win score in the Settings menu
4. Click "Start Game" or press Space to begin
5. Control your snake (red) with the arrow keys
6. Press Space or click the pause button to pause/resume the game
7. Try to eat as much food as possible while avoiding collisions
8. If you die, you'll respawn with 0 points as long as the AI hasn't won yet
9. First to reach the target score wins the game!

## Game Controls

- **Arrow Keys**: Control your snake's direction
- **Space Bar**: Start game / Pause / Resume
- **Pause Button**: Click the button at the top right to pause/resume
- **Settings**: Configure game options like win score
- **Mouse**: Click buttons in menus

## Game Rules

- You control the red snake with arrow keys
- The blue snake moves automatically using AI algorithms
- Both snakes try to find the nearest food while avoiding walls and each other
- When a snake eats food, it grows longer and earns a point
- A snake dies if it hits a wall or another snake (including itself)
- If the AI snake dies, it will respawn after a short delay
- If you die, you'll respawn with 0 points (score reset) as long as the AI hasn't reached the target score
- The game ends when either snake reaches the target score (configurable in settings)
- First to reach the target score is declared the winner!

## Technologies Used

- HTML5
- CSS3
- JavaScript
- p5.js library

## Customization

You can customize the game by modifying the `config` object in `sketch.js` or using the in-game settings:

- **In-game Settings**:
  - Win Score: Choose between 10, 25, 50, or 100 points to win

- **Code Customization** (`config` object in `sketch.js`):
  - `canvasWidth` and `canvasHeight`: Change the size of the game area
  - `gridSize`: Change the size of each grid cell
  - `frameRate`: Adjust the speed of the game
  - `foodCount`: Change the amount of food available at once
  - `snakeColors`: Customize the colors of the snakes
  - `foodColor`: Change the color of the food
  - `backgroundColor`: Change the background color
  - `pauseButtonSize`: Change the size of the pause button

## License

This project is open source and available under the MIT License. 