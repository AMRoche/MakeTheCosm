var JSON = {};
//information object for feeds that have been chosen.
var json;
//global information object
//add extra part in to global information object to be checked for to see if there is any listen requirements already set.
//based on what is in the array at that point act on it in seperate method called every time there's a successful ajax call
//returned to us. Should do it.
// <- link to HTML5 audio -> http://www.position-absolute.com/articles/introduction-to-the-html5-audio-tag-javascript-manipulation/
//add a select box for the sound to trigger. That needs doing.
//save the sound selected to an array too in name form and, on cycling through it, have it played. Wham.

// onChange = (function(){setPlayArray(1,"+feedId+","+dataId+",this.value)});
//	JSON[feedId] array structure for each object.[dataId, currentVal, maxVal, minVal, GRAPH, sonificationInformation[] ]);
// sonificationInformation[] structure : 
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
 	value = parseFloat(value);
 	console.log(value);
 	//JSON[feedId].push([dataId, currentVal, maxVal, minVal,new Array(6)]);
	for(var i = 0; i < JSON[feed].length; i++){
		if(idOfFeed == JSON[feed][i][0]){
			console.log("found");
			if(index == 1){
				if(getType(value)=='float' || getType(value)=='int') {
					if(JSON[feed][i][5][0]!= "=|="){
						JSON[feed][i][5][index] = value;
					}
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
				
				if(value == "=|="){JSON[feed][i][5][1] = currentVal; }
				else if(value == "=="){JSON[feed][i][5][1] = currentVal; }
				JSON[feed][i][5][index] = value;
			}
		}
	console.log(JSON[feed][i][5]);
	} 		
 }
 
 function playNoise(songId){
 	
 	
 }
