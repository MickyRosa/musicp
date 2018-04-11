<!DOCTYPE html>
<?php
session_start();
if (!isset($_SESSION['party'])) {
	
}

?>
<html>
  <head>
	<link rel="stylesheet" href="css/style.css">
	<link rel="stylesheet" href="css/drop.css">
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
	<script src="js/player.js"></script>
	<script src="js/dbC.js?1001"></script>
	<script src="js/db.js?1001"></script>
    <script src="js/search.js"></script>
	<link rel="icon" href="img/icon.png">
<!--	<script>
	  var listener = setInterval(test, 2000);
	  function test() {
		console.log("teeest");
	  }
	</script> -->
  </head>
  <body>
    <div id="player">loading player...</div>

	<div class="container">
	<!--<div class="column center">-->
				<!--- <h6>w/ Playlist</h6> -->
	<!--</div>--><br>
    <div class="column add-bottom">
        <div id="mainwrap">
			
            <div id="audiowrap">
                <div class="controller">
                    <a id="btnPrev">&laquo;</a>
					<a id="btnPlus"> + </a>
                    <a id="btnNext">&raquo;</a>
                </div>
				<div id="trackInput">
				<center>
					 <form id="search-term" class="search" method="post" action="index.html" >
						 <input id="searchField" autofocus autocomplete="on" type="text" value="" placeholder="Search..." 
						 style="width:90%" /><br><br>
						 <ul id="res" class="results"></ul>
					 </form>
                   <div id="preview">
						<div id="previewPlayer">preview</div>
						<p id="previewTitle"></p>
						<a id="btnAdd">&raquo;</a>
					</div>
				</center>
                </div>
            </div>
            <div id="plwrap">
                <ul id="plList" style="height:200px; overflow:scroll; overflow:hidden;"></ul>
            </div>
        </div>
    </div>
    <div class="column add-bottom center">
        <p>Created by Manuel Weber</p>
    </div>
</div>
  </body>
</html>