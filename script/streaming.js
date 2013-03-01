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
	var apiKEY = "LEXFCUfXTzzUiPhvL0tSAAkJFkWSAKxLQkVLSExCMHlZTT0g";
	var thingOne = Math.floor(Math.random() * 14);
	var thingTwo = Math.floor(Math.random() * 25);
	console.log("pushing" + thingOne + ":" + thingTwo);
	var jsonThingy = '{"title" : "Your Title","version" : "1.0.0","datastreams" : [{"id" : "stream0"}, {"id" : "stream1"}]}';
	$.ajax({
		type : "POST",
		beforeSend: function (request)
		 {
		 request.setRequestHeader("X-ApiKey", apiKEY);
		 },
		url : "http://api.cosm.com/v2/feeds.json?_method=POST",
		data : jsonThingy,
		always  : function(){console.log("done");},
		success: function(data, textStatus, xhr) {
		console.log(textStatus);
        console.log(xhr.status);
	    },
	    complete: function(xhr, textStatus) {
	    	console.log(textStatus);
	        console.log(xhr.status);
	        console.log(xhr.getAllResponseHeaders());
	    },
		failure : function(response, status, xhr) {
			console.log(response);
			 console.log(xhr.getAllResponseHeaders());
		}
	});
}

function testThing() {
	var apiKEY = "LEXFCUfXTzzUiPhvL0tSAAkJFkWSAKxLQkVLSExCMHlZTT0g";
	var thingOne = Math.floor(Math.random() * 14);
	var thingTwo = Math.floor(Math.random() * 25);
	console.log("pushing" + thingOne + ":" + thingTwo);
	$.ajax({
	 type    : "PUT",
	 url     : "http://api.cosm.com/v2/" +"feeds/"+ "105431"+"?_method=PUT",
	 beforeSend: function (request)
	 {
	 request.setRequestHeader("X-ApiKey", apiKEY);
	 },
	 data    : '{"title":"netChimes web test, London.",'+
	 '"version":"1.0.0",'+
	 '"datastreams":['+
	 '{"id":"wind1","current_value":'+thingOne+'},'+
	 '{"id":"wind2","current_value":'+thingTwo+'}]}',
	 always  : function(){console.log("done");},
	 success:function(response){
	 //	document.getElementById("spanner").innerHTML = response;
	 console.log(response);
	 console.log(thingOne);
	 }
	 });
	
}

