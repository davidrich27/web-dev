<?php include "template/head.php"; ?>
<?php include "template/top-menu.php"; ?>

<div class="container" style="padding-top: 100px;">

    <h1>Person Database</h1>

    <div class="row">
      <div id="resultsDiv" class="col-sm-12 results"></div>
    </div>
</div>

<script type="text/javascript">

    var data = {};
    //###INSERT_DATA_HERE###//
    outputPersonData(data);

    // Create Table of Data
    function outputPersonData(data) {

      // Create Div of each pokemon
      var append = `<table class="table table-striped">
                      <thead><tr>
                          <th scope="col">#</th>
                          <th scope="col">First Name</th>
                          <th scope="col">Last Name</th>
                          <th scope="col">Favorite Number</th>
                          <th scope="col">Message</th>
                        </tr>
                      </thead>
                      <tbody>`;

      poke_data = data['pokemon'];

      poke_data.forEach(function(person, index) {

        append += `<tr id="${index+1}"><th scope="row">${index+1}</th>`;
        append += `<td>${person['fname']}</td>`;
        append += `<td>${person['lname']}</td>`;
        append += `<td>${person['faveNum']}</td>`;
        append += `<td>${person['msg']}</td>`;

        append += `</ul></td>`;

        append += `</tr>`;
      });

      append += `</tbody>
              </table>`;

      $('#resultsDiv').append(append);
      workerUpdate("Worker Data has been displayed.  Worker is still running...");
    }
</script>

<?php include "template/footer-menu.php"; ?>
<?php include "template/foot.php"; ?>
