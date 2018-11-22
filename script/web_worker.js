// Worker
var w1 = {
  worker: null,
  name: null,
  data: null
};

var pokemon_url = 'https://raw.githubusercontent.com/Biuni/PokemonGO-Pokedex/master/pokedex.json';
var type_data = {};
var poke_data = {};

// Starts up new worker instance
function startWorker(worker_var, worker_script) {
    if(typeof(Worker) !== "undefined") {
        workerUpdate("Worker is running...");

        if(typeof(w) == "undefined") {
            worker_var['worker'] = new Worker('/script/workers/default_worker.js');
        }

        worker_var['worker'].onmessage = function(e) {
            workerUpdate("Main recieved data from Worker...");
            console.log("Main recieved data from Worker: "+e.data)
        };

        toggleBtn($('#startBtn'));
        toggleBtn($('#requestBtn'));

    } else {
        workerUpdate("Sorry! No Web Worker support.");
        toggleBtn($('#startBtn'));
    }
}

// Give worker url to fetch data
function fetchWorker(worker_var, arg) {
    workerUpdate("Fetch request sent to Worker...");
    var request = {'cmd':'fetch', 'arg':arg};
    worker_var['worker'].postMessage(request);

    worker_var['worker'].onmessage = function(e) {
        worker_var['data'] = e.data.data;
        outputPokeData(worker_var['data']);
    };

    toggleBtn($('#requestBtn'));
    toggleBtn($('#stopBtn'));
}

// Create Frequency Table
function outputPokeData(data) {
  workerUpdate("Data has been recieved.")

  // Count number of each type
  data['pokemon'].forEach(function(pokemon, index) {
    if (isNaN(type_data[pokemon['type']])) {
      type_data[pokemon['type']] = 0;
    }
    type_data[pokemon['type']] += 1;
  });

  // Create Div of each pokemon
  var append = `<table class="table table-striped">
                  <thead><tr>
                      <th scope="col">#</th>
                      <th scope="col">Name</th>
                      <th scope="col">Image</th>
                      <th scope="col">Type</th>
                      <th scope="col">Weaknesses</th>
                      <th scope="col">Evolves To</th>
                    </tr>
                  </thead>
                  <tbody>`;

  poke_data = data['pokemon'];

  poke_data.forEach(function(pokemon, index) {
    var id= `${pokemon['name']}`;
    pokemon['DOM'] = `#${id}`;

    append += `<tr id="${id}"><th scope="row">${index+1}</th>`;
    append += `<td>${pokemon['name']}</td>`;
    append += `<td><img src="${pokemon['img']}"></td>`;

    var types = pokemon['type'];
    append += `<td class="types"><ul>`;
    for (var i=0; i<types.length; i++) {
      append += `<li>${types[i]}</li>`;
    }
    append += `</ul></td>`;

    var weaknesses = pokemon['weaknesses'];
    append += `<td class="weaknesses"><ul>`;
    for (var i=0; i<weaknesses.length; i++) {
        append += `<li>${weaknesses[i]}</li>`;
    }
    append += `</ul></td>`;

    var evo = pokemon['next_evolution'];
    append += `<td><ul>`;
    if (typeof evo != 'undefined') {
      for (var i=0; i<evo.length; i++) {
          append += `<li><a href="#${evo[i]['name']}">${evo[i]['name']}</a></li>`;
      }
    }
    append += `</ul></td>`;

    append += `</tr>`;
  });

  append += `</tbody>
          </table>`;

  $('#resultsDiv').append(append);
  workerUpdate("Worker Data has been displayed.  Worker is still running...");
}

// End worker
function stopWorker(worker_var) {
    worker_var['worker'].terminate();
    worker_var['worker'] = undefined;
    workerUpdate('Worker has been terminated.');

    toggleBtn($('#stopBtn'));
}

// Worker Update
function workerUpdate(msg) {
  $('#statusLbl').text(msg);
  console.log(msg);
}

// Toggle Button
function toggleBtn(button) {
  if (button.prop('disabled') == true) {
    button.prop('disabled', false);
    button.removeClass('btn-danger');
    button.addClass('btn-primary');
  } else {
    button.prop('disabled', true);
    button.removeClass('btn-primary');
    button.addClass('btn-danger');
  }
}
