	
		var DataApiKey = "AIzaSyAqgo5LpyXsi28CgkykJ9VqG_8lgNfgzJs";
		var player; // iFrame
	    var previewPlayer;
		var video = {"no": "-", "title": "-", "duration": "-", "id": "-"}
		var current = 0;
		var tracks = [];
		/* 
		{"no": 1, "title": "Alan Walker - Without love (Official Video)[NCS]", "duration": "-", "id": "d52DNI1qTBk"},
		  ...
		*/
		
		function clone(obj) {
			if (null == obj || "object" != typeof obj) return obj;
			var copy = obj.constructor();
			for (var attr in obj) {
				if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
			}
			return copy;
		}
		
		function buildTrack(title, id) {
			video['no'] = 'X';
			video['title'] = title;
			video['id'] = id;
			video['duration'] = "-";
			var track = clone(video);
			return track;
		}
		
		function addToLocalPlaylist(track) {
			tracks.push(track);
			var li = '<li id="track' + tracks.length
			+ '"><div class="plItem"><div class="plNum">' + tracks.length
			+ '.</div><div class="plTitle">' + track.title
			+ '</div><div class="plDistributor">' + ''
			+ '</div></div></li>';
			$("#plList").append(li);
			return track;
		}
		
	/*	function addToLocalPlaylist(no, title, id) {
			video['no'] = no;
			video['title'] = title;
			video['id'] = id;
			video['duration'] = "-";
			var track = clone(video);
			tracks.push(track);
			var li = '<li id="track' + no
			+ '"><div class="plItem"><div class="plNum">' + no
			+ '.</div><div class="plTitle">' + title
			+ '</div><div class="plDistributor">' + ''
			+ '</div></div></li>';
			$("#plList").append(li);
			return track;
		}
	*/

		function addToPlaylist(title, id) {
		/**Adds a new track to the local AND the database playlist **/
			var track = buildTrack(title, id);
			updateDBplaylist(track, tracks.length);
		}

      function onPlayerReady(event) {
        event.target.playVideo();
      }

      var done = false;
      function onPlayerStateChange(event) {
        if (event.data == YT.PlayerState.PLAYING) {
			var ref = "#track" + current;
			$(ref).css('color', 'green');
			scrollUpPlaylist();
        }
		if (event.data == YT.PlayerState.ENDED) {
			var ref = "#track" + current;
			$(ref).css('color', 'grey');
			nextVideo()
		}
      }
	  
	  function scrollUpPlaylist() {
		if (current > 0) {
			if (tracks.length > 1) {
				ref="#track" + current;
				console.log(ref);
				$('#plList').animate({scrollTop: ($(ref).position().top - $("#track1").position().top)}, "slow");
			}
		} else {
			$('#plList').scrollTop(0);
		}
	  }
	  
	  function nextVideo() {
	  /** 
	  Checks for updates and then loads the next track into the player
	  (if there are no more tracks in the list it stops the player)
	  **/
	    updateLocalPlaylist(tracks.length);
		if (tracks.length > current) {
			current += 1;
			console.log(player.loadVideoById({videoId: tracks[current-1].id}));
		} else {
			player.stopVideo();
		}
	  }
	  
	  function onError(event) {
		console.log(event);
		var ref = "#track" + current;
		$(ref).css('color', 'red');
		nextVideo()
	  }
	  
	  	  var tag = document.createElement('script'); // iFrame Player API
		  tag.src = "https://www.youtube.com/iframe_api";
		  var firstScriptTag = document.getElementsByTagName('script')[0];
		  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
		  
		  function onYouTubeIframeAPIReady() {
			console.log("yt ready");
		  }
	  
	  $(window).on('load', function() {
	  
	  	/* Initialize player after the rest of the site */
		 player = new YT.Player('player', {
			  height: '360',
			  width: '100%',
			  videoId: 'g4hGRvs6HHU',
			  events: {
				'onReady': onPlayerReady,
				'onStateChange': onPlayerStateChange,
				'onError': onError
			  }
			});
			previewPlayer = new YT.Player('previewPlayer', {
			  height: '100',
			  width: '200',
			  videoId: 'g4hGRvs6HHU'
			});

	  });
	  
	  $(document).ready(function(){
	  
		 $("#trackInput").hide();
		 $("#preview").hide();	
		 readPlaylistFromDB();
		 
		 // check for playlist updates every 5 seconds:
		 setInterval(listen, 2000);
	     function listen() {
			updateLocalPlaylist(tracks.length);
		 }
	  
		$("#btnPlus").click(function(){
		    //$(window).scrollTop($("#btnPlus").offset().top);
			$("#trackInput").slideToggle(300);
		});
		
		$("#btnNext").click(function() {
			var ref = "#track" + current;
			$(ref).css('color', 'grey');
			nextVideo();

		});
		$("#btnPrev").click(function() {
			if (current > 1) {
				var ref = "#track" + current;
				$(ref).css('color', 'grey');
				current -= 1;
				console.log(player.loadVideoById({videoId: tracks[current-1].id}));
			}
		});
		
	});