// get canvas from DOM
var canvas = document.querySelector('#myCanvas');
var c = canvas.getContext('2d');

// set window limits
var min_x = 0;
var min_y = 0;
var max_x = window.innerWidth-20;
var max_y = window.outerHeight-20;
canvas.width = max_x;
canvas.height = max_y;

var circles = [];

// animation vars
var stop = false;
var frameCount = 0;
var $results = $("#results");
var fps, fpsInterval, startTime, now, then, elapsed;

// create initial object instances
var checkerboard = new CheckerBoard(20,40,10,5);
var circles = [];
for (var i=0; i<100; i++) {
  var circle = new Circle();
  circle.reroll();
  circles[i] = circle;
}
startAnimating(30);

// Checkerboard object
function CheckerBoard(min_checker_size, max_checker_size, x_offset, y_offset) {
  this.min_checker_size = min_checker_size;
  this.max_checker_size = max_checker_size;
  this.checker_size = (min_checker_size + max_checker_size)/2;
  this.checker_step = (max_checker_size - min_checker_size)/100;
  this.x_offset = x_offset;
  this.y_offset = y_offset;

  this.draw = function() {
    c.fillStyle = `black`;
    for (var i=0; i-this.x_offset < max_x; i+=this.checker_size) {
      if (i%(this.checker_size*2) == 0) {
        var j = 0;
      } else {
        var j = this.checker_size;
      }
      for (j; j-this.y_offset < max_y; j+=(this.checker_size*2)) {
        c.fillRect(i-this.x_offset,j-this.y_offset,this.checker_size,this.checker_size);
      }
    }
  }

  this.update = function() {
    // this.checker_size += this.checker_step;
    // if (this.checker_size > this.max_checker_size || this.checker_size < this.min_checker_size) {
    //   this.checker_step = -this.checker_step;
    // }
    this.draw();
  }
}

// Circle object
function Circle(x, y, dx, dy, radius, r, g, b) {
  // position
  this.x = x;
  this.y = y;
  // direction vector
  this.dx = dx;
  this.dy = dy;
  // size & color
  this.radius = radius;
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
    // randomly flip x-direction
    if (Math.random() > 0.99) {
      this.dx *= -1;
    }
    if (Math.random() > 0.90) {
      this.growth *= -1;
    }
    this.x += this.dx;
    this.y += this.dy;
    this.radius = Math.abs(this.radius + this.growth);

    // if out of bounds, respawn it as random circle at bottom of page
    if (this.y < min_y - this.radius) {
      this.reroll();
      this.y = max_y + this.radius;
    }

    this.draw();
  }

  // generate random state
  this.reroll = function() {
    this.x = Math.random() * max_x;
    this.y = Math.random() * max_y;
    this.dx = (Math.random() * 2) - 1; // -1 to 1
    this.dy = (Math.random() * -4) - 3; // -3 to -7
    this.radius = (Math.random() * 30) + 20;
    if (Math.random() > 0.5) {
      this.growth *= -1;
    }
    var r = Math.random() * 255;
    var g = Math.random() * 255;
    var b = Math.random() * 255;
    this.fill = `rgba(${r},${g},${b},.5)`;
    this.stroke = `rgba(${r},${g},${b},1)`;
  }
}

// Animate Canvas
function animate() {
  // get new animation frame
  if (!stop){
      requestAnimationFrame(animate);
  }

  // calc time since last frame
  now = Date.now();
  elapsed = now - then;

  // if enough time has elapsed, draw the next frame
  if (elapsed > fpsInterval) {
    //console.log('animating new frame...');
    // Get ready for next frame by setting then=now, but also adjust for your
    // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
    then = now - (elapsed % fpsInterval);

    // clear screen
    c.clearRect(0,0,max_x,max_y);

    // update and draw elements
    checkerboard.update();
    for (var i in circles) {
      circles[i].update();
    }
  }
}

// End animation
function stopAnimation() {
  stop = true;
  console.log('animation cancelled.');
}

// Initalize animation
function startAnimating(fps) {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    animate();
}
