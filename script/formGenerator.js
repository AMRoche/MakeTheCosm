//http://cosm.com/docs/v2/feed/create.html
var keys = [87, 65, 83, 68, 70, 71, 38, 40, 37, 39];
var chars = ['W', 'A', 'S', 'D', 'F', 'G', 'UP', 'DOWN', 'LEFT', 'RIGHT'];
var choices;
// ^ int holding how many options there are on screen.
var formSubmitted = [new Array(), new Array(), new Array(),"",""];
// ^ inputId, inputKey, invert,feedId, feedTitle
var SendUrl;
var feedsToPush = {}; // <- Object for stuff to send to server.
var feedsValues = new Array(); //values in feed.
var toStream = false; //controls whether to even log information.
var pushInterval = null; //thing holding the setInterval for pushing information.
var apiKEY;


function charGet(number) {
	for (var i = 0; i < keys.length; i++) {
		if (number == keys[i]) {
			return chars[i];
		}
	}
	return "unfound";
}

function scanSubmit(texticle){
	for(var i = 0; i < formSubmitted[1].length; i++){
		if(texticle == formSubmitted[1][i]){
			if(formSubmitted[2][i] == true){
				//write a one to feedsValues
				feedsValues[i] = 1;
			}
			if(formSubmitted[2][i] == false){
				//write a zero to feedsValues
				feedsValues[i] = 0;
			}
			return true;
		}
	}
	return false;
}

function scanSubmitDown(texticle){
	for(var i = 0; i < formSubmitted[1].length; i++){
		if(texticle == formSubmitted[1][i]){
			if(formSubmitted[2][i] == true){
				//write a zero to feedsValues
				feedsValues[i] = 0;
			}
			if(formSubmitted[2][i] == false){
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
		if(toStream == true){
		
		scanSubmitDown(charGet(e.keyCode));
			console.log("KEYDOWN");
			console.log(feedsValues);
		}
	});
	$(document).keyup(function(e) {
		if(toStream == true){
		
		scanSubmit(charGet(e.keyCode));
			console.log(feedsValues);
		}
	});
	
});

function apiKeySet() {
	apiKEY = document.getElementById("apiDevAccess").value;
	console.log("API key set to : " + apiKEY);
	return false;
}

