var chosenFeeds = {};
//information object for feeds that have been chosen.
var json;
//global information object
var BPM = 120;
var graphUpdateTime = 2;
//graph updates per second.
var graphResolution = 100;
//period in seconds to display on the graph.
var basePath = "audio/";
//base path to all of the files in question. folder structure is handled in the json file.
var soundFiles = loadJSON(basePath + "audioList.json");
var idPrefix = "addSound";
var songsSelected = [];

//add extra part in to global information object to be checked for to see if there is any listen requirements already set.
//based on what is in the array at that point act on it in seperate method called every time there's a successful ajax call
//returned to us. Should do it.
// <- link to HTML5 audio -> http://www.position-absolute.com/articles/introduction-to-the-html5-audio-tag-javascript-manipulation/
//add a select box for the sound to trigger. That needs doing.
//save the sound selected to an array too in name form and, on cycling through it, have it played. Wham.

// onChange = (function(){setPlayArray(1,"+feedId+","+dataId+",this.value)});
//	chosenFeeds[feedId] array structure for each object.[dataId, currentVal, maxVal, minVal, GRAPH, sonificationInformation[] ]);
// sonificationInformation[] structure :
//http://freesound.org/people/fins/sounds/?page=1#sound
setInterval(function() {
	checkForSongData();
}, 60000 / BPM);
setInterval(function() {
	graphUpdate();
}, 1000 / graphUpdateTime);
addAudioList();
//addAudioList(); //uncomment this once you've sorted it for the heirachy of your page. Shit works super fine though.
//have audio dump to a hidden div for preview function, and then once added have it add to the div with the list of stuff.
//list for the audio file. Include vital stats (maybe? Length? Description? Ask Brock?);

function addAudioList() {
	var fileTypes = soundFiles.opts;
	var stringToInsert = "<select id='addAudioMenu' onchange = (function(){addAudio(document.getElementById('addAudioMenu').value)})();>"
	stringToInsert += "<option value = ''>- Select an audio track -</option>";
	var indexing = 0;
	for (var key in soundFiles) {
		if (key == "init") {
			if (soundFiles[key].length > 0) {
				populateAudioList();
			}
		}
		if (key != "opts" && key != "init") {
			for (var i = 0; i < soundFiles[key].length; i++) {
				stringToInsert += "<option value = '" + i + "||" + key + "||" + soundFiles[key][i][0] + "'>" + soundFiles[key][i][0].replace(/_/g, ' ') + "</option>";
			}
		}
	}
	stringToInsert += "</select>"
	document.getElementById("audioList").innerHTML = stringToInsert;
}

