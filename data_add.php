<?php include "template/head.php"; ?>
<?php include "template/top-menu.php"; ?>

<div class="container" style="padding-top: 100px;">

    <h1>Add Person to Database</h1>

    <form class="" action="data_view.php" method="post">
        <div class="form-group">
            <label for="fname">First Name: </label>
            <input type="text" name="fname" value="" class="form-control"></input>
        </div>

        <div class="form-group">
            <label for="lname">Last Name: </label>
            <input type="text" name="lname" value="" class="form-control"></input>
        </div>

        <div class="form-group">
            <label for="lname">Favorite Number: </label>
            <input type="number" name="faveNum" value="" class="form-control"></input>
        </div>

        <div class="form-group">
            <label for="lname">Short Message: </label>
            <input type="number" name="shortMsg" value="" class="form-control"></input>
        </div>

        <button type="submit" name="addPerson" class="btn btn-large btn-primary">Add Person</button>
    </form>

</div>

<?php include "template/footer-menu.php"; ?>
<?php include "template/foot.php"; ?>