function initialSet() {
	if (document.getElementById("apiAccess").value != "") {
		console.log(document.getElementById("apiAccess").value);
		apiKEY = document.getElementById("apiAccess").value;
		console.log("api key changed to : " + apiKEY);
	}
	var optionLength = document.getElementById("numOfFeeds").value;
	choices = optionLength;
	var stringyThing = "";
	stringyThing += '<div id="extraButtons">';
	if (choices < 10) {
		stringyThing += '<input type="button" id="addOpt" onclick="addOption(' + choices + ')"value="[ + ]"\>';
	}
	if (choices > 1) {
		stringyThing += '<input type = "button" id="removeOpt" onclick="removeOption(' + choices + ')"value="[ - ]"\>';
	}
	stringyThing += '</div>';
	stringyThing += '<form id = "streamer" onsubmit = "return resultParser()">';
	stringyThing += 'Feed I.D. (leave blank to generate new feed) : <input type="text" id="feedId"></input>';
		stringyThing += 'Feed Title : <input type="text" id="feedTitle"></input>';
	for (var i = 0; i < optionLength; i++) {
		stringyThing += '<div id="input' + i + '" class="inputs">Name : <input type ="text" class="inputId"> Key to bind to : ' + optString(i) + ' Invert Input : <input type="checkbox" class="invert"  value="invert"></input></div>';
	}//inputId, inputKey invert,
	stringyThing += '<button type ="submit" id="subInit">Start Streaming!</button><input type="button" id="streamStop" onclick = "(function(){stopStreaming();})();" value="Stop Streaming"\>';
	stringyThing += '</form>';
	document.getElementById("form").style.display = "none";
	document.getElementById("setup").innerHTML = stringyThing;
	return false;
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
		document.getElementById("extraButtons").innerHTML = '<input type="button" id="addOpt" onclick="addOption(' + choices + ')" value="[ + ]"\>' + '<input type="button" id="removeOpt" onclick="removeOption(' + choices + ')" value="[ - ]"\>';
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
		document.getElementById("extraButtons").innerHTML = '<input type="button" id="addOpt" onclick="addOption(' + choices + ')"value= "[ + ]"\>' + '<input type="button" id="removeOpt" onclick="removeOption(' + choices + ')"value="[ - ]">';
	}
	//console.log(choices);
	var remove = document.getElementById("streamStop");
	var element = document.getElementById("subInit");
	remove.parentNode.removeChild(remove);
	element.parentNode.removeChild(element);
	//inputId, inputKey invert,
	$('#streamer').append('<div id="input' + currentCount + '" class="inputs">Name : <input type ="text" class="inputId"> Key to bind to : ' + optString(currentCount) + ' Invert Input : <input type="checkbox" class="invert"   value="invert"></input></div>' + '<button type="submit" id="subInit">Start Streaming!</button><input type="button" id="streamStop" onclick = "(function(){stopStreaming();})();"value="Stop Streaming."\>');
	
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
function boolOrNot(thingy){
	if(thingy == true){
		return 1;
	}
	else{
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
	console.log(feedsValues+"."+inputid.length);
	
	for (var i = 0; i < inputid.length; i++) {
		formSubmitted[0].push(inputid[i].value);
		formSubmitted[1].push(inputkey[i].value);
		formSubmitted[2].push(invert[i].checked);
		console.log(boolOrNot(invert[i].checked));
		feedsValues.push(boolOrNot(invert[i].checked));
	}
	
	console.log(feedsValues);
	
	if(document.getElementById("feedId").value != ""){
		formSubmitted[3] = document.getElementById("feedId").value;
		formSubmitted[4] = document.getElementById("feedTitle").value;
		pushToServer();
	}
	if(document.getElementById("feedTitle").value == ""){
		//create new feed
	}
	console.log(formSubmitted);
	pushInterval = window.setInterval(pushToServer,660);
	return false;
}

function stopStreaming(){
	toStream = false;
	console.log(toStream);
	 if(pushInterval) {
        clearInterval(pushInterval);
    }
    console.log("cleared");	
}

function pushToServer(){
	//inputId, inputKey, invert,feedId, feedTitle
	//formSubmitted
	SendUrl= "http://api.cosm.com/v2/" +"feeds/"+ formSubmitted[3]+"?_method=PUT";
	var info = new Array();
	for(var i = 0; i < formSubmitted[0].length; i++){
		var ID = formSubmitted[0][i];
		info.push({"id":ID,"current_value":JSON.stringify(feedsValues[i]),"max_value":"1.0","min_value":"0.0"});
	}
	
	feedsToPush["title"] = formSubmitted[4];
	feedsToPush["version"] = "1.0.0";
	feedsToPush["website"] = "http://www.amroche.co.uk/netChimes";
	feedsToPush["tags"] = new Array("Makey Makey", "NetChimes", "Net Chimes");
	feedsToPush["location"] = {};
	feedsToPush["location"]["lat"] = "0";
	feedsToPush["location"]["lon"] = "-59";
	feedsToPush["location"]["domain"] = "physical";
	feedsToPush["location"]["name"] = "A Makey Makey being used.";
	feedsToPush["location"]["exposure"] = "indoor";
	feedsToPush["datastreams"] = info;
	
	$.ajax({
	 type    : "PUT",
	 url     : SendUrl,
	 beforeSend: function (request)
	 {
	 request.setRequestHeader("X-ApiKey", apiKEY);
	 },
	 data    : feedsToPush,
	 always  : function(){console.log("done");},
	 success:function(response){
	 //	document.getElementById("spanner").innerHTML = response;
	 console.log(response);
	 }
	 });
	console.log("cycled through things.");
	console.log(JSON.stringify(feedsToPush));
}
