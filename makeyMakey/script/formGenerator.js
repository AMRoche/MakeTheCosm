//http://cosm.com/docs/v2/feed/create.html
var keys = [87, 65, 83, 68, 70, 71, 38, 40, 37, 39];
var chars = ['W', 'A', 'S', 'D', 'F', 'G', 'UP', 'DOWN', 'LEFT', 'RIGHT'];
var choices;
// ^ int holding how many options there are on screen.
var formSubmitted = [new Array(), new Array(), new Array(), "", ""];
// ^ inputId, inputKey, invert,feedId, feedTitle
var SendUrl;
var feedsToPush = {};
// <- Object for stuff to send to server.
var feedsValues = new Array();
//values in feed.
var toStream = false;
//controls whether to even log information.
var pushInterval = null;
//thing holding the setInterval for pushing information.
var delimiter = "¬!¬";
//delimiter for array holding stream ID's
var apiKEY = null;

function charGet(number) {
	for (var i = 0; i < keys.length; i++) {
		if (number == keys[i]) {
			return chars[i];
		}
	}
	return "unfound";
}

function scanSubmit(texticle) {
	for (var i = 0; i < formSubmitted[1].length; i++) {
		if (texticle == formSubmitted[1][i]) {
			if (formSubmitted[2][i] == true) {
				//write a one to feedsValues
				feedsValues[i] = 1;
			}
			if (formSubmitted[2][i] == false) {
				//write a zero to feedsValues
				feedsValues[i] = 0;
			}
			return true;
		}
	}
	return false;
}

function scanSubmitDown(texticle) {
	for (var i = 0; i < formSubmitted[1].length; i++) {
		if (texticle == formSubmitted[1][i]) {
			if (formSubmitted[2][i] == true) {
				//write a zero to feedsValues
				feedsValues[i] = 0;
			}
			if (formSubmitted[2][i] == false) {
				//write a one to feedsValues
				feedsValues[i] = 1;
			}
			return true;
		}
	}
	return false;
}

$(function() {
	$(document).keydown(function(e) {
		if (toStream == true) {

			scanSubmitDown(charGet(e.keyCode));
			console.log("KEYDOWN");
			console.log(feedsValues);
		}
	});
	$(document).keyup(function(e) {
		if (toStream == true) {
			scanSubmit(charGet(e.keyCode));
			console.log(feedsValues);
		}
	});

});

function apiKeySet() {
	apiKEY = document.getElementById("apiDevAccess").value;
	console.log("API key set to : " + apiKEY);
	console.log(apiValidation(apiKEY));
	return false;
}

function initialSet() {
	
	if(document.getElementById("apiAccess").value == "" ){
			apiKEY = prompt("Please enter a valid API key.","");
			if(apiKEY == ""){return false;}
			else if(apiKEY!=""&&apiKEY!=null){
			document.getElementById("apiAccess").value = apiKEY;
			initialSet();
			return false;}
	}
	if (document.getElementById("apiAccess").value != "") {
		console.log(document.getElementById("apiAccess").value);
		apiKEY = document.getElementById("apiAccess").value;
		console.log("api key changed to : " + apiKEY);
	
	var optionLength = document.getElementById("numOfFeeds").value;
	choices = optionLength;
	var stringyThing = "";
	stringyThing += '<div id="extraButtons">';
	if (choices < 10) {
		stringyThing += '<input type="button" class="btn" id="addOpt" onclick="addOption(' + choices + ')"value="[ + ]"\>';
	}
	if (choices > 1) {
		stringyThing += '<input type = "button" class="btn" id="removeOpt" onclick="removeOption(' + choices + ')"value="[ - ]"\>';
	}
	stringyThing += '</div>';
	stringyThing += '<form id = "streamer" onsubmit = "return resultParser()">';
	stringyThing += 'Feed I.D. (leave blank to generate new feed) : <input type="text" id="feedId"></input>';
	stringyThing += 'Feed Title : <input type="text" id="feedTitle"></input>';
	for (var i = 0; i < optionLength; i++) {
		stringyThing += '<div id="input' + i + '" class="inputs"><div class="sendIndicator" style="float:left; width:30px; height:30px;border-radius:20px;margin-right:50px; background-color:black; display:none;"></div>Name : <input type ="text" class="inputId"> Key to bind to : ' + optString(i) + ' Invert Input : <input type="checkbox" data-toggle="buttons-checkbox" class="invert"  value="invert"></input></div>';
	}//inputId, inputKey invert,
	stringyThing += '<button type ="submit" class="btn"id="subInit">Start Streaming!</button><input type="button" class="btn" id="streamStop" onclick = "(function(){stopStreaming();})();" value="Stop Streaming"\>';
	stringyThing += '</form>';
	//document.getElementById("form").style.display = "none";
	document.getElementById("form").innerHTML = stringyThing;
	return false;
	}
}

