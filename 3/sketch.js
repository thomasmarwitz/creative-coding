// Title: Starfield with Centered 'Life' Words

const width = window.innerWidth;
const height = window.innerHeight;
const amtStars = 1000;
const amtLifeWords = 1; // Number of 'life' words to display
const speed = 20;

let isAnimating = true; // Variable to track animation state

function random(x, y) {
  // Return a random integer between x and y (exclusive)
  return Math.floor(Math.random() * (y - x) + x);
}

class Star {
  constructor() {
    this.x = random(-width, width);
    this.y = random(-height, height);
    this.z = random(0, width);
    this.pz = this.z;
  }

  update() {
    this.z = this.z - speed;
    if (this.z < 1) {
      this.z = width;
      this.x = random(-width, width);
      this.y = random(-height, height);
      this.pz = this.z;
    }
  }

  show() {
    fill(255);
    noStroke();
    
    const sx = map(this.x / this.z, 0, 1, 0, width);
    const sy = map(this.y / this.z, 0, 1, 0, height);

    const r = map(this.z, 0, width, 4, 0);
    ellipse(sx, sy, r, r);

    const px = map(this.x / this.pz, 0, 1, 0, width);
    const py = map(this.y / this.pz, 0, 1, 0, height);

    stroke(255);
    line(px, py, sx, sy);

    this.pz = this.z;
  }
}

class LifeWord {
  constructor() {
    this.reset();
  }

  reset() {
    const angle = random(TWO_PI);
    const radius = random(10, 50); // Start close to center
    this.x = cos(angle) * radius;
    this.y = sin(angle) * radius;
    this.z = width;
    this.opacity = 255;
    this.size = random(10, 30);
  }

  update() {
    this.z -= speed;
    // Calculate distance from center
    const distFromCenter = dist(this.x, this.y, 0, 0);
    // Map opacity based on distance from center to edge
    this.opacity = map(distFromCenter, 0, width / 2, 255, 0);
    // Increase size as it moves out
    this.size = map(this.z, width, 0, 10, 40);
    if (this.z < 1 || this.opacity <= 0) {
      this.reset();
    }
  }

  show() {
    const sx = map(this.x / this.z, 0, 1, 0, width);
    const sy = map(this.y / this.z, 0, 1, 0, height);
    
    fill(255, this.opacity);
    noStroke();
    textSize(this.size);
    textAlign(CENTER, CENTER);
    text("life", sx, sy);
  }
}

const stars = [];
const lifeWords = [];

function setup() {
  createCanvas(width, height);
  // create star objects
  for (let i = 0; i < amtStars; i++) {
    stars.push(new Star());
  }
  // create life word objects
  for (let i = 0; i < amtLifeWords; i++) {
    lifeWords.push(new LifeWord());
  }
}

function draw() {
  if (isAnimating) {
    background(0);
    translate(width / 2, height / 2);
    
    // Update and show stars
    for (let star of stars) {
      star.update();
      star.show();
    }
    
    // Update and show life words
    for (let lifeWord of lifeWords) {
      lifeWord.update();
      lifeWord.show();
    }
  }
}

function keyPressed() {
  if (key === ' ') { // Check if spacebar is pressed
    isAnimating = !isAnimating; // Toggle animation state
    if (isAnimating) {
      loop(); // Restart the draw loop if animation is resumed
    } else {
      noLoop(); // Stop the draw loop if animation is paused
    }
  }
}