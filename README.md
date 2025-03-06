# Snake Battle

A visually appealing snake game where you control one snake while competing against an autonomous AI snake to eat food and survive the longest.

## Features

- Player-controlled red snake with arrow key controls
- One autonomous blue AI snake as your opponent
- AI snake respawns after dying, allowing continuous gameplay
- Player respawns with 0 points if they die before the game ends
- Compact playing area for quick and intense gameplay
- Pause button at the top right corner for easy access
- Win condition: First to reach 50 points wins!
- Start menu, pause menu, and game over screen
- Victory screen announcing the winner
- Visually appealing graphics with p5.js
- Real-time scoreboard
- Grid-based gameplay
- Collision detection (walls, other snakes)
- Food spawning system
- Game ends when either snake reaches 50 points

## How to Play

1. Clone this repository
2. Open `index.html` in your web browser
3. Click "Start Game" or press Space to begin
4. Control your snake (red) with the arrow keys
5. Press Space or click the pause button to pause/resume the game
6. Try to eat as much food as possible while avoiding collisions
7. If you die, you'll respawn with 0 points as long as the AI hasn't won yet
8. First to reach 50 points wins the game!

## Game Controls

- **Arrow Keys**: Control your snake's direction
- **Space Bar**: Start game / Pause / Resume
- **Pause Button**: Click the button at the top right to pause/resume
- **Mouse**: Click buttons in menus

## Game Rules

- You control the red snake with arrow keys
- The blue snake moves automatically using AI algorithms
- Both snakes try to find the nearest food while avoiding walls and each other
- When a snake eats food, it grows longer and earns a point
- A snake dies if it hits a wall or another snake (including itself)
- If the AI snake dies, it will respawn after a short delay
- If you die, you'll respawn with 0 points (score reset) as long as the AI hasn't reached 50 points
- The game ends when either snake reaches 50 points
- First to reach 50 points is declared the winner!

## Technologies Used

- HTML5
- CSS3
- JavaScript
- p5.js library

## Customization

You can customize the game by modifying the `config` object in `sketch.js`:

- `canvasWidth` and `canvasHeight`: Change the size of the game area
- `gridSize`: Change the size of each grid cell
- `frameRate`: Adjust the speed of the game
- `foodCount`: Change the amount of food available at once
- `snakeColors`: Customize the colors of the snakes
- `foodColor`: Change the color of the food
- `backgroundColor`: Change the background color
- `pauseButtonSize`: Change the size of the pause button
- `winScore`: Change the number of points needed to win (default: 50)

## License

This project is open source and available under the MIT License. 