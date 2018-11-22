// get canvas from DOM
var canvas = document.querySelector('#myCanvas');
var c = canvas.getContext('2d');

// set window limits
var min_x = 0;
var min_y = 0;
var max_x = window.innerWidth;
var max_y = window.outerHeight;
canvas.width = max_x;
canvas.height = max_y;

// animation vars
var stop = false;
var frameCount = 0;
var $results = $("#results");
var fps, fpsInterval, startTime, now, then, elapsed;

// circle vars
var max_radius = 50;
var min_magnitude = 1;
var max_magnitude = 10;
var color_array = [
  '#EB6896',
  '#C36894',
  '#836890',
  '#46698D',
  '#106A8B'
];

// store mouse coordinates
var mouse = {
  x: undefined,
  y: undefined
};

// instance circles
var backdrop = new BackDrop(`black`);
var circles = [];
for (var i=0; i<250; i++){
  var circle = new Circle();
  circle.reroll();
  var color = color_array[(Math.floor(Math.random() * color_array.length))];
  circle.fill = color;
  circle.stroke = color;
  circles[i] = circle;
}

// begin animating
startAnimating(30);

// track mouse location
window.addEventListener('mousemove', function(event) {
  mouse.x = event.x - canvas.getBoundingClientRect().left;
  mouse.y = event.y - canvas.getBoundingClientRect().top;
  // console.log(mouse);
});

// track key press ('left'==37, 'up'==38, 'right'==39, 'down'==40)
window.addEventListener('keydown', function(event) {
  var key = event.which || event.keyCode;

  var accel = 5;
  // 'A' or LEFT ARROW
  if (key == 37 || key == 65) {
    circle_accelerate(-accel, 0);
  }
  // 'W ' or UP ARROW
  else if (key == 38 || key == 87) {
    circle_accelerate(0, -accel);
  }
  // 'D' or RIGHT ARROW
  else if (key == 39 || key == 68) {
    circle_accelerate(accel, 0);
  }
  // 'S' or DOWN ARROW
  else if (key == 40 || key == 83) {
    circle_accelerate(0, accel);
  }
  // SHIFT
  else if (key == 16) {
    console.log('shift');
    circle_deccelerate(1);
  }
});

function circle_accelerate(dx, dy) {
  for (var i in circles) {
    var circle = circles[i];
    circle.dx += dx;
    circle.dy += dy;
  }
}
function circle_deccelerate(speed) {
  for (var i in circles) {
    var circle = circles[i];
    if (circle.dx > speed) {
      circle.dx -= speed;
    } else if (circle.dx < -speed) {
      circle.dx += speed;
    } else {
      circle.dx = 0;
    }
    if (circle.dy > speed) {
      circle.dy -= speed;
    } else if (circle.dy < -speed) {
      circle.dy += speed;
    } else {
      circle.dy = 0;
    }
  }
}

// resize browser
window.addEventListener('resize', function(event) {
  var min_x = 0;
  var min_y = 0;
  var max_x = window.innerWidth;
  var max_y = window.outerHeight;
  canvas.width = max_x;
  canvas.height = max_y;
});

// Backdrop object
function BackDrop(color) {
  this.color = color;

  this.draw = function() {
    // draw rectangle the size of the canvas
    c.fillStyle = this.color;
    c.fillRect(min_x, min_y, max_x, max_y);
  }

  this.update = function() {
    this.draw();
  }
}

// Circle object
function Circle(x, y, radius, angle, magnitude, r, g, b) {
  // position
  this.x = x;
  this.y = y;
  // direction vectors
  this.angle = angle;
  this.magnitude = magnitude;
  // velocity
  this.dx = Math.cos(this.angle) * this.magnitude;
  this.dy = Math.sin(this.angle) * this.magnitude;
  // size & color
  this.radius = radius;
  this.minRadius = radius;
  this.growth = 0.2;
  // color
  this.r = r;
  this.g = g;
  this.b = b;
  this.fill = `rgba(${r},${g},${b},.5)`;
  this.stroke = `rgba(${r},${g},${b},1)`;

  this.draw = function() {
    // draw circle
    c.beginPath();
    c.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
    c.fillStyle = this.fill;
    c.fill();
    c.strokeStyle = this.stroke;
    c.stroke();
  }

  // Make changes to position
  this.update = function() {
    this.x += this.dx;
    this.y += this.dy;

    // if out of bounds, reflect it off the surface
    if (this.y - this.radius < min_y) {
      this.dy = Math.abs(this.dy);
    } else if (this.y + this.radius > max_y) {
      this.dy = -1 * Math.abs(this.dy);
    }
    if (this.x - this.radius < min_x ) {
      this.dx = Math.abs(this.dx);
    } else if (this.x + this.radius > max_x) {
      this.dx = -1 * Math.abs(this.dx);
    }

    // interactivity
    var dist = Distance(this.x,this.y,mouse.x,mouse.y);
    if (dist < 50) {
      if (this.radius < max_radius) {
        this.radius += 5;
      }
    } else if (this.radius > this.min_radius) {
      this.radius -= 3;
    }

    // randomize color
    //this.fill = color_array[(Math.floor(Math.random() * color_array.length))];

    // draw update to screen
    this.draw();
  }

  // generate random state
  this.reroll = function() {
    this.x = Math.random() * max_x;
    this.y = Math.random() * max_y;
    // get random angle
    this.angle = Math.random() * Math.PI * 2; // 0 to 2*PI radians
    this.magnitude = 5;
    this.dx = Math.cos(this.angle) * this.magnitude;
    this.dy = Math.sin(this.angle) * this.magnitude;
    this.radius = (Math.random() * 10) + 5;
    this.min_radius = this.radius;
    var r = Math.random() * 255;
    var g = Math.random() * 255;
    var b = Math.random() * 255;
    this.fill = `rgba(${r},${g},${b},.5)`;
    this.stroke = `rgba(${r},${g},${b},1)`;
  }
}

// Initalize animation
function startAnimating(fps) {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    animate();
}

// End animation
function stopAnimation() {
  stop = true;
  console.log('animation cancelled.');
}

// Animate canvas
function animate() {
  // get new animation frame
  if (!stop) {
    requestAnimationFrame(animate);
  }

  // calc time since last frame
  now = Date.now();
  elapsed = now - then;

  // if enough time has elapsed, draw the next frame
  if (elapsed > fpsInterval) {
    // Get ready for next frame by setting then=now, but also adjust for your
    // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
    then = now - (elapsed % fpsInterval);
    // clear screen
    c.clearRect(0,0,max_x,max_y);
    // redraw
    backdrop.update();
    for (var i in circles) {
      circles[i].update();
    }
  }
}

function Distance(x_1, y_1, x_2, y_2) {
  var x = Math.pow(x_1-x_2, 2);
  var y = Math.pow(y_1-y_2, 2);
  return Math.sqrt(x+y);
}
