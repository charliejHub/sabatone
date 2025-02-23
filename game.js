const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set the new canvas width (make it less wide)
canvas.width = 400; // Adjust width to make the game less wide
canvas.height = 550; // Keep height the same

// Load images
const charbelImg = new Image();
charbelImg.src = "charbel.png"; // Bricks

const mikelImg = new Image();
mikelImg.src = "mikel.png"; // Ball

const friendImg = new Image();
friendImg.src = "eddy.png"; // Image of your friend (replace with the actual image URL)

const loseImg = new Image();
loseImg.src = "morg.png"; // Image to show when the player loses

// Ball properties (original size restored)
let ballX = 200, ballY = 400, ballXdir = -5, ballYdir = -6; // Faster speed
const ballSize = 100;

// Paddle properties (smaller for difficulty)
let paddleX = 325, paddleWidth = 100, paddleHeight = 15;

// Brick properties (require 2 hits to break)
const ROWS = 4, COLS = 3; // Adjusted to have only 3 columns of bricks
const BRICK_WIDTH = 100, BRICK_HEIGHT = 50;
let bricks = Array.from({ length: ROWS }, () => Array(COLS).fill(2)); // 2 hits required

let gameOver = false;
let gameWon = false; // To track if the game is won

// Handle key press (for desktop)
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" && paddleX > 0) paddleX -= 40;
    if (e.key === "ArrowRight" && paddleX < canvas.width - paddleWidth) paddleX += 40;
});

// Handle touch events (for mobile)
canvas.addEventListener("touchmove", (e) => {
    const touchX = e.touches[0].clientX; // Get touch position
    const canvasRect = canvas.getBoundingClientRect();
    const canvasX = touchX - canvasRect.left; // Adjust for canvas positioning
    paddleX = canvasX - paddleWidth / 2; // Center the paddle on touch
    paddleX = Math.max(0, Math.min(paddleX, canvas.width - paddleWidth)); // Keep paddle within canvas bounds
    e.preventDefault(); // Prevent default touch behavior (scrolling)
});

// Game loop
function update() {
    if (gameOver || gameWon) return;

    // Move ball
    ballX += ballXdir;
    ballY += ballYdir;

    // Bounce off walls
    if (ballX <= 0 || ballX >= canvas.width - ballSize) ballXdir = -ballXdir;
    if (ballY <= 0) ballYdir = -ballYdir;
    if (ballY >= canvas.height - ballSize) gameOver = true; // Ball falls below

    // Ball & paddle collision
    if (
        ballY + ballSize >= canvas.height - paddleHeight &&
        ballX + ballSize / 2 > paddleX &&
        ballX + ballSize / 2 < paddleX + paddleWidth
    ) {
        ballYdir = -ballYdir;
    }

    // Ball & brick collision
    let bricksLeft = 0;
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            if (bricks[i][j] > 0) {
                let brickX = j * BRICK_WIDTH + 50;
                let brickY = i * BRICK_HEIGHT + 50;
                if (
                    ballX + ballSize > brickX &&
                    ballX < brickX + BRICK_WIDTH &&
                    ballY + ballSize > brickY &&
                    ballY < brickY + BRICK_HEIGHT
                ) {
                    bricks[i][j]--; // Reduce durability
                    ballYdir = -ballYdir;
                }
                bricksLeft++;
            }
        }
    }
    if (bricksLeft === 0) gameWon = true; // All bricks destroyed, game won
}

// Draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw paddle
    ctx.fillStyle = "white";
    ctx.fillRect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);

    // Draw ball (mikel.png)
    ctx.drawImage(mikelImg, ballX, ballY, ballSize, ballSize);

    // Draw bricks (charbel.png)
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            if (bricks[i][j] > 0) {
                let brickX = j * BRICK_WIDTH + 50;
                let brickY = i * BRICK_HEIGHT + 50;
                ctx.globalAlpha = bricks[i][j] === 1 ? 0.5 : 1; // Make damaged bricks semi-transparent
                ctx.drawImage(charbelImg, brickX, brickY, BRICK_WIDTH, BRICK_HEIGHT);
                ctx.globalAlpha = 1;
            }
        }
    }

    // Check for win or game over
    if (gameOver) {
        // Show "You Lost" message with charbel.png
        ctx.drawImage(loseImg, 0, 0, canvas.width, canvas.height); // Draw "You Lost!" image
        ctx.fillStyle = "red";
        ctx.font = "40px Arial";
        ctx.fillText("Khsoret ya hmar", 50, 300); // Optional: Add "You Lost!" text if needed
    } else if (gameWon) {
        // Scale and position the friend's image to fit within the canvas
        const friendImgWidth = 250; // Width of the image
        const friendImgHeight = 250; // Height of the image
        const friendImgX = (canvas.width - friendImgWidth) / 2; // Center image horizontally
        const friendImgY = (canvas.height - friendImgHeight) / 3; // Position image above the text

        // Draw friend's image
        ctx.drawImage(friendImg, friendImgX, friendImgY, friendImgWidth, friendImgHeight);

        // Draw "YOU WIN!" message
        ctx.fillStyle = "green";
        ctx.font = "40px Arial";
        const textWidth = ctx.measureText("mabrouk bro").width;
        const textX = (canvas.width - textWidth) / 2; // Center the text
        const textY = friendImgY + friendImgHeight + 20; // Position below the image
        ctx.fillText("mabrouk bro", textX, textY);
    }
}

// Main loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();
