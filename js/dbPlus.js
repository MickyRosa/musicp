  
 
   /**
   DATABASE CONNECTION data
   use dbcollection + dbdoc + dbkey
   or dblink for playlist document
   **/
   var dblink = "https://api.mlab.com/api/1/databases/pongdb/collections/playlist?apiKey=A5eUROxRywktpLhyYovOeMI4IawsQocj";
   var dbcollection = "https://api.mlab.com/api/1/databases/pongdb/collections/playlist"
   //var dbBackupDoc = "/5aa6a80bf36d28237f1aab8c"
   var dbdoc = "/5927ef12734d1d687a5753ab";
   var dbkey =  "?apiKey=A5eUROxRywktpLhyYovOeMI4IawsQocj";
   var dbBackupLink = "https://api.mlab.com/api/1/databases/pongdb/collections/backup/5aae9f19f36d284c92152b2e" + dbkey
   
   /**
    MAIN
	**/
   $(document).ready(function(){
		dropAndBackupDBplaylist();
   });
	
	function backupDBplaylist() {
	/** appends the current playlist to the backup document and adds the current time **/
			u = dbcollection + dbdoc + dbkey
			$.getJSON( u, function( json ) {
				var playlistToBackup = JSON.parse(JSON.stringify(json.playlist));
				uu = dbcollection + dbBackupDoc + dbkey
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
				});
			});
	}
	
	function dropDBplaylist() {
	/** clears a playlist in the DB (no backup!)**/
		u = dbcollection + dbdoc + dbkey
		$.getJSON( u, function( json ) {
			$.ajax({
				url: u,
				type: "PUT",
				/* data: JSON.stringify( { "playlist" : [] } ), <- del all other elements */
				data: JSON.stringify({ "$set" : { "playlist" : [] } }),
				contentType: "application/json"
			}).done(function( msg ) {
				console.log(msg);
			});
		});
	}
		
	function dropAndBackupDBplaylist() {
	  backupDBplaylist();
	  dropDBplaylist();
	}