function addAudio(songToAdd) {
	var index = songToAdd.split("||")[0];
	var songFolder = songToAdd.split("||")[1];
	var songName = songToAdd.split("||")[2];
	if(songToAdd != ""){
		document.getElementById("removeFromListButton").style.display = "block";
		document.getElementById("addToListButton").style.display = "block";
		document.getElementById("pauseButton").style.display = "block";
		document.getElementById("previewButton").style.display = "block";
	}
	else{
		document.getElementById("removeFromListButton").style.display = "none";
		document.getElementById("addToListButton").style.display = "none";
		document.getElementById("pauseButton").style.display = "none";
		document.getElementById("previewButton").style.display = "none";
		document.getElementById("soundDescriptionPreview").innerHTML = "<p>Please select an audio track.</p>";		
	}
	if (songToAdd != "" && document.getElementById(idPrefix + songFolder + songName) == undefined) {
	//	songsSelected.push(songToAdd);
		//now to add audio element
		var insertString = "<audio class='hiddenAudioPlayers' id='" + idPrefix + songFolder + songName + "'>";
		for (var i = 0; i < soundFiles.opts.length; i++) {
			////console.log(soundFiles.opts[i][0]);
			insertString += "<source src='" + basePath + songFolder + "/" + songName + "." + soundFiles.opts[i][0] + "' type='audio/" + soundFiles.opts[i][1] + "'>";
		}
		insertString += "</audio>";
		document.getElementById("audioTryoutWrapper").innerHTML = insertString;
	}
	if(document.getElementById(idPrefix+songFolder+songName)!=undefined){
		document.getElementById("previewButton").innerHTML = "<input value = '>'type = 'button' onclick='document.getElementById(\"" + idPrefix + songFolder + songName + "\").play()'>";
		document.getElementById("pauseButton").innerHTML = "<input value = '||'type = 'button' onclick='document.getElementById(\"" + idPrefix + songFolder + songName + "\").pause()'>";
		//console.log(soundFiles);
		//console.log(songFolder);
		document.getElementById("soundDescriptionPreview").innerHTML = "<p>" + soundFiles[songFolder.toString()][index][1] + "</p>";
		//document.getElementById(idPrefix + songFolder + songName).play();
		document.getElementById("addToListButton").innerHTML = '<input type="button" value="+"onclick="(function(){addAudioToList(document.getElementById(\'addAudioMenu\').value)})();"/>';
		document.getElementById("removeFromListButton").innerHTML = '<input type="button" value="-"onclick="(function(){removeAudioFromList(document.getElementById(\'addAudioMenu\').value)})();"/>';

	}
}
function updateAudioLists(type, info){
	var index = info.split("||")[0];
	var songFolder = info.split("||")[1];
	var songName = info.split("||")[2];
	var domList = document.getElementsByClassName("soundOptions");
	var vitalStats = document.getElementsByClassName("feedVitalStats");
	console.log(songName);
	if(type == "add"){
		for(var i = 0; i < domList.length; i++){ 
			var element = document.createElement('option');
			element.setAttribute('value',info);
			element.appendChild(document.createTextNode(songName.replace(/_/g,' ')));
			document.getElementsByClassName("soundOptions")[i].appendChild(element);	
		}
	}
	if(type == "remove"){
		for(var i = 0; i < domList.length; i++){ 
			 var element = document.createElement('option');
			element.setAttribute('value',songName);
			element.appendChild(document.createTextNode(songName.replace(/_/g,' ')));
			for(var j = 0; j < domList[i].length; j++){
				if(document.getElementsByClassName("soundOptions")[i][j].value == info){
					document.getElementsByClassName("soundOptions")[i].removeChild(document.getElementsByClassName("soundOptions")[i][j]);		
				}
			}
		}
	}
}

function addAudioToList(songToAdd) {
	var index = songToAdd.split("||")[0];
	var songFolder = songToAdd.split("||")[1];
	var songName = songToAdd.split("||")[2];
	//console.log(document.getElementById("listItem" + songFolder + songName));
	if (document.getElementById("listItem" + songFolder + songName) == null) {
		songsSelected.push(songToAdd);
		var stringToAdd = "<li data-index='" + index + "' id='listItem" + songFolder + songName + "'>";
		stringToAdd += '<h3 class="songName">' + songFolder + "://" + songName + " ~ "+songName.replace(/_/g, ' ')+"</h3>";
			stringToAdd += '<div class="removeSoundFromList" onclick="(function(){removeAudioFromList(\'' + songToAdd + '\');})();">×</div>';
		stringToAdd += '<div class = "uniqueSoundDescription" id="description' + songFolder + songName + '"><p>' + soundFiles[songFolder.toString()][index][1] + '</p></div>';
			stringToAdd += '<input type="button" class="pauseSound" value="||" onclick="document.getElementById(\'' + idPrefix + songFolder + songName + '\').pause()" />';
	stringToAdd += '<input type="button" class="playSound" value=">" onclick="document.getElementById(\'' + idPrefix + songFolder + songName + '\').play()" />';
	
		//ADD A BUTTON HERE WHICH LETS THE USER PLAY THE FRACKIN' SOUND.
		document.getElementById("audioZoneList").innerHTML += stringToAdd + "</li>";
		var insertString = "<audio class='hiddenAudioPlayers' id='" + idPrefix + songFolder + songName + "'>";
		for (var i = 0; i < soundFiles.opts.length; i++) {
			////console.log(soundFiles.opts[i][0]);
			insertString += "<source src='" + basePath + songFolder + "/" + songName + "." + soundFiles.opts[i][0] + "' type='audio/" + soundFiles.opts[i][1] + "'>";
		}
		insertString += "</audio>";
		document.getElementById("audioTryoutWrapper").innerHTML = insertString;
		document.getElementById("audioListWrapper").innerHTML += document.getElementById("audioTryoutWrapper").innerHTML;
		updateAudioLists("add",songToAdd);
	}
}

