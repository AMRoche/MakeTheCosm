var JSON = {};
//information object for feeds that have been chosen.
var json;
//global information object
function sonifyAdd(input) {
	var feedId = input.split(":")[0];
	var dataId = input.split(":")[1];
	var currentVal = input.split(":")[2];
	var maxVal = input.split(":")[3];
	var minVal = input.split(":")[4];
	document.getElementById(dataId).getElementsByClassName("ButtonSection")[0].childNodes[0].style.display = "none";
	document.getElementById(dataId).getElementsByClassName("ButtonSection")[0].childNodes[1].style.display = "inline-block";
	document.getElementById(dataId).className = "dataWrapping listed";

	if (JSON[feedId] == undefined) {
		console.log("undefined");
		JSON[feedId] = new Array();
		JSON[feedId].push([dataId, currentVal, maxVal, minVal]);
	} else if (JSON[feedId] != undefined) {
		console.log("found" + dataId + "," + feedId);
		JSON[feedId].push([dataId, currentVal, maxVal, minVal]);
	}
	console.log(JSON);
	displayListUpdate();
	//document.getElementById(dataId).getElementsByClassName("ButtonSection")[0].childNodes.item("removeFromMusic").style.display = "inline-block";
	//start here tomorrow.
}

function sonifyRemove(input) {
	//.splice(2,1)
	var feedId = input.split(":")[0];
	var dataId = input.split(":")[1];
	document.getElementById(dataId).getElementsByClassName("ButtonSection")[0].childNodes[0].style.display = "inline-block";
	document.getElementById(dataId).getElementsByClassName("ButtonSection")[0].childNodes[1].style.display = "none";
	console.log(input);
	document.getElementById(dataId).className = "dataWrapping";
	for (var i = 0; i < JSON[feedId].length; i++) {
		if (JSON[feedId][i][0] == dataId) {
			JSON[feedId].splice(i, 1);
			console.log(JSON[feedId]);
		}
	}
	if (JSON[feedId].length == 0) {
		delete JSON[feedId];
	}
	displayListUpdate();
}

function sonifyRemoveArray(input) {
var FeedId = input.split(":")[0];
var StreamId = input.split(":")[1];
	if(document.getElementById("uniqueDataFeedDisplayIdentifier").innerHTML == FeedId){
		document.getElementById(StreamId).className = "dataWrapping";
		document.getElementById(StreamId).getElementsByClassName("ButtonSection")[0].childNodes[0].style.display = "inline-block";
		document.getElementById(StreamId).getElementsByClassName("ButtonSection")[0].childNodes[1].style.display = "none";
	}
	
	for (var i = 0; i < JSON[FeedId].length; i++) {
		if (JSON[FeedId][i][0] == StreamId) {
			JSON[FeedId].splice(i, 1);
			console.log(JSON[FeedId]);
		}
	}
	if (JSON[FeedId].length == 0) {
		delete JSON[FeedId];
	}
	displayListUpdate();
}

function displayListUpdate() {
	console.log("running!");
	var insertThing = "<ul>";

	for (var key in JSON) {
		for (var i = 0; i < JSON[key].length; i++) {
			insertThing += "<li>";
			insertThing += "<div class='quickWrapper'>";
			insertThing += "<div class='infoWahn'>";
			insertThing += "<div class='dataId'><h3>"+key + " :// " + JSON[key][i][0] + "</h3></div>";
			insertThing += "<div class='curVal'>Value >> " + JSON[key][i][1] + "</div>";
			insertThing += "<div class='maxVal'>Maxima >> " + JSON[key][i][2] + "</div>";
			insertThing += "<div class='minVal'>Minima >> " + JSON[key][i][3] + "</div>";
			insertThing += "</div>";
			insertThing += "<input type='button' value='Maybe Not...' style='display:inline-block;' id='removeFromArray' onclick='(function(){sonifyRemoveArray(\"" + key + ":" + JSON[key][i][0] + "\");})();'>";
			insertThing += "</div>";
		}
	}

	insertThing += "</ul>";
	document.getElementById("quickInfoSummation").innerHTML = insertThing;
}
