
	var dbPlaylistLink = "";
	var startpageLink = "/";
    
   /* playlist object */
   playlistSchema = {
		"playlistName": "test",
		"createdAt": 0,
		"timestamp": 0,
		"playlist": []
   }
   
//---------------------------- find/create playlist ------------------------
   
   $(document).ready(function(){ // <- Main

		pl = findGetParameter("party");
		if (pl) { // passed playlist -> startup
			console.log("Playlist: " + pl);
			startup(pl);
		} else { // no playlist passed -> back to startpage
			console.log("No playlist passed -> back to startpage");
			window.location = startpageLink;
		}
		
		$("#btnJoin").click(function(){
			playlistName = $("#nameField").val();
			createNewPlaylist(playlistName);
		});
    });
	
	function startup(playlistName) {
	/**
	 Checks if a playlist with the given name is contained in the db
	  -if yes: obtains its id, stores the dbPlaylistLink and 
			   calls the function to load the playlist
	  -if not: creates a new playlist with this name if GET "host" isset,
				returns to startpage else
	 **/
		u = dblink + "&q={'playlistName':'" + playlistName + "'}";
		console.log(u);
		    $.getJSON( u, function( json ) {
				r = JSON.parse(JSON.stringify(json));
				oid = 0;
				try { //if yes (playlist exists)
				   oid = String(r[0]._id.$oid);
				   console.log(oid); 
				} catch(err) { // if not
				   if (findGetParameter("host")) {
					console.log("Playlist not found -> creating new");
					createNewPlaylist(playlistName);
				   } else {
				    alert('No Playlist found with name "' + playlistName + '"');
					window.location = startpageLink;
				   }				   
				}
				if (oid != 0) {
					dbPlaylistLink = dbcollection + "/" + oid + dbkey;
					readPlaylistFromDB(); //<- from db.js
				}
			});
	}
	
	function createNewPlaylist(playlistName) {
	/** Creates a new playlist object with the given name and the current time
		and inserts it to the database (calls addPlaylistToDB) **/
			po = playlistSchema;
			po["playlistName"] = playlistName;
			po["createdAt"] = Date();
			po["timestamp"] = Date.now();
			addPlaylistToDB(po);
	}
   
   	function addPlaylistToDB(playlistObj) {
	/** 
		Inserts a new playlist document into the DB 
		Called by createNewPlaylist()!!!
	**/
		u = dbcollection + dbkey;
		console.log(u);
		$.getJSON( u, function( json ) {
			$.ajax({
				url: u,
				type: "POST",
				data: JSON.stringify( playlistObj ),
				contentType: "application/json"
			}).done(function( msg ) {
				console.log(msg);
				console.log("Playlist added to db");
			});
		});
	}
	
	function findGetParameter(parameterName) {
	/** returns the value of a GET param of the url **/
		var result = null,
			tmp = [];
		var items = location.search.substr(1).split("&");
		for (var index = 0; index < items.length; index++) {
			tmp = items[index].split("=");
			if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
		}
		return result;
	}
	
//---------------------------- use playlist ------------------------
	
		function readPlaylistFromDB() {
		/** loads the playlist from the db by its id 
		calls methods to
		-> add the tracks to the local playlist
		-> refresh the playlist if outdated **/
			console.log("loading playlist...");
			$.getJSON( dbPlaylistLink, function( json ) {
				var playlist = JSON.parse(JSON.stringify(json.playlist));
				refreshPlaylistIfOutdated(playlist); //<-
				for (var i = 0; i < playlist.length; i++) {
					var dbTrack = playlist[i];
					var track = buildTrack(dbTrack.title, dbTrack.id);
					addToLocalPlaylist(track);//<-
				}
				console.log(playlist.length + " tracks added to local playlist");
			});
		}
	
		function updateDBplaylist(track, entries) {
		/** track = track to insert
			entries = number of current entries in the local playlist
			-Updates the local playlist first (if new entries in db)
			-Adds the track to the database playlist
			-Adds the track to the local playlist (as the last one) **/
			$.getJSON( dbPlaylistLink, function( json ) {
				var playlist = JSON.parse(JSON.stringify(json.playlist));
				privateUpdate(playlist, entries);
				var no = playlist.length + 1;
				$.ajax( { url: dbPlaylistLink,
				  data: JSON.stringify( { "$push" : { "playlist" : 
				  {"no" : no, "title" : track["title"], "id" : track["id"], "duration" : track["duration"],
				   "timestamp" : Date.now() } } } ),
				  type: "PUT",
				  contentType: "application/json" } );
				addToLocalPlaylist(track);
			});
		}
		
		function privateUpdate(playlist, entries) {
			//console.log("entries " + entries + " DBlength " + playlist.length);
			for (i = entries; i < playlist.length; i++) {
				var dbTrack = playlist[i];
				//console.log("--> " + dbTrack.no + " " + dbTrack.title + " " + dbTrack.id);
				var track = buildTrack(dbTrack.title, dbTrack.id);
				addToLocalPlaylist(track);
			}
		}
		
		function updateLocalPlaylist(entries) {
		/** entries = number of current entries in the local playlist 
		Updates the local playlist if there are new tracks in the database.
		**/
			var get = $.getJSON( dbPlaylistLink, function( json ) {
				var playlist = JSON.parse(JSON.stringify(json.playlist));
				privateUpdate(playlist, entries);
			});		
		}

//---------------------------- refresh playlist ------------------------

		function refreshPlaylistIfOutdated(playlist) {
		 /** If the last track added to the playlist was more than 48h ago
		     calls function to 
			 -> backup and drop the playlist in the db 
			    and refresh the page **/
			var ttl = 172800000;  //1000 * 60 * 60 * 48
			var t;
			try {
				t = playlist[playlist.length-1].timestamp;
			} catch (err) {}
			if ( Date.now() - t > ttl ) { // expired
				console.log("Playlist is expired -> refreshing"); 
				dropAndBackupDBplaylist(); // <-
			}
		}
		
		function backupDBplaylist() {
		/** appends the current playlist to the backup document and adds the current time **/
			u = dbPlaylistLink;
			uu = dbbackuplink;
			$.getJSON( u, function( json ) {
				var playlistToBackup = JSON.parse(JSON.stringify(json.playlist));
				$.ajax({
					url: uu,
					type: "PUT",
					/* data: JSON.stringify( { "playlist" : [] } ), <- del all other elements */
					data: JSON.stringify({ "$push" : { "playlists" :  {
												"time": Date(),
												"playlist": playlistToBackup} }}),
					contentType: "application/json"
				}).done(function( msg ) {
					console.log(msg);
					console.log("Playlist backup stored");
				});
			});
	}
	
	function dropDBplaylist() {
	/** Clears a playlist in the DB (no backup!) and refreshes the page. 
	    Only used by refreshPlaylistIfOutdated (see marked lines) !!!    **/
		u = dbPlaylistLink;
		$.getJSON( u, function( json ) {
			$.ajax({
				url: u,
				type: "PUT",
				/* data: JSON.stringify( { "playlist" : [] } ), <- del all other elements */
				data: JSON.stringify({ "$set" : { "playlist" : [] } }),
				contentType: "application/json"
			}).done(function( msg ) {
				console.log(msg);
				console.log("playlist cleared!");
				alert("This playlist expired! \rNo new track has been added for more than 48h."); //<-
				location.reload();        //<-
			});
		});
	}
		
	function dropAndBackupDBplaylist() {
	  backupDBplaylist();
	  dropDBplaylist();
	}
		
	
