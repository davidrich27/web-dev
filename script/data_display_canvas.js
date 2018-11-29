// get canvas from DOM
var canvas = document.querySelector('#myCanvas');
var ctx = canvas.getContext('2d');

// set window limits
var min_x = 0;
var min_y = 0;
var max_x = 800;
var max_y = 600;
canvas.width = max_x;
canvas.height = max_y;

// Worker
var w1 = {
  worker: null,
  name: null,
  data: null
};

var pallete = {

}

// Starts up new worker instance
function startWorker(worker_var, worker_script) {
    if(typeof(Worker) !== "undefined") {
        console.log("Worker is running...");

        if(typeof(w) == "undefined") {
            worker_var['worker'] = new Worker(worker_script);
        }

        worker_var['worker'].onmessage = function(e) {
            fetchWorker(worker_var, e.data);
        };

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
        outputPokeData(worker_var['data']);
    };
}

// Create Frequency Table
function outputPokeData(data) {
  workerUpdate("Data has been recieved.")

  // Count number of each type (dual type increments both types)
  data['pokemon'].forEach(function(pokemon, index) {
    var types = pokemon['type'];
    for (var type in types) {
        type = types[type]
        if (isNaN(type_data[type])) {
          type_data[type] = 0;
        }
        type_data[type] += 1;
    }
  });

  // assign random color to each type
  for (var type in type_data) {
      var r = Math.floor(Math.random() * 255);
      var g = Math.floor(Math.random() * 255);
      var b = Math.floor(Math.random() * 255);
      pallette[type] = `rgb(${r},${g},${b})`;
  }

  console.log(JSON.stringify(type_data));

  drawPieData(type_data);

  stopWorker(worker_var);
}

// Output data to canvas
function drawPieData(pie_data) {

    ctx.moveTp();
    ctx.beginPath();

}

// End worker
function stopWorker(worker_var) {
    worker_var['worker'].terminate();
    worker_var['worker'] = undefined;
    workerUpdate('Worker has been terminated.');
}