function removeAudioFromList(songToRemove) {
	//console.log(songToRemove);
	
	for(var i = 0; i < songsSelected.length; i++){
		if(songsSelected[i] == songToRemove){
			songsSelected.splice(i,1);
		}
	}
	updateAudioLists("remove",songToRemove);
	var index = songToRemove.split("||")[0];
	var songFolder = songToRemove.split("||")[1].toString();
	var songName = songToRemove.split("||")[2].toString();
	if (document.getElementById("listItem" + songFolder + songName) != null) {
		var listEl = document.getElementById("listItem" + songFolder + songName);
		listEl.parentNode.removeChild(listEl);

		var element = document.getElementById(idPrefix + songFolder + songName);
		element.parentNode.removeChild(element);
	}
}

function graphUpdate() {
	for (var key in chosenFeeds) {
		for (var i = 0; i < chosenFeeds[key].length; i++) {
			chosenFeeds[key][i][4].series[0].addPoint([(new Date()).getTime(), parseFloat(chosenFeeds[key][i][1])], true, true);
		}
	}
}

function checkForSongData() {
	////console.log(chosenFeeds);
	//DO ALL OF THE PLAYCHECKING HERE BITCHES!!!!
	for (var key in chosenFeeds) {
		for (var i = 0; i < chosenFeeds[key].length; i++) {
			//"Greater>> Less<< Changes from Original=|="
			var tester = chosenFeeds[key][i][5];
			console.log(tester);
			if (tester[0] != undefined && tester[1] != undefined && tester[2] != undefined && tester[3] == "true") {
				//0 is mode, 1 is threshold, 2 is sound //checks values set in audioSettings.js
				//console.log("allDef'd");
				//console.log(tester);
				//console.log(tester[1]+"")
				if (tester[0] == "=|=") {
					console.log("=|="+tester[1]+"||"+chosenFeeds[key][i][1]);
					if (tester[1] != chosenFeeds[key][i][1]) {
						
						playNoise(tester[2]);
						tester[1] = chosenFeeds[key][i][1];
					}
				} else if (tester[0] == ">>") {
					console.log(">>"+tester[1]+"||"+chosenFeeds[key][i][1]);
					if (tester[1] > chosenFeeds[key][i][1]) {
						playNoise(tester[2]);
					}
				} else if (tester[0] == "<<") {
					console.log("<<"+tester[1]+"||"+chosenFeeds[key][i][1]);
					if (tester[1] < chosenFeeds[key][i][1]) {
						playNoise(tester[2]);
					}
				} else if (tester[0] == "==" || tester[0] == "|==|") {
					//console.log("|--|"+tester[1]+"||"+chosenFeeds[key][i][1]);
					if(tester[0] == "=="){
						playNoise(tester[2]);
					}
					if (tester[1] == chosenFeeds[key][i][1]) {
						playNoise(tester[2]);
					}
				}
			}
		}
	}
}

function getType(input) {
	var m = (/[\d]+(\.[\d]+)?/).exec(input);
	if (m) {
		// Check if there is a decimal place
		if (m[1]) {
			return 'float';
		} else {
			return 'int';
		}
	}
	return 'string';
}

