var apiKEY = "JOxnIA8lNaXSQ1aTWFrG4lF6s9aSAKxEbERVNEE5NHZNQT0g";
var question = "arduino";
var maxSize = 30;
////console.log(getInfo("stuff"));
//LINE 157 PROBLEMATIC
////console.log(layer.markers());
function startStuff() {
	getInfo(question);
	setInterval(function() {
		getInfo(question)
	}, 660);
	//if you need strictly data things updating, update them in getInfo. Else, go find checkForSongData and graph updating.
	//getInfo(question);
}

function validateAPIkey() {
	console.log(document.getElementById('apiQueryAccess').value.length);
	if(document.getElementById('apiQueryAccess').value.length == 0){
		console.log("QUESTION");
		document.getElementById('QUESTIONfail').style.display = 'inline-block';
		document.getElementById('APIfail').style.display = 'none';
	}
	else if(document.getElementById('apiAccess').value.length == 0){
		console.log("APILENGTH");
		document.getElementById('APIfail').style.display = 'inline-block';
		document.getElementById('QUESTIONfail').style.display = 'none';
	}
	else{
		console.log("stuff");
		if (apiValidation(document.getElementById('apiAccess').value)) {
			apiKEY = document.getElementById('apiAccess').value;
			question = document.getElementById('apiQueryAccess').value;
			document.getElementById('APIfail').style.display = 'none';
			document.getElementById('overlay').style.display = 'none';
			startStuff();
		}
		else{
			document.getElementById('APIfail').style.display = 'inline-block';
			document.getElementById('QUESTIONfail').style.display = 'none';
		}
	}
}
function apiValidation(supposedKey) {
	var validKey = false;
	console.log("testing");
	$.ajax({
		type : "GET",
		url : "http://api.cosm.com/v2/" + "feeds",
		beforeSend : function(request) {
			request.setRequestHeader("X-ApiKey", supposedKey);
		},
		async : false,
		data : "{}",
		always : function() {
			console.log("done");
		},
		error : function(response) {
			console.log(response);
		},
		success : function(response) {
			validKey = true;
		},
		error : function(response) {

			validKey = false;

		}
	});
	if (!validKey) {
		console.log("false");
		return false;
	} else {
		console.log("true");
		return true;
	}
}

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
			//console.log("done");
		},
		success : function(response) {
			//	document.getElementById("spanner").innerHTML = response;
			//	//console.log(response);
			//			//console.log();
			////console.log(response.totalResults);
			json = new Array();
			layer.features([]);
			//for(var i = 0; i < response.length; i++){
			for (var i = 0; i < response.length; i++) {
				////console.log(response.results[i]);
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
			//console.log(response);
		}
	});

}

