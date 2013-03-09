var json;
var apiKEY = "JOxnIA8lNaXSQ1aTWFrG4lF6s9aSAKxEbERVNEE5NHZNQT0g";
var question = "MakeyMakey";
var maxSize = 30;
//console.log(getInfo("stuff"));

//console.log(layer.markers());
setInterval(function() {
	getInfo(question)
}, 660);
//getInfo(question);
function getInfo(query) {
	$.ajax({
		type : "GET",
		url : "backend/dataRetrieval.php",
		crossDomain : true,
		beforeSend : function(request) {
			//request.overrideMimeType("text/plain; charset=utf-8");
			//request.setRequestHeader("X-ApiKey", apiKEY);
		},
		//$apiKEY = $_GET['APIkey'];
		//$q = $_GET['question'];
		//$maxCount = $_GET['maxCount'];
		async : true,
		data : {
			"APIkey" : apiKEY,
			"question" : query,
			"maxCount" : "50"
		},
		always : function() {
			console.log("done");
		},
		success : function(response) {
			//	document.getElementById("spanner").innerHTML = response;
			//	console.log(response);
			//			console.log();
			//console.log(response.totalResults);
			json = new Array();
			layer.features([]);
			//for(var i = 0; i < response.length; i++){
			for (var i = 0; i < response.length; i++) {
				//console.log(response.results[i]);
				json.push(response[i]);
				layer.add_feature({
					'geometry' : {
						'coordinates' : [response[i].location.lon, response[i].location.lat]
					},
					'properties' : {
						// https://github.com/mapbox/simplestyle-spec
						'marker-color' : colour,
						'marker-symbol' : 'embassy',
						'feedName' : response[i].title,
						'desc' : response[i].description,
						'datastreams' : response[i].datastreams,
						'id' : response[i].id
					}
				});

			}
			var checkId = document.getElementById("feedList").getAttribute("feedId");
			if (checkId != undefined) {
				updateInfo(checkId);
			}
			//			layer.features(layer.markers());
			var markers = document.getElementsByClassName('simplestyle-marker');
			for (var i = 0; i < markers.length; i++) {
				markers[i].addEventListener("click", getPertinentInfo);
			}
		},
		error : function(response) {
			console.log(response);
		}
	});

}

function updateInfo(idOfDiv) {
	var found = false;
	for (var i = 0; i < json.length; i++) {
		if (idOfDiv == json[i].id) {
			found = true;
			document.getElementById("feedList").innerHTML = "<p>" + JSON.stringify(json[i]) + "</p>";
			console.log("updating");
		}
	}
	if (found == false) {
		document.getElementById("feedList").innerHTML = "Your feed seems to have vanished!";
	}
}

function getPertinentInfo() {
	var idOfThing = document.getElementById("feedId").innerHTML;
	for (var i = 0; i < json.length; i++) {
		if (idOfThing == json[i].id) {
			document.getElementById("feedList").innerHTML = "<p>" + JSON.stringify(json[i]) + "</p>";
			document.getElementById("feedList").setAttribute("FeedId", idOfThing);
		}
	}
}