function optString(input) {
	var optionString = "<select class='inputKey'>";
	optionString += "<option value='" + chars[input] + "'>" + chars[input] + "</option>";
	optionString += "<option value='---'>---</option>";
	for (var i = 0; i < 10; i++) {
		if (i != input) {
			optionString += "<option value='" + chars[i] + "'>" + chars[i] + "</option>";
		}
	}
	optionString += "</select>";
	return optionString;
}

function removeOption(currentCount) {
	//console.log(currentCount);
	choices--;
	if (choices < 2) {
		//console.log(document.getElementById("extraButtons"));
		var element = document.getElementById("removeOpt");
		element.parentNode.removeChild(element);
	}
	if (choices > 1) {
		document.getElementById("extraButtons").innerHTML = '<input type="button" class="btn" id="addOpt" onclick="addOption(' + choices + ')" value="[ + ]"\>' + '<input type="button" class="btn" id="removeOpt" onclick="removeOption(' + choices + ')" value="[ - ]"\>';
	}

	var element = document.getElementById("input" + choices);
	//console.log(element);
	element.parentNode.removeChild(element);

	document.getElementById("addOpt").onclick = function() {
		addOption(choices)
	};
	if (choices > 2) {
		document.getElementById("removeOpt").onclick = function() {
			removeOption(choices)
		};
	}
}

function addOption(currentCount) {
	if (choices >= 9) {
		var element = document.getElementById("addOpt");
		element.parentNode.removeChild(element);
	} else {
		document.getElementById("extraButtons").innerHTML = '<input type="button" class="btn" id="addOpt" onclick="addOption(' + choices + ')"value= "[ + ]"\>' + '<input type="button" class="btn" id="removeOpt" onclick="removeOption(' + choices + ')"value="[ - ]">';
	}
	//console.log(choices);
	var remove = document.getElementById("streamStop");
	var element = document.getElementById("subInit");
	remove.parentNode.removeChild(remove);
	element.parentNode.removeChild(element);
	//inputId, inputKey invert,
	$('#streamer').append('<div id="input' + currentCount + '" class="inputs"><div class="sendIndicator" style="float:left; width:30px; height:30px;border-radius:20px;margin-right:50px; background-color:black; display:none;"></div>Name : <input type ="text" class="inputId"> Key to bind to : ' + optString(currentCount) + ' Invert Input : <input type="checkbox" class="invert"   value="invert"></input></div>' + '<button type="submit" class="btn" id="subInit">Start Streaming!</button><input type="button" class="btn" id="streamStop" onclick = "(function(){stopStreaming();})();"value="Stop Streaming."\>');

	choices++;
	if (currentCount < 9) {
		document.getElementById("addOpt").onclick = function() {
			addOption(choices)
		};
	}
	document.getElementById("removeOpt").onclick = function() {
		removeOption(choices)
	};
}
function apiValidation(supposedKey){
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
			success : function(response) {validKey = true;},
			error : function(response){
				
					validKey = false;
				
				}
});
if(!validKey){return false;}
else{return true;}
}
function boolOrNot(thingy) {
	if (thingy == true) {
		return 1;
	} else {
		return 0;
	}
}

function resultParser() {
	toStream = true;
	var inputid, inputkey, Invert;
	formSubmitted[0].length = 0;
	formSubmitted[1].length = 0;
	formSubmitted[2].length = 0;
	formSubmitted[3] = "";
	feedsValues.length = 0;
	inputid = document.getElementsByClassName("inputId");
	inputkey = document.getElementsByClassName("inputKey");
	invert = document.getElementsByClassName("invert");
	console.log(feedsValues + "." + inputid.length);

	for (var i = 0; i < inputid.length; i++) {
		
		inputid[i].value = inputid[i].value.split(' ').join('_')
		if(!inputid[i].value.match(/^[0-9a-z]+$/)) {
			console.log("doing!");
	      inputid[i].value = "Feed_"+i+"_input_id_not_alphanumeric";
	    }
	    
		formSubmitted[0].push(inputid[i].value);
		formSubmitted[1].push(inputkey[i].value);
		formSubmitted[2].push(invert[i].checked);
		feedsValues.push(boolOrNot(invert[i].checked));
	}

	/*pull id from stream suggested and input.
	 * roll through stream id's and if case insensitive equal to input
	 * make input the stream id found such that shit isn't fucked up.
	 * use delimiter in found id's so we know it's not deleted.
	 delete all stream id's which do not contain delimiter.
	 */
 	if (document.getElementById("feedId").value == "") {
 		toStream = false;
		addFeed();
	}
	else if (document.getElementById("feedId").value != "") {
		formSubmitted[3] = document.getElementById("feedId").value;
		formSubmitted[4] = document.getElementById("feedTitle").value;

		//all testing stuff goes here. Let's add stuff to the dev console for now.

		var fNum = document.getElementById("feedNum").value;
		var containArray = new Array();
		$.ajax({
			url : "http://api.cosm.com/v2/" + "feeds/" + fNum,
			beforeSend : function(request) {
				request.setRequestHeader("X-ApiKey", apiKEY);
			},
			data : "",
			always : function() {
				console.log("done");
			},
			error : function(response) {
				console.log(response);
			},
			success : function(response) {
				//	document.getElementById("spanner").innerHTML = response;
				
				if (response.datastreams != undefined) {
					for (var i = 0; i < response.datastreams.length; i++) {
						containArray.push(response.datastreams[i].id);
					}

					for (var i = 0; i < containArray.length; i++) {
						for (var j = 0; j < formSubmitted[0].length; j++) {
							if (formSubmitted[0][j].toLowerCase() == containArray[i].toLowerCase()) {
								formSubmitted[0][i] = containArray[i];
								containArray[i] += delimiter;
							}
						}
					}
					for (var i = 0; i < containArray.length; i++) {
						if (containArray[i].indexOf(delimiter) == -1) {
							console.log("deleting " + containArray[i]);
							deleteElements(fNum, containArray[i]);
						}
					}
				}
				//	console.log(containArray);
				//	console.log(checker);
				pushInterval = setInterval(pushToServer, 660);
			}
		});

		//end of testing here.

	}
	console.log(formSubmitted);
	return false;
}

