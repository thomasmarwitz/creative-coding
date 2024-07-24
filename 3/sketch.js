
// Title: Starfield

const width = window.innerWidth;
const height = window.innerHeight;
const amtStars = 1000;
const speed = 20;

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
      this.pz = this.z
    }
  }

  show() {
    fill(255);
    noStroke();
    
    const sx = map(this.x / this.z, 0, 1, 0, width);
    const sy = map(this.y / this.z, 0, 1, 0, height);

    const r = map(this.z, 0, width, 16, 0);
    ellipse(sx, sy, r, r);

    const px = map(this.x / this.pz, 0, 1, 0, width);
    const py = map(this.y / this.pz, 0, 1, 0, height);

    this.pz = this.z;
    stroke(255)
    line(px, py, sx, sy);
  }
}

const stars = [];

function setup() {
  createCanvas(width, height);
  // create 100 star objects
  for (let i = 0; i < amtStars; i++) {
    stars.push(new Star());
  }
}

function draw() {
  background(0);
  translate(width / 2, height / 2);
  for (let star of stars) {
    star.update()
    star.show()
  }
}
