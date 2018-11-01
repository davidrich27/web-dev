// Worker
var w1 = {
  worker: null,
  name: null,
  data: null
};

var pokemon_url = 'https://raw.githubusercontent.com/Biuni/PokemonGO-Pokedex/master/pokedex.json';
var pokemon_data = {};

// Starts up new worker instance
function startWorker(worker_var, worker_script) {
    if(typeof(Worker) !== "undefined") {
        if(typeof(w) == "undefined") {
            worker_var['worker'] = new Worker('/script/workers/default_worker.js');
        }

        $("statusLbl").innerHTML = "Worker is running...";
        console.log("Worker is running...");

        worker_var['worker'].onmessage = function(e) {
            console.log("Main recieved data from Worker: "+e.data)
        };

    } else {
        $("statusLbl").innerHTML = "Sorry! No Web Worker support.";
    }
}

// Give worker url to fetch data
function fetchWorker(worker_var, arg) {
    var request = {'cmd':'fetch', 'arg':arg};
    worker_var['worker'].postMessage(request);

    worker_var['worker'].onmessage = function(e) {
        worker_var['data'] = e.data.data;
        outputPokeData(worker_var['data']);
    };
}

// Create Frequency Table
function outputPokeData(data) {
  // Count number of each type
  console.log(data.pokemon);
  data['pokemon'].forEach(function(pokemon, index) {
    pokemon_data[pokemon['type']] += 1;
  });

  $('.results').innerHTML = '<ul>\n';
  Object.keys(pokemon_data).forEach(function(key){
    $('.results').innerHTML += '<li>'+ key +': '+ pokemon_data[key] +'</li>\n';
  });
  $('.results').innerHTML += '</ul>';
}

// End worker
function stopWorker(worker_var) {
    worker_var['worker'].terminate();
    worker_var['worker'] = undefined;
    $("statusLbl").innerHTML = ""
    console.log('Worker has been terminated.')
}
