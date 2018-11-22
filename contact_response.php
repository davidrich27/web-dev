<?php
  include "template/head.php";
  include "template/top-menu.php";
?>

<main role="main" class="container">

  <div class="starter-template">
    <h1>Messages</h1>

    <ul id="messages"></ul>

    <button type="button" class="btn btn-sm btn-primary" onclick="window.location.href = '/contact.php'">Write Another Message</button>

  </div>

</main><!-- /.container -->

<?php include "template/footer-menu.php"; ?>

<?php
  // All post values
  // foreach ($_POST as $key => $value) {
  //   echo "Field ".htmlspecialchars($key)." is ".htmlspecialchars($value)."<br>";
  // }

  $filepath = "data/messages.json";

  $name = $_POST['name'];
  $email = $_POST['email'];
  $msg = $_POST['message'];

  // Read all messages from file
  $myfile = fopen($filepath, "r") or die("Unable to open file!");
  if (filesize($filepath) > 0){
    $messages = fread($myfile,filesize($filepath));
  } else {
    $messages = null;
  }

  // decode JSON string into PHP object
  $messages = json_decode($messages);

  // if the message list is currently empty (by empty file), initialize it
  if (is_null($messages)) {
    $messages = (object) [
      'messages' => array()
    ];
  }

  // json encoding errors?
  // $errors = array(
  //     JSON_ERROR_NONE => 'No error has occurred',
  //     JSON_ERROR_DEPTH => 'The maximum stack depth has been exceeded',
  //     JSON_ERROR_STATE_MISMATCH => 'Invalid or malformed JSON',
  //     JSON_ERROR_CTRL_CHAR => 'Control character error, possibly incorrectly encoded',
  //     JSON_ERROR_SYNTAX => 'Syntax error',
  //     JSON_ERROR_UTF8 => 'Malformed UTF-8 characters, possibly incorrectly encoded'
  // );
  // echo '<br> JSON ERRORS: ' . $errors[json_last_error()];

  // compile POST data for new message
  $dt = new DateTime("now", new DateTimeZone('America/Denver'));
  $new_message = (object) [
    'name' => $name,
    'email' => $email,
    'date' => $dt->format('m/d/Y, H:i:s'),
    'body' => $msg
  ];

  // push the new message into complete message list
  array_push($messages->messages, $new_message);
  $messages = json_encode($messages, JSON_PRETTY_PRINT);
  fclose($myfile);

  // write updated json object to file
  $myfile = fopen($filepath, "w") or die("Unable to open file!");
  fwrite($myfile, $messages);
  fclose($myfile);
?>

<script>
  // php injects json object into javascript
  var data = <?php echo $messages ?>;
  data = data['messages'];

  var append = '<table class="table table-striped table-dark"><thead><tr><th scope="col">#</th><th scope="col">Name</th><th scope="col">Email</th><th scope="col">Date</th><th scope="col">Body</th></tr></thead><tbody>';
  for (var i in data) {
    data_pt = data[i];
    append += `<tr><th scope="row">${i}</th>`;
    for (var key in data_pt) {
      append += '<td>'+data_pt[key]+'</td>';
    }
    append += '</tr>';
  }
  append += '</tbody></table>';
  $('#messages').append(append);
</script>

<?php include "template/foot.php"; ?>
