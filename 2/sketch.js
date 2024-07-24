let xScale = 0.015;
let yScale = 0.02;
let gap = 2;
let offset = 15;
let fadeProgress = 0;
let fadeSpeed = 0.1;
let currentOffset, targetOffset;
let textBuffer;
let padding = 50; // Padding around the text
let fadeDirection = 1; // 1 for forward, -1 for reverse

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  currentOffset = random(1000);
  targetOffset = random(1000);
  
  // Create an offscreen graphics buffer for the text
  textBuffer = createGraphics(width, height);
  textBuffer.background(255);
  textBuffer.fill(0);
  textBuffer.textAlign(CENTER, CENTER);
  
  // Calculate the maximum possible text size that fits within the canvas with padding
  let fontSize = 1;
  textBuffer.textSize(fontSize);
  while (textBuffer.textWidth('balance') < width - 2*padding && 
         fontSize < height - 2*padding) {
    fontSize++;
    textBuffer.textSize(fontSize);
  }
  fontSize--; // Step back to the last size that fit
  
  textBuffer.textSize(fontSize);
  textBuffer.text('balance', width/2, height/2);
  
  dotGrid();
}

function draw() {
  dotGrid();
  fadeProgress += fadeSpeed * fadeDirection;
  
  if (fadeProgress >= 0.85 || fadeProgress <= 0) {
    fadeDirection *= -1; // Reverse the fade direction
    
    if (fadeProgress >= 1) {
      fadeProgress = 1; // Ensure we don't exceed 1
      currentOffset = targetOffset;
      targetOffset = random(1000);
    } else if (fadeProgress <= 0) {
      fadeProgress = 0; // Ensure we don't go below 0
    }
  }
}

function dotGrid() {
  background(255);
  noStroke();
  fill(0);

  for (let x = gap / 2; x < width; x += gap) {
    for (let y = gap / 2; y < height; y += gap) {
      let textValue = brightness(textBuffer.get(x, y)) / 255;
      let noiseValue = noise((x + offset + currentOffset) * xScale, (y + offset + currentOffset) * yScale);
      
      // Interpolate between text and noise
      let interpolatedValue = lerp(textValue, noiseValue, fadeProgress);
      
      let diameter = interpolatedValue * gap;
      circle(x, y, diameter);
    }
  }
}

// function mousePressed() {
//   // Reset fade progress and change direction on mouse press
//   fadeProgress = 0;
//   fadeDirection = 1;
//   currentOffset = random(1000);
//   targetOffset = random(1000);
// }

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setup(); // Recalculate everything for the new canvas size
}