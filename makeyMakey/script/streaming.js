// Set your API key first
//cosm.setKey( "LEXFCUfXTzzUiPhvL0tSAAkJFkWSAKxLQkVLSExCMHlZTT0g" );
// Get feed content

var interval;

// Get realtime updates on a datastream
//cosm.datastream.subscribe( "61916", "sine60", function( event, data ) {
// console.log( data.current_value ); // Logs value changes in realtime
//});

//cosm.feed.update("105431","20",function(){console.log("done");});
//"X-ApiKey: "+ apiKEY);
//testThing();
function newFeed(){
var urlLink = null;
	if(apiKEY == null){
		console.log("LOL NO API KEY");
		apiKEY = prompt("Please enter a valid API key.","");
	}
if(apiKEY != null){
	$.ajax({
		type:"GET",
		url : "backend/creater.php",
		data : {APIkey:apiKEY},
		async : false,
		always  : function(){console.log("done");},
		dataType : "jsonp",
		success: function(data, textStatus, xhr) {
		console.log(textStatus);
	    },
	    error : function (response){console.log(response);},
	    complete: function(response) {
	    	if(JSON.parse(response.responseText).Location == undefined){
	    		newFeed();
	    	}
	    	else{
	    	urlLink = JSON.parse(response.responseText).Location;
	    	urlLink = urlLink.split("/")[5];
	    	}
	    	
	    },
		failure : function(response, status, xhr) {
			console.log(response);
			 console.log(xhr.getAllResponseHeaders());
		}
	});
	}
}

function testThing() {
	var apiKEY = "LEXFCUfXTzzUiPhvL0tSAAkJFkWSAKxLQkVLSExCMHlZTT0g";
	var thingOne = Math.floor(Math.random() * 14);
	var thingTwo = Math.floor(Math.random() * 25);
	var testJSON = '{"title":"ITEST","version":"1.0.0","website":"http://www.amroche.co.uk/netChimes","tags":["Makey Makey","NetChimes","Net Chimes"],"location":{"lat":"0","lon":"-59","domain":"physical","name":"A Makey Makey being used.","exposure":"indoor"},'+
	'"datastreams":['+
	'{"id":"Thing_1","current_value":"1","max_value":"1.0","min_value":"0.0"},'+
	'{"id":"Thing_2","current_value":"0","max_value":"1.0","min_value":"0.0"}'+
	']} ';
	var sureJSON = '{"title":"netChimes web test, London.",'+
	 '"version":"1.0.0",'+
	 '"datastreams":['+
	 '{"id":"wind1","current_value":'+thingOne+'},'+
	 '{"id":"wind2","current_value":'+thingTwo+'}]}';
	 
	console.log("pushing" + thingOne + ":" + thingTwo);
	$.ajax({
	 type    : "PUT",
	 url     : "http://api.cosm.com/v2/" +"feeds/"+ "105431"+"?_method=PUT",
	 beforeSend: function (request)
	 {
	 request.setRequestHeader("X-ApiKey", apiKEY);
	 },
	 data    : testJSON,
	 always  : function(){console.log("done");},
	 error : function(response){console.log(response);},
	 success:function(response){
	 //	document.getElementById("spanner").innerHTML = response;
	 console.log(response);
	 console.log(thingOne);
	 }
	 });	
}
function deleteElements(fNum, Name){
	
	$.ajax({
		type : "delete",
		 url     : "http://api.cosm.com/v2/" +"feeds/"+ fNum +"/datastreams/"+Name,
	 beforeSend: function (request)
	 {
	 request.setRequestHeader("X-ApiKey", apiKEY);
	 },
	 data    : "",
	 always  : function(){console.log("done");},
	 error : function(response){console.log(response);},
	 success:function(response){console.log(response)}
	});
	
}
function underScore(){
	console.log(document.getElementById("FEEDid").value.split(' ').join('_'));
	return false;
}
function FeedGet(){
	var fNum = document.getElementById("feedNum").value;
	var containArray = new Array();
		$.ajax({
	 url     : "http://api.cosm.com/v2/" +"feeds/"+ fNum,
	 beforeSend: function (request)
	 {
	 request.setRequestHeader("X-ApiKey", apiKEY);
	 },
	 data    : "",
	 always  : function(){console.log("done");},
	 error : function(response){console.log(response);},
	 success:function(response){
	 //	document.getElementById("spanner").innerHTML = response;
	for(var i = 0; i < response.datastreams.length; i++){
		containArray.push(response.datastreams[i].id);
	}
	var checker = new Array("thing_1","thing2","thing3");
	for(var i = 0; i < containArray.length; i++){
		for(var j = 0; j < checker.length; j++){
			if(checker[j].toLowerCase() == containArray[i].toLowerCase()){
				checker[i] = containArray[i];
				containArray[i]+=delimiter;
			}
		}
	}
	for(var i = 0; i < containArray.length; i++){
		if(containArray[i].indexOf(delimiter)==-1){
			console.log("deleting "+containArray[i]);
			deleteElements(fNum, containArray[i]);
		}
	}
	console.log(containArray);
	console.log(checker);
		
	
	 }
	 });	
	return false;
}


