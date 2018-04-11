$(document).ready(function () {
    $('#search-term').submit(function (event) {
        event.preventDefault();
        var searchTerm = $('#searchField').val();
        getRequest(searchTerm);
    });
});

function getRequest(searchTerm) {
    url = 'https://www.googleapis.com/youtube/v3/search';
    var params = {
        part: 'snippet',
        key: 'AIzaSyAqgo5LpyXsi28CgkykJ9VqG_8lgNfgzJs',
        q: searchTerm
    };
  
    $.getJSON(url, params, function (searchTerm) {
        showResults(searchTerm);
    });
}

function scrollToTop() {
	$(window).scrollTop(0);
	document.body.scrollTop = 0; // For Chrome, Safari and Opera 
    document.documentElement.scrollTop = 0; // For IE and Firefox
}

function showResults(results) {
	$('#res').empty();
    var entries = results.items;
    $.each(entries, function (index, value) {	
		var id = value.id.videoId;
		if(typeof id != "undefined") { // exclude channels
			var title = value.snippet.title;
			var thumbnail = value.snippet.thumbnails.default.url;
			var x = '<li id=' + id + '><a>' + title +'<br /><img src="' + thumbnail + '"></a></li>';
			$('#res').append(x);
		}
    }); 
	scrollToTop()
	$( "li" ).click(function() {
	  $('#res').empty();
	  video['id'] = this.id;
	  previewPlayer.cueVideoById(this.id);
			
			try {
				callAPI(this.id);
				$("#preview").show();
			} catch(e) {
				$("#previewTitle").text("failed to get video");
				$("#btnAdd").hide();
				console.log(e);
			}
	  $(window).scrollTop($("#btnPlus").offset().top);
	});
}

function callAPI(id) {
	$.get("https://www.googleapis.com/youtube/v3/videos?part=snippet&id=" + id + "&key=" + DataApiKey, function(data) {
			  video["id"] = id;
			  try {
				var title = data.items[0].snippet.title;
				video["title"] = title;
				$("#previewTitle").text(video["title"]);
				$("#btnAdd").show();
			  } catch(e) {
				$("#previewTitle").text("video not found");
				$("#btnAdd").hide();
				console.log(e);
			  }
	});
}

  $(document).ready(function(){		
  		$("#btnAdd").hide();
		$("#btnAdd").click(function(){
				addToPlaylist(video['title'], video['id']);
				$("#searchField").val('');
				$("#trackInput").slideToggle(300);
				$("#preview").hide();
    	});
	});