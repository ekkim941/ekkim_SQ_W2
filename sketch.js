// ============================================================
// Week 2 Example 1: Modified with Assets and Slime Platform
// ============================================================

// --- IMAGE VARIABLES ---
let playerImg;
let backgroundImg;

// ------------------------------------------------------------
// THE PLAYER OBJECT
// ------------------------------------------------------------
let player = {
  x: 200,
  y: 100,

  vx: 0,
  vy: 0,

  // Since we are using an image, we'll track half-width and half-height
  // as the "radius" for quick boundary and collision math.
  r: 24,

  speed: 0.5,
  maxSpeed: 4,
  jumpForce: -12,
  friction: 0.8,

  onGround: false,
};

// ------------------------------------------------------------
// THE SLIME PLATFORM OBJECT
// ------------------------------------------------------------
let slimePlatform = {
  x: 400, // Center X position of the platform
  y: 300, // Top surface Y position
  w: 120, // Width of the platform
  h: 25, // Height of the platform
  bounceForce: -18, // Stronger than a regular jump!
};

// ------------------------------------------------------------
// PHYSICS CONSTANTS
// ------------------------------------------------------------
const GRAVITY = 0.6;

// Floor position — where the ground is
let floorY;

// ============================================================
// preload()
// This function ensures all images are completely loaded before
// setup() runs, preventing "undefined" image rendering errors.
// ============================================================
function preload() {
  // Replace these URLs with your local file paths (e.g., "assets/character.png")
  playerImg = loadImage("assets/images/sponge.png");
  backgroundImg = loadImage("assets/images/krust.jpg");
}

// ============================================================
// setup()
// ============================================================
function setup() {
  createCanvas(800, 450);
  floorY = height - 40;
  player.y = floorY - player.r;
}

// ============================================================
// draw()
// ============================================================
function draw() {
  // 1. Draw Background Image instead of a solid color
  // coordinates (0,0) at the canvas size guarantees it fits perfectly
  image(backgroundImg, 0, 0, width, height);

  drawFloor();
  drawSlimePlatform(); // Draw the new platform
  handleInput();
  applyPhysics();
  drawPlayer();
  drawHUD();
}

// ------------------------------------------------------------
// handleInput()
// ------------------------------------------------------------
function handleInput() {
  // --- Horizontal movement ---
  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
    player.vx -= player.speed;
  }
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
    player.vx += player.speed;
  }

  player.vx = constrain(player.vx, -player.maxSpeed, player.maxSpeed);

  if (
    !keyIsDown(LEFT_ARROW) &&
    !keyIsDown(65) &&
    !keyIsDown(RIGHT_ARROW) &&
    !keyIsDown(68)
  ) {
    player.vx *= player.friction;
  }

  // --- Jump ---
  if ((keyIsDown(UP_ARROW) || keyIsDown(87)) && player.onGround) {
    player.vy = player.jumpForce;
    player.onGround = false;
  }
}

// ------------------------------------------------------------
// applyPhysics()
// ------------------------------------------------------------
function applyPhysics() {
  // 1. Apply gravity
  player.vy += GRAVITY;

  // 2. Move player by its current velocity
  player.x += player.vx;
  player.y += player.vy;

  // 3. Regular Floor collision
  if (player.y + player.r >= floorY) {
    player.y = floorY - player.r;
    player.vy = 0;
    player.onGround = true;
  } else {
    player.onGround = false;
  }

  // 4. NEW: Slime Platform Collision Check
  // We check if the player's horizontal footprint falls within the platform's width,
  // AND if the player's feet are crossing the top surface while moving downwards (vy > 0).
  if (
    player.x + player.r > slimePlatform.x - slimePlatform.w / 2 &&
    player.x - player.r < slimePlatform.x + slimePlatform.w / 2 &&
    player.y + player.r >= slimePlatform.y &&
    player.y + player.r <= slimePlatform.y + slimePlatform.h &&
    player.vy > 0
  ) {
    player.y = slimePlatform.y - player.r; // snap to top of slime block
    player.vy = slimePlatform.bounceForce; // Launch them up!
    player.onGround = false; // They are immediately airborne
  }

  // 5. Wall collision — keep player inside canvas
  player.x = constrain(player.x, player.r, width - player.r);
}

// ------------------------------------------------------------
// drawPlayer()
// ------------------------------------------------------------
function drawPlayer() {
  push();

  // By default, p5 draws images from the top-left corner.
  // imageMode(CENTER) tells it to place the middle of the image at player.x and player.y
  imageMode(CENTER);

  // Draw your loaded character png. We multiply player.r by 2 to match the bounding width.
  image(playerImg, player.x, player.y, player.r * 2, player.r * 2);

  pop();
}

// ------------------------------------------------------------
// drawSlimePlatform()
// Draws the new platform centered around its defined X coordinate.
// ------------------------------------------------------------
function drawSlimePlatform() {
  push();
  rectMode(CENTER); // Draw from the center to match our collision logic easily

  // Vibrant slime green
  fill(50, 220, 90);
  stroke(30, 150, 60);
  strokeWeight(3);

  rect(
    slimePlatform.x,
    slimePlatform.y + slimePlatform.h / 2,
    slimePlatform.w,
    slimePlatform.h,
    5,
  );
  pop();
}

// ------------------------------------------------------------
// drawFloor()
// ------------------------------------------------------------
function drawFloor() {
  fill(40, 120, 110);
  noStroke();
  rect(0, floorY, width, height - floorY);
}

// ------------------------------------------------------------
// drawHUD()
// ------------------------------------------------------------
function drawHUD() {
  fill(255); // Changed to white so it stands out against custom backgrounds
  noStroke();
  textSize(13);
  textAlign(LEFT);
  text(
    "Move: Arrow Keys or WASD   Jump: W or Up Arrow   Land on Green for a Boost!",
    16,
    24,
  );
}