function updateInfo(idOfDiv) {
	//console.log("being called");
	if (document.getElementById("feedId") != null) {
		var idOfThing = document.getElementById("feedId").innerHTML;
	}
	for (var i = 0; i < json.length; i++) {

		if (chosenFeeds[json[i].id] != undefined) {
			for (var dataI = 0; dataI < json[i].datastreams.length; dataI++) {
				for (var IJSON = 0; IJSON < chosenFeeds[json[i].id].length; IJSON++) {
					if (json[i].datastreams[dataI].id == chosenFeeds[json[i].id][IJSON][0]) {
						chosenFeeds[json[i].id][IJSON][1] = json[i].datastreams[dataI].current_value;
						//value   //json[i].datastreams[j].current_value
						chosenFeeds[json[i].id][IJSON][2] = json[i].datastreams[dataI].max_value;
						//maxima
						chosenFeeds[json[i].id][IJSON][3] = json[i].datastreams[dataI].min_value;
						//minima
						console.log(json[i].id + chosenFeeds[json[i].id][IJSON][0] + "liveValue");
						document.getElementById(json[i].id + chosenFeeds[json[i].id][IJSON][0] + "liveValue").innerHTML = chosenFeeds[json[i].id][IJSON][1]
						document.getElementById(json[i].id + chosenFeeds[json[i].id][IJSON][0] + "liveMax").innerHTML = chosenFeeds[json[i].id][IJSON][2]
						document.getElementById(json[i].id + chosenFeeds[json[i].id][IJSON][0] + "liveMin").innerHTML = chosenFeeds[json[i].id][IJSON][3]
						//liveValue. liveMin, liveMax
						//console.log(chosenFeeds[json[i].id][IJSON][6]);
						////console.log("updating "+chosenFeeds[json[i].id][IJSON][0]);
						//	chosenFeeds[json[i].id][IJSON][4].series[0]
						//console.log(chosenFeeds[json[i].id][IJSON][5]);

						//chosenFeeds[json[i].id][IJSON][4].series[0].data.push([(new Date()).getTime(),json[i].datastreams[dataI].current_value]);
					}
				}
			}
		}

		if (idOfThing == json[i].id) {
			//console.log(json[i]);
			var string = "<div id='dataWrapper'>";
			string += "<h3>" + json[i].title + "</h3><h5 id='uniqueDataFeedDisplayIdentifier'>" + json[i].id + "</h5>";
			string += "<p id='creator'>Creator : <a href='" + json[i].creator + "'target='_blank'>" + json[i].creator.substring(23, json[i].creator.length) + "</a></p>";
			//console.log();
			if (json[i].description != undefined) {
				string += "<p id='feedDescription'>" + json[i].description + "</p>";
			}
			string += "<div id='dataStreamDataList'>";
			string += "<ul>";

			for (var j = 0; j < json[i].datastreams.length; j++) {
				var listed = false;
				//chosenFeeds[feedId].push([dataId, currentVal]) ;
				if (chosenFeeds[json[i].id] == undefined) {
					string += "<li><div class='dataWrapping' id='" + json[i].datastreams[j].id + "'><div class='listItem' >";
				} else if (chosenFeeds[json[i].id] != undefined) {
					var found = false;
					//for loop to see if found.
					for (var zed = 0; zed < chosenFeeds[json[i].id].length; zed++) {
						if (chosenFeeds[json[i].id][zed][0] == json[i].datastreams[j].id) {
							found = true;
						}
					}

					if (found == false) {
						string += "<li><div class='dataWrapping' id='" + json[i].datastreams[j].id + "'><div class='listItem' >";
					}
					if (found != false) {
						listed = true;
						string += "<li><div class='dataWrapping listed' id='" + json[i].datastreams[j].id + "'><div class='listItem' >";
					}
				}
				string += "<p id='id'>" + json[i].datastreams[j].id + "</p>";
				string += "<p>VALUE : <span id='value' data-val='" + json[i].datastreams[j].current_value + "'>" + json[i].datastreams[j].current_value + "</span></p>";
				string += "<p>MAX_VALUE : <span id='maxVal'>" + json[i].datastreams[j].max_value + "</span></p>";
				string += "<p>MIN_VALUE : <span id='minVal'>" + json[i].datastreams[j].min_value + "</span></p>";
				string += "</div><div class='ButtonSection'>";
				if (listed == false) {
					string += "<input type='button' value='Sonify Me!' id='addToMusic' onclick='(function(){sonifyAdd(\"" + json[i].id + ":" + json[i].datastreams[j].id + ":" + json[i].datastreams[j].current_value + ":" + json[i].datastreams[j].max_value + ":" + json[i].datastreams[j].min_value + "\");})();'>";
					string += "<input type='button' value='Maybe Not...' style='display:none' id='removeFromMusic' onclick='(function(){sonifyRemove(\"" + json[i].id + ":" + json[i].datastreams[j].id + "\");})();'>";
				}
				if (listed != false) {
					string += "<input type='button' value='Sonify Me!' id='addToMusic' style='display:none;' onclick='(function(){sonifyAdd(\"" + json[i].id + ":" + json[i].datastreams[j].id + ":" + json[i].datastreams[j].current_value + "\");})();'>";
					string += "<input type='button' value='Maybe Not...' style='display:inline-block;' id='removeFromMusic' onclick='(function(){sonifyRemove(\"" + json[i].id + ":" + json[i].datastreams[j].id + "\");})();'>";
				}
				//id,current_value, max_value, min_value
				string += "</div>";
				string += "</div>";
			}
			string += "</div>";
			string += "</ul>";
			string += "</div>";
			document.getElementById("feedList").innerHTML = string;
			document.getElementById("feedList").setAttribute("FeedId", idOfThing);
		}
	}
	if (found == false) {
		document.getElementById("feedList").innerHTML = "Your feed seems to have vanished!";
	}
	//console.log("thing being calleds");
	displayListUpdate();
}

