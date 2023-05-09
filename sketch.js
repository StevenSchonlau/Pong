let font;
let textLayer;

let container;
let w;
let h;
let border;

let angle = 0;

//side bars
let left;
let right;
let bar_velocity = 3;
let side_length = 100;
let touching_side = false;

//block
let vx = 3;
let vy = 3;
let xpos;
let ypos;

//game phase
let phase = 0;
let lpoints = 0;
let rpoints = 0;
let accerator = 1;

function updateContainer() {
  container = select('#sketchContainer');
  w = parseFloat(getComputedStyle(container.elt).getPropertyValue('width'));
  h = parseFloat(getComputedStyle(container.elt).getPropertyValue('height'));
}

function windowResized() {
  updateContainer();
  resizeCanvas(w, h);
}

function setup() {
  left = 15;
  right = 15;
  updateContainer();
  canvas = createCanvas(w, h);
  smooth();
  canvas.parent("#sketchContainer");
}

function draw() {
  checkButtons();
  push();
  
  background("#DDDDDD");
  stroke('#222831');
  noFill();
  strokeWeight(5);
  rectMode("corners");
  rect(0, 0, width, height);
  if (phase != -1 && phase != -2) {
    if (lpoints >= 10) {
      phase = -2;
    }
    if (rpoints >= 10) {
      phase = -2;
    }
    checkPos();
    
    stroke('#222831');
    strokeWeight(10);
    line(10, left, 10, left+side_length);
    line(width-10, right, width-10, right+side_length);

    stroke('#AAAAAA');
    rectMode("corner");
    if (phase == 0) {
      xpos = width/2;
      ypos = height/2;
      phase = 1;
    }
    strokeWeight(4);
    fill('#AAAAAA')
    rect(xpos-10, ypos-10, 10, 10);
    
    textSize(30);
    strokeWeight(1);
    textAlign("center", "center");
    fill("#010101");
    textFont("monospace");
    text("" + rpoints, width - 70, 30);
    textFont("monospace");
    text("" + lpoints, 70, 30);
  } else if (phase == -2) {
    textSize(30);
    strokeWeight(1);
    textAlign("center", "center");
    fill("#010101");
    textFont("monospace");
    if (lpoints >= 10) {
      text("Left Wins!", width/2, 70);
    } else {
      text("Right Wins!", width/2, 70);
    }
    text("Hit Enter to Restart", width/2, 140);
  } else {
    textSize(30);
    strokeWeight(1);
    textAlign("center", "center");
    fill("#010101");
    textFont("monospace");
    text("Hit Enter to Resume", width/2, 70);
  }
  
  pop();
}

function checkPos() {
  if (xpos - 7 <= 0) {
    phase = 0;
    if (accerator < 3) {
      accerator += 0.1;
    }
    rpoints++;
    if (random(0, 1) > 0.5) {
      vy *= -1;
    } 
    if (random(0, 1) > 0.5) {
      vx *= -1;
    } 
  }
  if (xpos + 5 >= width) {
    phase = 0;
    if (accerator < 3) {
      accerator += 0.1;
    }
    lpoints++;
    if (random(0, 1) > 0.5) {
      vy *= -1;
    } 
    if (random(0, 1) > 0.5) {
      vx *= -1;
    } 
  }
  if (ypos + 5 >= height) {
    vy *= -1;
  }
  if (ypos - 5 <= 0) {
    vy *= -1;
  }
  if (xpos <= 30 && xpos >= 5 && ypos >= left && ypos <= left + side_length && !touching_side) {
    vx *= -1;
    touching_side = true;
  } else {
    touching_side = false;
  }
  if (xpos >= width - 20 && xpos <= width - 5 && ypos >= right && ypos <= right + side_length && !touching_side) {
    vx *= -1;
    touching_side = true;
  } else {
    touching_side = false;
  }
  xpos += vx * accerator;
  ypos += vy * accerator;
}

function checkButtons() {
  if (keyIsPressed) {
    if (phase != -1) {
      if (keyIsDown(73) && right >= 0) {
        right -= bar_velocity * accerator;
      } else if (keyIsDown(75) && right + side_length <= height) {
        right += bar_velocity * accerator;
      }
      if (keyIsDown(87) && left >= 0) {
        left -= bar_velocity * accerator;
      } else if (keyIsDown(83) && left + side_length <= height) {
        left += bar_velocity * accerator;
      }
    }
    if (keyIsDown(27)) {
      phase = -1;
    }
    if (phase == -1 && keyIsDown(13)) {
      phase = 1;
    }
    if (phase == -2 && keyIsDown(13)) {
      restart();
    }
  }
}


function colorAlpha(aColor, alpha) {
  // allows usage of HEX colors with alpha
  const c = color(aColor);
  let a = alpha;
  if (alpha <= 0.1) {
    a = 0.1;
  }
  return color('rgba(${[red(c), green(c), blue(c), a].join(', ')})');
}

function restart () {
  accerator = 1;
  lpoints = 0;
  rpoints = 0;
  phase = 0;
  left = 0;
  right = 0;
}