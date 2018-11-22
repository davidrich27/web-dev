<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>Home Page</title>
    <link rel="stylesheet" type="text/css" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" />
    <link rel="stylesheet" type="text/css" href="style/main.css" />
    <!-- BABYLON Packages -->
    <script src="https://cdn.babylonjs.com/babylon.js"></script>
    <script src="https://preview.babylonjs.com/loaders/babylonjs.loaders.min.js"></script>
    <script src="https://code.jquery.com/pep/0.4.3/pep.js"></script>
  </head>
  <body>
    <?php
      include "template/top-menu.php";
    ?>
    <link rel="stylesheet" href="/style/canvas.css">

    <main role="main" class="text-center">

      <h1>Babylon 3D</h1>
      <canvas id="myCanvas"></canvas>

    </main><!-- /.container -->

    <?php include "template/footer-menu.php"; ?>
    <script type="text/javascript" src="script/babylon_dna.js"></script>
  </body>
<html>
