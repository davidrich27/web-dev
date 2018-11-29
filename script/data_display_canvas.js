// get canvas from DOM
var canvas = document.querySelector('#myCanvas');
var ctx = canvas.getContext('2d');

// set window limits
var min_x = 0;
var min_y = 0;
var max_x = 800;
var max_y = 500;
canvas.width = max_x;
canvas.height = max_y;

// Worker
var w1 = {
  worker: null,
  name: null,
  data: null
};

var type_data = {};
var palette = {};
var total = 0;

var pokemon_url = 'https://raw.githubusercontent.com/Biuni/PokemonGO-Pokedex/master/pokedex.json';
var worker_script = '/script/workers/default_worker.js'

startWorker(w1, worker_script);

// Starts up new worker instance
function startWorker(worker_var, worker_script) {
    if(typeof(Worker) !== "undefined") {
        console.log("Worker is running...");

        if(typeof(w) == "undefined") {
            worker_var['worker'] = new Worker(worker_script);
        }

        worker_var['worker'].onmessage = function(e) {
            console.log("Main recieved data from Worker: "+e.data)
        };
        fetchWorker(worker_var, pokemon_url);

    } else {
        console.log("Sorry! No Web Worker support.");
    }
}

// Give worker url to fetch data
function fetchWorker(worker_var, arg) {
    console.log("Fetch request sent to Worker...");
    var request = {'cmd':'fetch', 'arg':arg};
    worker_var['worker'].postMessage(request);

    worker_var['worker'].onmessage = function(e) {
        worker_var['data'] = e.data.data;
        outputPokeData(worker_var, worker_var['data']);
    };
}

// Create Frequency Table
function outputPokeData(worker_var, data) {

  // Count number of each type (dual type increments both types)
  data['pokemon'].forEach(function(pokemon, index) {
    var types = pokemon['type'];
    for (var type in types) {
        type = types[type]
        if (isNaN(type_data[type])) {
          type_data[type] = 0;
        }
        type_data[type] += 1;
        total += 1
    }
  });

  // assign random color to each type
  for (var type in type_data) {
      var r = Math.floor(Math.random() * 255);
      var g = Math.floor(Math.random() * 255);
      var b = Math.floor(Math.random() * 255);
      palette[type] = `rgb(${r},${g},${b})`;
  }

  console.log(JSON.stringify(type_data));

  drawPieData(type_data);

  stopWorker(worker_var);
}

// Output data to canvas
function drawPieData(pie_data) {

    var pie_chart = {
      border: 25,
      width: 600,
      height: 500,

      pos: {
        x: 0,
        y: 0
      },
      center: {
        x:250,
        y:300
      },

      radius: 150,
      stroke: 'black',
      fill: 'blue'
    };

    // Draw text
    ctx.font = "30px Arial";
    ctx.strokeText("Percent of Each Pokemon Type",50,75);

    // draw pie chart
    // outline circle
    ctx.strokeStyle = pie_chart;
    ctx.beginPath();
    ctx.arc(
      pie_chart.center.x,
      pie_chart.center.y,
      pie_chart.radius,
      0,
      2*Math.PI);
    ctx.stroke();

    // draw each slice
    var cum_angle = 0;
    for (var type in type_data) {
      // get size/color of slice
      var theta = (type_data[type]/total)*Math.PI*2;
      var color = palette[type];
      var next_angle = cum_angle + theta;
      // draw slice
      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.strokeStyle = 'black';
      ctx.arc(
        pie_chart.center.x,
        pie_chart.center.y,
        pie_chart.radius,
        cum_angle,
        next_angle
      );
      ctx.lineTo(pie_chart.center.x, pie_chart.center.y);
      ctx.fill();
      ctx.stroke();
      // setup for next iteration
      cum_angle = next_angle;
    }


    var legend = {
      border: 25,
      width: 200,
      height: 500,

      margin: 25,
      padding: 25
    };

    // draw legend
    var leg_border = 25;
    var leg_height = max_y - (2 * leg_border);
    var leg_width = 300 - (2 * leg_border);
    var leg_x = max_x - (leg_width + leg_border);
    var leg_y = leg_border;

    ctx.strokeStyle = 'black';
    ctx.strokeRect(leg_x, leg_y, leg_width, leg_height);

    // draw text
    ctx.font = "22px Arial";
    ctx.strokeText("Type Legend", leg_x+leg_border+30, leg_y+leg_border+10);

    var pad_x = 25;
    var pad_y = 25;
    var cum_y = leg_y+leg_border+10+pad_y;

    for (var type in type_data) {
      var color = palette[type];
      // draw color box
      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.rect(leg_x+pad_x, cum_y, 20, 20);
      ctx.stroke();
      ctx.fill();
      // draw text
      ctx.fillStyle = 'black';
      ctx.font = "12px Arial";
      ctx.fillText(type,leg_x+pad_x*2,cum_y+13);

      // move down one row for next
      cum_y += pad_y;
    }
}

// End worker
function stopWorker(worker_var) {
    worker_var['worker'].terminate();
    worker_var['worker'] = undefined;
    console.log('Worker has been terminated.');
}
