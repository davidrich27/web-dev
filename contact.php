<?php
  include "template/head.php";
  include "template/top-menu.php";
?>

<!-- Theme included stylesheets -->
<link href="//cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet">
<link href="//cdn.quilljs.com/1.3.6/quill.bubble.css" rel="stylesheet">

<main role="main" class="container">

  <div class="starter-template">
    <h1>Contact Me</h1>

    <div class="col-sm-6 offset-sm-1">
      <p> To reach me, please fill out this form: </p>
      <ul id="warningLbl"></ul>
    </div>

    <form id="main-form" class="email-form col-sm-8 offset-left-1" action="contact_response.php" method="post">
      <div class="form-group">
        <label for="nameTxt">Name: </label>
        <input id="nameTxt" type="text" name="name" value="" class="form-control"><br>
      </div>
      <div class="form-group">
        <label for="emailTxt">Email: </label>
        <input id="emailTxt" type="email" name="email" value="" class="form-control"><br>
      </div>

      <label for="messageTxt">Message: </label>
      <div class="row form-group">
        <input id="messageHidden" name="message" type="hidden">
        <div id="messageTxt" class="form-control"></div>
      </div>
      <button id="sendBtn" type="submit" class="btn btn-primary">Submit Message</button>
    </form>

  </div>

</main><!-- /.container -->

<?php include "template/footer-menu.php"; ?>

<script>

  var rich_message;

  $(document).ready(function() {

    // Add listeners for form members
    $('.form-control').focus(function() {
      $(this).addClass('focus');
    });
    $('.form-control').blur(function() {
      $(this).removeClass('focus');
      validate();
    });

    // Apply rich text editor
    rich_message = new Quill('#messageTxt', {
      theme: 'snow',
    });

    // Add listeners to quill object
    $('#messageTxt > *').focus(function() {
      $(this).addClass('focus');
    });
    $('#messageTxt > *').blur(function() {
      $(this).removeClass('focus');
      validate();
    });

  });

  function toggleFocus() {
    console.log('Executing focus event on '+ $(this).prop('name') +'...');
    $(this).addClass('focus');
  }

  // Verify proper input
  function validate() {
    $('#warningLbl').html("");
    populateMessage();

    var valid = true;
    var warning = "";

    var name = $('#nameTxt').val();
    var email = $('#emailTxt').val();
    var message = rich_message.getText();
    console.log('MESSAGE:'+message);

    // remove previous formatting
    $('#nameTxt').removeClass("invalid");
    $('#emailTxt').removeClass("invalid");
    $('#messageTxt > *').removeClass("invalid");

    // validate text inputs
    if (name == '') {
      valid = false;
      warning += '<li class="warning"> Warning: Must enter a Name. </li>';
      $('#nameTxt').addClass("invalid");
    }
    if (email == '' ) {
      valid = false;
      warning += '<li class="warning"> Warning: Must enter a Email Address. </li>';
      $('#emailTxt').addClass("invalid");
    } else if (!(email.includes('@') && email.includes('.'))) {
      valid = false;
      warning += '<li class="warning"> Warning: Email Address in Not Valid. </li>';
      $('#emailTxt').addClass("invalid");
    }
    if (message.trim().length === 0) {
      valid = false;
      warning += '<li class="warning"> Warning: Must enter a Message. </li>';
      $('#messageTxt > *').addClass("invalid");
    }

    $('#warningLbl').html(warning);

    if (valid) {
      console.log("SUCCESS! All fields are valid!");
    } else {
      console.log("FAILURE. Some fields are invalid.");
    }
    return valid;
  }

  function populateMessage() {
    // Populate hidden form on submit

    // Method 1: Quill Deltas
    //var message = JSON.stringify(rich_message.getContents());

    // Method 2: HTML
    var message = rich_message.root.innerHTML;
    console.log('MESSAGE: '+message);

    $('messageHidden').val(message);
    console.log($('input[name="message"]').val(message));
  }

  $('#main-form').submit(function(event) {
    return validate();
  });

</script>

<style media="screen">

  #messageTxt {
    background-color: white;
    height: 200px;
    width: 100%;
  }

  .focus {
    border: 3px solid rgb(70, 0, 112);
    background: rgb(235, 196, 249);
    background-color: rgb(235, 196, 249);
  }

  .warning {
    color: rgb(125, 20, 6);
  }

  .invalid {
    border: 3px solid rgb(150, 0, 0);
    background: rgb(255, 117, 117);
    background-color: rgb(255, 117, 117);
  }

  .valid {
    border: 3px solid rgb(113, 230, 20);
    background: rgb(129, 215, 135);
  }

  .focus:focus {
    border: 3px solid rgb(70, 0, 112);
    background: rgb(235, 196, 249);
    background-color: rgb(235, 196, 249);
  }

</style>

<!-- Main Quill library -->
<script src="//cdn.quilljs.com/1.3.6/quill.min.js"></script>

<?php include "template/foot.php"; ?>
