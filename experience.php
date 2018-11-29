<?php
  include "template/head.php";
  include "template/top-menu.php";
?>

<main role="main" class="container">

    <div id="resume">
        <h1> Experience </h1>
        <p id="welcomeTxt"></p>
        <div class="form-group row">
        <h3 for="filterSelect" class="col-sm-2 col-form-label text-right"> Resume Filter: </h3>
        <div class="col-sm-4">
          <select class="form-control" id="filterSelect" onchange="filterByTag()">
          </select>
        </div>
          <!--<button class="btn btn-sm btn-primary col-sm-4" type="filterBtn" name="filterButton" onclick="filterByTag();">Filter</button>-->
    </div>
        <h3> Education </h3>
        <div id="edu-div"></div>
        <h3> Work </h3>
        <div id="exp-div"></div>
        <h3> Projects </h3>
        <div id="proj-div"></div>
    </div>
    <img id="animate" style="position: fixed;" src="images/smiley.jpeg" />

</main> <!-- /.container -->

<?php include "template/footer-menu.php"; ?>
<script type="text/javascript" src="script/experience.js"></script>
<style media="screen"> #resume {font-variant-caps: small-caps;} </style>
<?php include "template/foot.php" ; ?>