function populateAudioList() {
	songsSelected = soundFiles["init"];
	for (var i = 0; i < songsSelected.length; i++) {
		//console.log("LOLZ");
		var toUse = songsSelected[i];
		var index = toUse.split("||")[0];
		var songFolder = toUse.split("||")[1];
		var songName = toUse.split("||")[2];
	var audioElement = document.createElement('audio');
	audioElement.setAttribute('class','hiddenAudioPlayers');
	audioElement.setAttribute('id', idPrefix + songFolder + songName);
	document.getElementById("audioListWrapper").appendChild(audioElement);
		var insertString = "";
		for (var j = 0; j < soundFiles.opts.length; j++) {
			////console.log(soundFiles.opts[i][0]);
			insertString += "<source src='" + basePath + songFolder + "/" + songName + "." + soundFiles.opts[j][0] + "' type='audio/" + soundFiles.opts[j][1] + "'>";
		}
		document.getElementById(idPrefix + songFolder + songName).innerHTML = insertString;
		var listElement = document.createElement('li')
		listElement.setAttribute("data-index",index);
		listElement.setAttribute("id","listItem"+songFolder+songName);
		document.getElementById("audioZoneList").appendChild(listElement);
		insertString = "";
		insertString = '<h3 class="songName">' + songFolder + " :// " + songName + " ~ "+songName.replace(/_/g, ' ')+"</h3>";
		insertString += '<div class="removeSoundFromList" onclick="(function(){removeAudioFromList(\'' + toUse + '\');})();">×</div>';
		insertString += '<div class = "uniqueSoundDescription" id="description' + songFolder + songName + '"><p>' + soundFiles[songFolder.toString()][index][1] + '</p></div>';
				insertString += '<input type="button" class="pauseSound" value="||" onclick="document.getElementById(\'' + idPrefix + songFolder + songName + '\').pause()" />';
		insertString += '<input type="button" class="playSound" value=">" onclick="document.getElementById(\'' + idPrefix + songFolder + songName + '\').play()" />';

		//ADD A BUTTON HERE WHICH LETS THE USER PLAY THE FRACKIN' SOUND.
		document.getElementById("listItem"+songFolder+songName).innerHTML = insertString;

	}
	//songsSelected
	/*for(songsSelected.length){

	 }*/
}

function setPlayArray(index, feed, idOfFeed, value, currentVal) {
	//console.log(index + "," + feed);
	//console.log(idOfFeed);
	//console.log(value);
	index = parseInt(index);
	//if(index == 1){value = parseFloat(value);}
	//console.log(value);
	//chosenFeeds[feedId].push([dataId, currentVal, maxVal, minVal,new Array(6)]);
	for (var i = 0; i < chosenFeeds[feed].length; i++) {
		if (idOfFeed == chosenFeeds[feed][i][0]) {
			//console.log("found");
			if (index == 1) {
				if (getType(value) == 'float' || getType(value) == 'int') {
					value = value.toString();
					if (value.indexOf(",") != -1) {
						value = value.replace(/\,/g, '.');
					}
					//float recognition fails on nums with string on end
					//int recognition fails with anything after int.
					chosenFeeds[feed][i][5][index] = parseFloat(value);
				} else {
					//console.log("FAIL OF STRING VALUE BEOTCH");
				}
			} else {
				value = value.toString().replace(/\s/g, "");
				if(chosenFeeds[feed][i][5][index] == "=="){
					chosenFeeds[feed][i][5][1]=undefined;
				}
				if (value == "GreaterThan") {
					console.log("GREATER THAN EDITING");
					value = "<<";
				} else if (value == "LessThan") {
					value = ">>";
				} else if (value == "ValueChanges") {
					value = "=|=";
				} else if (value == "IsEqualToCurrent") {
					value = "==";
				} else if (value == "IsEqualTo(setThreshold)") {
					value = "|==|";
				} 
				if (value == "=|=") {
					chosenFeeds[feed][i][5][1] = currentVal;
				} else if (value == "==") {
					chosenFeeds[feed][i][5][1] = currentVal;
				}
				chosenFeeds[feed][i][5][index] = value;
			}
		}
		console.log(chosenFeeds[feed][i][5]);
	}
}

function playNoise(songId) {
	var index = songId.split("||")[0];
	var songFolder = songId.split("||")[1];
	var songName = songId.split("||")[2];
	console.log(songId);
	document.getElementById(idPrefix + songFolder + songName).play();

}

function loadJSON(filePath) {
	// Load json file;
	var json = loadTextFileAjaxSync(filePath, "application/json");
	// Parse json
	return JSON.parse(json);
}

function loadTextFileAjaxSync(filePath, mimeType) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", filePath, false);
	if (mimeType != null) {
		if (xmlhttp.overrideMimeType) {
			xmlhttp.overrideMimeType(mimeType);
		}
	}
	xmlhttp.send();
	if (xmlhttp.status == 200) {
		return xmlhttp.responseText;
	} else {
		// TODO Throw exception
		return null;
	}
}

