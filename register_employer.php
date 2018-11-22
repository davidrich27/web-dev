<?php
  include "template/head.php";
  include "template/top-menu.php";
?>

<main role="main" class="container">

  <div class="starter-template">
    <h1>Employer Registration</h1>

    <div class="col-sm-6 offset-sm-1">
      <p> Please Register or Sign In as an Employer to Save Your Settings: </p>
      <ul id="warningLbl"></ul>
    </div>

    <!-- Tab Navigation -->
    <nav>
      <div class="nav nav-tabs" id="nav-tab" role="tablist">
        <a class="nav-item nav-link active" id="nav-signin-tab" data-toggle="tab" href="#nav-signin" role="tab" aria-controls="nav-home" aria-selected="true" onclick="current_tab='signin';">Sign-In</a>
        <a class="nav-item nav-link" id="nav-register-tab" data-toggle="tab" href="#nav-register" role="tab" aria-controls="nav-register" aria-selected="false" onclick="current_tab='register';">Register</a>
      </div>
    </nav>

    <br>

    <div class="tab-content" id="nav-tabContent">

      <div class="col-sm-8 offset-left-1">
        <div class="form-group">
          <label for="nameTxt">Name: </label>
          <input id="nameTxt" type="text" name="name" value="" class="form-control"><br>
        </div>
        <div class="form-group">
          <label for="pwdTxt">Password: </label>
          <input id="pwdTxt" type="password" name="pwd" value="" class="form-control"><br>
        </div>
      </div>

      <div class="tab-pane fade show active" id="nav-signin" role="tabpanel" aria-labelledby="nav-signin-tab">
        <div class="col-sm-8 offset-left-1">
          <div class="form-group">
            <button id="signinBtn" type="button" class="btn btn-primary" onclick="signIn()">Sign In</button>
            <button type="button" class="btn btn-danger" onclick="forget()">Forget Me</button>
          </div>
        </div>
      </div>

      <div class="tab-pane fade" id="nav-register" role="tabpanel" aria-labelledby="nav-register-tab">
        <div class="col-sm-8 offset-left-1">
          <div class="form-group">
            <label for="fieldSelect">Field of Employment: </label>
            <select id="fieldSelect" class="form-control" name="fieldSelect"></select>
          </div><br>
          <div class="form-group">
            <button id="registerBtn" type="button" class="btn btn-primary" onclick="register()">Register</button>
            <button type="button" class="btn btn-danger" onclick="forget()">Forget Me</button>
          </div>
        </div>
      </div>
    </div>
  </div>

</main><!-- /.container -->

<?php include "template/footer-menu.php"; ?>

<script>

  var resume;
  var tagList = [];
  var current_tab = "signin";

  var username;
  var field;
  var cookie = getCookie();

  $(document).ready(function() {

    // Get Resume Data
    GetJsonFromFile("data/exp_history.json", PopulateList)

    // Add listeners for form members
    $('.form-control').focus(function() {
      $(this).addClass('focus');
    });
    $('.form-control').blur(function() {
      $(this).removeClass('focus');
      validate();
    });
  });

  function toggleFocus() {
    console.log('Executing focus event on '+ $(this).prop('name') +'...');
    $(this).addClass('focus');
  }

  // Verify proper input
  function validate(type) {
    // erase old warning messages
    $('#warningLbl').html("");

    var valid = true;
    var warning = "";

    username = $('#nameTxt').val();
    var pwd = $('#pwdTxt').val();
    field = $('#fieldSelect :selected').val();

    // remove previous formatting
    $('#nameTxt').removeClass("invalid");
    $('#pwdTxt').removeClass("invalid");
    $('#fieldSelect').removeClass("invalid");

    // Validation Tests
    if (username == '') {
      valid = false;
      warning += '<li class="warning"> Warning: Must enter a Name. </li>';
      $('#nameTxt').addClass("invalid");
    }
    if (pwd == '') {
      valid = false;
      warning += '<li class="warning"> Warning: Must enter a Password. </li>';
      $('#pwdTxt').addClass("invalid");
    }
    if (field == tagList[0] && type == 'register') {
      valid = false;
      warning += '<li class="warning"> Warning: Must select a Field of Employment. </li>';
      $('#fieldSelect').addClass("invalid");
    }
    // update with new warning messages
    $('#warningLbl').html(warning);

    if (valid) {
      console.log("SUCCESS! All fields are valid!");
    } else {
      console.log("FAILURE. Some fields are invalid.");
    }
    return valid;
  }

  function PopulateList(resume) {

    this.resume = resume;

    // Collect all field types
    tagList = resume["_AllTags"];
    tagList.unshift("General");
    tagList.unshift("[Select Field of Interest]");

    // Populate the SelectList
    var append = "";
    for (var tag in tagList){
      tag = tagList[tag];
      append += `<option value="${tag}"> ${tag} </option>`
    }
    $('#fieldSelect').append(append);
  }

  //
  function register() {
    if (!validate(current_tab)) {
      return;
    }
    // Get values
    username = $('#nameTxt').val();
    var pwd = $('#pwdTxt').val();
    field = $('#fieldSelect :selected').val();

    // Create cookie
    var cookie = {
      "username": username,
      "pwd": pwd,
      "field": field
    };

    setCookie(cookie, 14);

    var warning = "<li> Congratulations! You have successfully registered as a employer! </li>";
    $('#warningLbl').html(warning);

    // Redirect to experience page
    window.location.href = "experience.php";
  }

  function signIn() {
    if (!validate(current_tab)) {
      return;
    }
    // Get values
    var name = $('#nameTxt').val();
    var pwd = $('#pwdTxt').val();

    // Get cookie and check if sign in credentials
    var cookie = getCookie();
    if (cookie["username"] != name) {
      var warning = "<li class='warning'> ERROR: User not found. </li>";
    }
    else if (cookie["pwd"] != pwd) {
      var warning = "<li class='warning'> ERROR: Password is incorrect. </li>";
    }
    else {
      field = cookie["field"];
      var warning = "<li> Congratulations! You have successfully logged in! </li>";

      // Update cookie expiration date
      setCookie(cookie, 14);
    }
    $('#warningLbl').html(warning);
  }

  function forget() {
    var cookie = {
      "username": null,
      "pwd": null,
      "field": null
    }

    deleteCookie(cookie);
    cookie = getCookie();
  }

</script>

<style media="screen">

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

<?php include "template/foot.php"; ?>
