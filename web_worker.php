<?php
  include "template/head.php";
  include "template/top-menu.php";
?>
<link rel="stylesheet" href="/style/web_worker.css">

<main role="main" class="container">

  <div class="starter-template container">
    <h1 id="heading">PokeData Web Worker</h1>

    <div class="row">
      <div class="col-sm-4 text-center">
        <button id="startBtn" type="button" name="button" class="btn btn-sm btn-primary" onclick="startWorker(w1, '/script/workers/default_worker.js')">Start Worker</button>
      </div>
      <div class="col-sm-4 text-center">
        <button id="requestBtn" type="button" name="button" class="btn btn-sm btn-danger" onclick="fetchWorker(w1, pokemon_url)" disabled="true">Request Worker</button>
      </div>
      <div class="col-sm-4 text-center">
        <button id="stopBtn" type="button" name="button" class="btn btn-sm btn-danger" onclick="stopWorker(w1)" disabled="true">Stop Worker</button>
      </div>
    </div>

    <label id="statusLbl">No workers are working...</label> <br>

    <div class="row">
      <div id="resultsDiv" class="col-sm-12 results"></div>
    </div>
  </div>

  <div id="data"></div>

</main><!-- /.container -->

<?php include "template/footer-menu.php"; ?>

<script type="text/javascript" src="script/main.js"></script>
<script type="text/javascript" src="script/web_worker.js"></script>

<?php include "template/foot.php"; ?>