function getPertinentInfo() {
	if (document.getElementById("feedId") != null) {
		var idOfThing = document.getElementById("feedId").innerHTML;
	}
	for (var i = 0; i < json.length; i++) {
		if (idOfThing == json[i].id) {
			//console.log(json[i]);
			var string = "<div id='dataWrapper'>";
			string += "<h3>" + json[i].title + "</h3><h5 id='uniqueDataFeedDisplayIdentifier'>" + json[i].id + "</h5>";
			string += "<p id='creator'>Creator : <a href='" + json[i].creator + "'target='_blank'>" + json[i].creator.substring(23, json[i].creator.length) + "</a></p>";
			//console.log();
			if (json[i].description != undefined) {
				string += "<p id='feedDescription'>" + json[i].description + "</p>";
			}
			string += "<div id='dataStreamDataList'>";
			string += "<ul>";

			for (var j = 0; j < json[i].datastreams.length; j++) {
				var listed = false;
				//chosenFeeds[feedId].push([dataId, currentVal]) ;
				if (chosenFeeds[json[i].id] == undefined) {
					string += "<li><div class='dataWrapping' id='" + json[i].datastreams[j].id + "'><div class='listItem' >";
				} else if (chosenFeeds[json[i].id] != undefined) {
					var found = false;
					//for loop to see if found.
					for (var zed = 0; zed < chosenFeeds[json[i].id].length; zed++) {
						if (chosenFeeds[json[i].id][zed][0] == json[i].datastreams[j].id) {
							found = true;
						}
					}

					if (found == false) {
						string += "<li><div class='dataWrapping' id='" + json[i].datastreams[j].id + "'><div class='listItem' >";
					}
					if (found != false) {
						listed = true;
						string += "<li><div class='dataWrapping listed' id='" + json[i].datastreams[j].id + "'><div class='listItem' >";
					}
				}
				string += "<p id='id'>" + json[i].datastreams[j].id + "</p>";
				string += "<p>VALUE : <span id='value' data-val='" + json[i].datastreams[j].current_value + "'>" + json[i].datastreams[j].current_value + "</span></p>";
				string += "<p>MAX_VALUE : <span id='maxVal'>" + json[i].datastreams[j].max_value + "</span></p>";
				string += "<p>MIN_VALUE : <span id='minVal'>" + json[i].datastreams[j].min_value + "</span></p>";
				string += "</div><div class='ButtonSection'>";
				if (listed == false) {
					string += "<input type='button' value='Sonify Me!' id='addToMusic' onclick='(function(){sonifyAdd(\"" + json[i].id + ":" + json[i].datastreams[j].id + ":" + json[i].datastreams[j].current_value + ":" + json[i].datastreams[j].max_value + ":" + json[i].datastreams[j].min_value + "\");})();'>";
					string += "<input type='button' value='Maybe Not...' style='display:none' id='removeFromMusic' onclick='(function(){sonifyRemove(\"" + json[i].id + ":" + json[i].datastreams[j].id + "\");})();'>";
				}
				if (listed != false) {
					string += "<input type='button' value='Sonify Me!' id='addToMusic' style='display:none;' onclick='(function(){sonifyAdd(\"" + json[i].id + ":" + json[i].datastreams[j].id + ":" + json[i].datastreams[j].current_value + "\");})();'>";
					string += "<input type='button' value='Maybe Not...' style='display:inline-block;' id='removeFromMusic' onclick='(function(){sonifyRemove(\"" + json[i].id + ":" + json[i].datastreams[j].id + "\");})();'>";
				}
				//id,current_value, max_value, min_value
				string += "</div>";
				string += "</div>";
			}
			string += "</div>";
			string += "</ul>";
			string += "</div>";
			document.getElementById("feedList").innerHTML = string;
			document.getElementById("feedList").setAttribute("FeedId", idOfThing);
		}
	}
}