function addFeed() {
	var urlLink = null;
		$.ajax({
			type : "GET",
			url : "backend/creater.php",
			data : {
				APIkey : apiKEY
			},
			async : false,
			always : function() {
				console.log("done");
			},
			dataType : "jsonp",
			success : function(data, textStatus, xhr) {
				console.log(textStatus);
			},
			error : function(response) {
				console.log(response);
			},
			complete : function(response) {
				console.log(response);
				if (JSON.parse(response.responseText).Location == undefined) {
					addFeed();
				} else {
					urlLink = JSON.parse(response.responseText).Location;
					urlLink = urlLink.split("/")[5];
					console.log(urlLink);
					formSubmitted[3] = urlLink;
					formSubmitted[4] = document.getElementById("feedTitle").value;
					toStream = true;
					document.getElementById("feedId").value = urlLink;
					if (formSubmitted[4].length == 0) {
						formSubmitted[4] = "A test title for you.";
					}
				}

			},
			failure : function(response, status, xhr) {
				console.log(response);
				console.log(xhr.getAllResponseHeaders());
			}
		});
	pushInterval = setInterval(pushToServer, 660);
}

function stopStreaming() {
	document.getElementById("indicator").style.backgroundColor = "red";
	for(var i = 0; i < document.getElementsByClassName("sendIndicator").length; i++){
		document.getElementsByClassName("sendIndicator")[i].style.display = "none";
	}
	toStream = false;
	console.log(toStream);
	if (pushInterval) {
		clearInterval(pushInterval);
	}
	console.log("cleared");
}

function pushToServer() {
	document.getElementById("indicator").style.backgroundColor = "green";
	//inputId, inputKey, invert,feedId, feedTitle
	//formSubmitted
	SendUrl = "http://api.cosm.com/v2/" + "feeds/" + formSubmitted[3] + "?_method=PUT";
	console.log(SendUrl+"-----------------");
	var info = new Array();
	for (var i = 0; i < formSubmitted[0].length; i++) {
		document.getElementsByClassName("sendIndicator")[i].style.display = "";
		if(feedsValues[i] != (formSubmitted[2][i])?1:0){
			document.getElementsByClassName("sendIndicator")[i].style.backgroundColor = "rgb(51,105,255)";
		}
		if(feedsValues[i] == (formSubmitted[2][i])?1:0){
			document.getElementsByClassName("sendIndicator")[i].style.backgroundColor = "black";
		}
		var ID = formSubmitted[0][i];
		info.push({
			"current_value" : JSON.stringify(feedsValues[i]),
			"id" : ID,
			"max_value" : "1.0",
			"min_value" : "0.0"
		});
	}

	feedsToPush["title"] = formSubmitted[4];
	feedsToPush["version"] = "1.0.0";
	feedsToPush["website"] = "http://www.amroche.co.uk/netChimes";
	feedsToPush["tags"] = new Array("Makey Makey", "NetChimes", "Net Chimes");
	feedsToPush["location"] = {};
	feedsToPush["location"]["lat"] = latitude;
	feedsToPush["location"]["lon"] = longitude;
	feedsToPush["location"]["domain"] = "physical";
	feedsToPush["location"]["name"] = "A Makey Makey being used.";
	feedsToPush["location"]["exposure"] = "indoor";
	feedsToPush["datastreams"] = info;

	$.ajax({
		type : "PUT",
		url : SendUrl,
		crossDomain : true,
		beforeSend : function(request) {
			request.overrideMimeType("text/plain; charset=utf-8");
			request.setRequestHeader("X-ApiKey", apiKEY);
		},
		data : JSON.stringify(feedsToPush),
		always : function() {
			console.log("done");
		},
		success : function(response) {
			//	document.getElementById("spanner").innerHTML = response;
			console.log(response);
		},
		error : function(response) {
			console.log(response);
		}
	});
	console.log("cycled through things.");
	console.log(JSON.stringify(feedsToPush));
}
