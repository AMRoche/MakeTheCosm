var JSON = {};
//information object for feeds that have been chosen.
var json;
//global information object
var BPM = 120;
var graphUpdateTime = 2; //graph updates per second.
var graphResolution = 100; //period in seconds to display on the graph.
//add extra part in to global information object to be checked for to see if there is any listen requirements already set.
//based on what is in the array at that point act on it in seperate method called every time there's a successful ajax call
//returned to us. Should do it.
// <- link to HTML5 audio -> http://www.position-absolute.com/articles/introduction-to-the-html5-audio-tag-javascript-manipulation/
//add a select box for the sound to trigger. That needs doing.
//save the sound selected to an array too in name form and, on cycling through it, have it played. Wham.

// onChange = (function(){setPlayArray(1,"+feedId+","+dataId+",this.value)});
//	JSON[feedId] array structure for each object.[dataId, currentVal, maxVal, minVal, GRAPH, sonificationInformation[] ]);
// sonificationInformation[] structure : 
//http://freesound.org/people/fins/sounds/?page=1#sound
setInterval(function() {
	checkForSongData();
}, 60000/BPM);
setInterval(function(){
	graphUpdate();
}, 1000/graphUpdateTime);

function graphUpdate(){
for(var key in JSON){
	for(var i = 0; i < JSON[key].length; i++)
		{
			JSON[key][i][4].series[0].addPoint(
									[
									(new Date()).getTime()
									,
									parseFloat(JSON[key][i][1])
									],true,true
			);
		}
	}
}

function checkForSongData(){
	console.log(JSON);
	//DO ALL OF THE PLAYCHECKING HERE BITCHES!!!!
	for(var key in JSON){
	for(var i = 0; i < JSON[key].length; i++)
		{
						//"Greater>> Less<< Changes from Original=|="
						var tester = JSON[key][i][5];
						if(tester[0] != undefined && tester[1]!=undefined&&tester[2]!=undefined && tester[3]==true){
							//0 is mode, 1 is threshold, 2 is sound //checks values set in audioSettings.js
							console.log("allDef'd");
							console.log(tester);
							if(tester[0] == "=|="){
								if(tester[1]!=JSON[key][i][1]){
									playNoise(tester[2]);
								}
							}
							else if(tester[0] == ">>"){
								if(tester[1]>JSON[key][i][1]){
									playNoise(tester[2]);
								}
							}
							else if(tester[0] == "<<"){
								if(tester[1]<JSON[key][i][1]){
									playNoise(tester[2]);
								}
							}
							else if(tester[0] == "==" || tester[0] == "|==|"){
								if(tester[1]==JSON[key][i][1]){
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
       if (m[1]) { return 'float'; }
       else { return 'int'; }          
    }
    return 'string';
}

 function setPlayArray(index, feed, idOfFeed, value,currentVal){
 	console.log(index+","+feed);
 	console.log(idOfFeed);
 	console.log(value);
 	index = parseInt(index);
 	//if(index == 1){value = parseFloat(value);}
 	console.log(value);
 	//JSON[feedId].push([dataId, currentVal, maxVal, minVal,new Array(6)]);
	for(var i = 0; i < JSON[feed].length; i++){
		if(idOfFeed == JSON[feed][i][0]){
			console.log("found");
			if(index == 1){
				if(getType(value)=='float' || getType(value)=='int') {
					value = value.toString();
					if(value.indexOf(",")!=-1){value = value.replace(/\,/g,'.');} 
					//float recognition fails on nums with string on end
					//int recognition fails with anything after int.
						JSON[feed][i][5][index] = parseFloat(value);
				}
				else{
					console.log("FAIL OF STRING VALUE BEOTCH");
				}
			}
			else{ 
					if(value == "Greater Than"){value = ">>";}
					else if(value == "Less Than"){value = "<<";}
					else if(value == "Value Changes"){value = "=|=";}
					else if(value == "Is Equal To Current"){value = "==";}
					else if(value == "Is Equal To (set Threshold)"){value = "|==|";}
					else if(value == "=|="){JSON[feed][i][5][1] = currentVal; }
					else if(value == "=="){JSON[feed][i][5][1] = currentVal; }
					JSON[feed][i][5][index] = value;
			}
		}
	console.log(JSON[feed][i][5]);
	} 		
 }
 
 function playNoise(songId){
 	console.log(songId);
 	
 }
