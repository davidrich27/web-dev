<?php
  include "template/head.php";
  include "template/top-menu.php";
?>
<link rel="stylesheet" href="/style/canvas.css">

<main role="main" class="text-center">

  <h1>Interactive Canvas</h1>
  <p><ul>
    <li class="font-weight-bold">W,A,S,D</li>
    <li>Accellerates particles in that direction.</li>
    <li class="font-weight-bold"> SHIFT </li>
    <li>Decellerates particles.</li>
    <li class="font-weight-bold"> MOUSE HOVER </li>
    <li>Particles temporarily balloon in size.</li>
  </ul></p>
  <canvas id="myCanvas"></canvas>

</main><!-- /.container -->

<?php include "template/footer-menu.php"; ?>

<script type="text/javascript" src="script/interactive_canvas.js"></script>

<?php include "template/foot.php"; ?>
