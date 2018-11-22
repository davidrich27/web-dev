<?php
  include "template/head.php";
  include "template/top-menu.php";
?>

<main role="main" class="container">

  <div id="resume">
    <h1>Experience</h1>
    <p id="welcomeTxt"></p>

    <div class="form-group row">
      <h3 for="filterSelect" class="col-sm-2 col-form-label text-right"> Resume Filter: </h3>
      <div class="col-sm-4">
        <select class="form-control" id="filterSelect" onchange="filterByTag()"></select>
      </div>
      <!--<button class="btn btn-sm btn-primary col-sm-4" type="filterBtn" name="filterButton" onclick="filterByTag();">Filter</button>-->
    </div>

    <h3>Education</h3>
    <div id="edu-div"></div>

    <h3>Work</h3>
    <div id="exp-div"></div>

    <h3>Projects</h3>
    <div id="proj-div"></div>

  </div>

</main><!-- /.container -->

<?php include "template/footer-menu.php"; ?>

<script type="text/javascript">

  var resume;
  var cookie;

  var tagList = ["General"];
  var template = {
    'Work': {
      'div': '#exp-div',
      'fields': ["Job_Title", ["Company", "Boss_Supervisor", "Location", "Date"]]
    },
    'Education': {
      'div': '#edu-div',
      'fields': ["Degree", ["Major", "School", "Location", "Date"]],
    },
    'Projects': {
      'div': '#proj-div',
      'fields': ["Name", ["Description", "URL", "Date"]]
    }
  }


  $(document).ready(function() {
    // Get Resume Data
    GetJsonFromFile("data/exp_history.json", PopulateResume);
  });

  function PopulateResume(resume) {

    this.resume = resume;
    var className = "bold";

    // Populate Fields
    // Iterate over each category in the template
    for (var category in template) {
      var cat = template[category];
      var div = cat['div'];
      var fields = cat['fields'];
      var cat_data = resume[category]
      var append = `<ul class="cat-list" data-category="${category}">\n`;

      // Iterate over every element of list in category
      for (var i in cat_data) {
        var data_pt = cat_data[i];
        var header = [fields[0]];
        // get tags
        var tags =  data_pt["_Tags"];
        // use clock to generate unique id
        var id = cat+"-"+i;
        data_pt["DOM"] = '#'+id;
        append += `<li id="${id}" class="data-pt" data-tags="General,${tags.join(",")}"><b>${data_pt[header]}</b>`;
        append += `<ul>`;
        //  Iterate over each field in the template
        for (var j in fields[1]){
          var key = fields[1][j];
          append += `<li> <span class="${className}"> ${key}: </span> ${data_pt[key]} </li>`;
        }
        append += '</ul><br></li>\n';

        // Add the tags to the taglist
        for (var j in tags) {
          var tag = tags[j];
          if (!tagList.includes(tag)) {
            tagList.push(tag);
          }
        }
      }
      append += '</ul>';
      $(div).append(append);
    }

    // Populate Resume Type List
    var append = "";
    for (var i in tagList) {
      append += `<option value="${tagList[i]}">${tagList[i]}</option>`;
    }
    $('#filterSelect').append(append);

    // Check for cookie
    cookie = getCookie();
    if (cookie["username"] != undefined) {
      var username = cookie["username"];
      var field = cookie["field"];
      $(`#filterSelect option[value="${field}"]`).attr("selected", "selected");
      filterByTag();
      $('#welcomeTxt').append(`Welcome to my resume page, <b> ${username}</b>! <br> My resume has been prefiltered for my experience related to your field of <b> ${field}! </b>`);
    }
  }

  function filterByData(field, query) {
    for (var category in resume) {
      category = resume[category];
      if (category.startsWith("_")) {
        continue;
      }
      for (var data in cat) {
        data = cat[data];
        if (data[field].includes(query)) {
          $(data["DOM"]).show();
        } else {
          $(data["DOM"]).hide();
        }
      }
    }
  }

  function filterByTag() {
    var tag = $('#filterSelect').val()
    $('#resume .cat-list .data-pt').hide();
    $('#resume .cat-list .data-pt').each(function() {
    var tags = $(this).data("tags").split(",");
    console.log(tags);
    console.log(tag);
    console.log(tags.includes(tag));

    if (tags.includes(tag)) {
      console.log("showing...");
      $(this).show();
    }
    })
  }

</script>

<style media="screen">
  #resume {
    font-variant-caps: small-caps;
  }
</style>

<?php include "template/foot.php"; ?>
