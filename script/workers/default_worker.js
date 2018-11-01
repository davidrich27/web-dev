//
self.addEventListener("message", function(e) {
    // the passed-in data is available via e.data
    var data = e.data
    console.log("Worker recieved data from Main: " + e.data);

    switch (data.cmd) {
      case 'fetch':
        fetch(data);
        break;
      default:
        console.log("No valid command was given.");
    }


}, false);

// Get a file contents from url
function fetch(data) {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", data.arg, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                data['data'] = JSON.parse(rawFile.responseText);
                postMessage(data);
            }
        }
    }
    rawFile.send(null);
}
