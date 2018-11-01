<?php
  include "template/head.php";
  include "template/top-menu.php";
?>
<link rel="stylesheet" href="/style/web_worker.css">

<main role="main" class="container">

  <div class="starter-template">
    <h1>Web Worker</h1>
    <label id="statusLbl">No workers are working...</label> <br>
    <button id="startBtn" type="button" name="button" class="btn btn-sm btn-primary" onclick="startWorker(w1, '/script/workers/get_data.js')">Start Worker</button>
    <button id="requestBtn" type="button" name="button" class="btn btn-sm btn-primary" onclick="fetchWorker(w1, pokemon_url)">Request Worker</button>
    <button id="stopBtn" type="button" name="button" class="btn btn-sm btn-primary" onclick="stopWorker(w1)">Stop Worker</button> <br>
    <div id="resultsDiv" class="results">

    </div>
    <button id="resultsBtn" type="button" name="button" class="btn btn-sm btn-primary">Show Worker #1 Results</button> <br>


</main><!-- /.container -->

<script type="text/javascript" src="script/main.js"></script>
<script type="text/javascript" src="script/web_worker.js"></script>

<?php
  include "template/footer-menu.php";
  include "template/foot.php";
?>
