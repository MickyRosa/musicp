<!DOCTYPE html>
<?php
session_start();
if (!isset($_SESSION['party'])) {
	
}

?>
<html>
  <head>
    <meta charset="UTF-8">
	<title>Musicpong</title>
	<link rel="icon" href="img/icon.png">
	<link rel="stylesheet" href="css/style.css">
	<link rel="stylesheet" href="css/drop.css">
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
	<script src="js/player.js"></script>
	<script src="js/dbC.js?1001"></script>
	<script src="js/db.js?1001"></script>
    <script src="js/search.js"></script>
  </head>
  <body>

	<div class="column center" class="big">
				<h4 class="big">Playlist</h4>
				<h6 class="big" style="padding-bottom: 40px;">
				<?php echo(isset($_GET['party']) ? $_GET['party'] : "");?>
				</h6>
	</div>
    <div class="column add-bottom">
        <div id="mainwrap">
			
            <div id="audiowrap">
                <div class="controller">
					<a id="btnPlus" style="font-size:200px; padding:50px;"> + </a>
                </div>
				<div id="trackInput">
				<center>
					 <form id="search-term" class="search" method="post" action="index.html" >
						 <input id="searchField" autofocus autocomplete="on" type="text" value="" placeholder="Search..." 
						 style="width:60%;" class="big" /><br><br>
						 <ul id="res" class="results"></ul>
					 </form>
                   <div id="preview">
						<div id="previewPlayer" style="padding:10px; width:75%; height:25%;">preview</div>
						<p id="previewTitle" class="big" style="padding:20px;"></p>
						<a id="btnAdd" style="padding-bottom:50px; font-size:350%;" class="big">Add</a>
					</div>
				</center>
                </div>
            </div>
            <div id="plwrap">
                <ul id="plList" class="big" style="height:100%; overflow:scroll; overflow:hidden;"></ul>
            </div>
        </div>
    </div>
    <div class="column add-bottom center">
        <p class="big">Created by Manuel Weber</p>
    </div>

  </body>
</html>