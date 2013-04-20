
function sonifyAdd(input) {
	var feedId = input.split(":")[0];
	var dataId = input.split(":")[1];
	var currentVal = input.split(":")[2];
	var maxVal = parseFloat(input.split(":")[3]);
	var minVal = parseFloat(input.split(":")[4]);
	console.log(maxVal);
	document.getElementById(dataId).getElementsByClassName("ButtonSection")[0].childNodes[0].style.display = "none";
	document.getElementById(dataId).getElementsByClassName("ButtonSection")[0].childNodes[1].style.display = "inline-block";
	document.getElementById(dataId).className = "dataWrapping listed";

	if (chosenFeeds[feedId] == undefined) {
		console.log("undefined");
		chosenFeeds[feedId] = new Array();
		chosenFeeds[feedId].push([dataId, currentVal, maxVal, minVal]);
	} else if (chosenFeeds[feedId] != undefined) {
		console.log("found" + dataId + "," + feedId);
		chosenFeeds[feedId].push([dataId, currentVal, maxVal, minVal]);
	}
	var index = chosenFeeds[feedId].length-1;
	console.log(chosenFeeds);
	  var li = document.createElement('li');
	li.setAttribute('id',feedId+dataId+"sonNode");
	document.getElementById("selectedFeedsList").appendChild(li);
	var stringToInsert = "<div class = 'graphDataContainer' id='"+feedId+dataId+"container'>";
	stringToInsert += "<div class = 'graphInfo'>";
	stringToInsert += "<h2 class = 'feedVitalStats'>"+feedId+" :// "+dataId  + "</h2>";
	stringToInsert += "<h3> Value >> <span id='"+feedId+dataId+"liveValue'>" + currentVal + "</span></h3>";
	stringToInsert += "<h3> Maxima >> <span id='"+feedId+dataId+"liveMax'>" + maxVal + "</span></h3>";
	stringToInsert += "<h3> Minima >> <span id='"+feedId+dataId+"liveMin'>" + minVal + "</span></h3>";
	stringToInsert += "<input type='button' value='Remove' style='display:inline-block;' class='removeFromArrayGraphing' onclick='(function(){sonifyRemoveArray(\"" + feedId + ":" + dataId + "\");})();'>";
	stringToInsert += "</div>";

	stringToInsert += "<div class='graphContainer' id='"+feedId + dataId +"graph'></div>";
	stringToInsert += "<div class='options' id='"+feedId + dataId +"options'>";
	stringToInsert += "<div class='graphSettings'><label class = 'graphVal'>Graph Value : </label>"
	stringToInsert += "<select class='triggerSelection'id='"+feedId + dataId +"select' onChange = (function(){setPlayArray(0,'"+feedId+"','"+dataId+"',document.getElementById('"+feedId + dataId +"select').value,"+chosenFeeds[feedId][index][1]+")})();>"
+"<option> -Select a trigger- </option>"
+"<option> Is Equal To Current </option>"
+"<option> Is Equal To (set Threshold) </option>"
+"<option> Greater Than </option>"
+"<option> Less Than </option>"
+"<option> Value Changes </option>"
+"</select></div>"
+"<div class='graphSettings'><label class = 'thresholdVal'>Threshold Value : </label><input type='textarea'class='thresholdValue'id='"+feedId + dataId +"textArea'" 
+"onChange = \"(function(){setPlayArray(1,'"+ feedId + "','" +dataId+"',document.getElementById('"+feedId + dataId +"textArea').value,"+chosenFeeds[feedId][index][1]+")})();\"/>";

	stringToInsert += "</div><div class='graphSettings'><label class='trackVal'>Select a track : </label><select class = 'soundOptions' id='"+feedId + dataId +"soundSelect' onChange = (function(){setPlayArray(2,'"+feedId+"','"+dataId.toString()+"',document.getElementById('"+feedId + dataId +"soundSelect').value,"+chosenFeeds[feedId][index][1]+")})();>"
+"<option> -Select a sound- </option>";
for(var i = 0; i < songsSelected.length; i++){
	stringToInsert += "<option value='"+songsSelected[i]+"'>"+songsSelected[i].split("||")[2].replace(/_/g, ' ')+"</option>";
}

stringToInsert+="</select></div>";

	stringToInsert += "<graph class='graphSettings'><label class='noiseVal'>Make some noise : </label><input type='checkbox' class='noiseCheckboxThing' id='"+feedId+dataId+"checkBox' onChange='"
+"(function(){setPlayArray(3,\""+feedId+"\",\""+dataId+"\",document.getElementById(\""+feedId + dataId +"checkBox\").checked, null)})();'"
+" /> ";

	stringToInsert += "</div></div>";
	stringToInsert += "</div>";
	document.getElementById(feedId+dataId+"sonNode").innerHTML = stringToInsert;
	
	var chartMax = maxVal;
	var chartMin = minVal;
	
	if((chartMax-chartMin) <= 10){
		chartMax = chartMax + 25;
		chartMin = chartMin - 25;
	}
	
	 chosenFeeds[feedId][chosenFeeds[feedId].length-1].push(
	 	new Highcharts.Chart({
            chart: {
                renderTo: document.getElementById(feedId + dataId +"graph"),
                type : 'area',
                marginRight: 10,
                events: {
                    load: function() {
                        // set up the updating of the chart each second
                        var series = this.series[0];                        
                    }
                }
            },
            title: false,
            
	        credits: {
	            enabled: false
	        },
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 150
            },
            yAxis: {
            	max : chartMax,
            	min : chartMin,
                title: false,
                allowDecimals : true,
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                formatter: function() {
                     return Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) +'<br/>'+Highcharts.numberFormat(this.y, 2);
                }
            },
              plotOptions: {
                area: {
           			threshold : -999999,
                    marker: {
                        enabled: false,
                        symbol: 'circle',
                        radius: 2,
                        states: {
                            hover: {
                                enabled: true
                            }
                        }
                    }
                }
            },
            legend: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            series: [{
                name: 'Streamed Data',
                data: (function() {
                    // generate an array of random data
                    var data = [],
                        time = (new Date()).getTime(),
                        i;
                    for (i = graphUpdateTime * graphResolution * -1; i <= 0; i++) {
                        data.push({
                            x: time + i * 1000,
                            y: -999999
                        });
                    }
                    return data;
                })()
            }]
        })
    , new Array(6)
    //  chosenFeeds[feedId][chosenFeeds[feedId].length-1]);
	);
	
	
	
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
	element = document.getElementById(feedId + dataId + "sonNode");//these two lines remove the graph node element.
	element.parentNode.removeChild(element);
	document.getElementById(dataId).className = "dataWrapping";
	for (var i = 0; i < chosenFeeds[feedId].length; i++) {
		if (chosenFeeds[feedId][i][0] == dataId) {
			chosenFeeds[feedId].splice(i, 1);
			console.log(chosenFeeds[feedId]);
		}
	}
	if (chosenFeeds[feedId].length == 0) {
		delete chosenFeeds[feedId];
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
element = document.getElementById(FeedId + StreamId + "sonNode");//these two lines remove the graph node element.
element.parentNode.removeChild(element);

	for (var i = 0; i < chosenFeeds[FeedId].length; i++) {
		if (chosenFeeds[FeedId][i][0] == StreamId) {
			chosenFeeds[FeedId].splice(i, 1);
			console.log(chosenFeeds[FeedId]);
		}
	}
	if (chosenFeeds[FeedId].length == 0) {
		delete chosenFeeds[FeedId];
	}
	displayListUpdate();
}

function displayListUpdate() {
	console.log("running!");
	var insertThing = "<ul>";

	for (var key in chosenFeeds) {
		for (var i = 0; i < chosenFeeds[key].length; i++) {
			insertThing += "<li>";
			insertThing += "<div class='quickWrapper'>";
			insertThing += "<div class='infoWahn'>";
			insertThing += "<div class='dataId'><h3>"+key + " :// " + chosenFeeds[key][i][0] + "</h3></div>";
			insertThing += "<div class='curVal'>Value >> " + chosenFeeds[key][i][1] + "</div>";
			insertThing += "<div class='maxVal'>Maxima >> " + chosenFeeds[key][i][2] + "</div>";
			insertThing += "<div class='minVal'>Minima >> " + chosenFeeds[key][i][3] + "</div>";
			insertThing += "</div>";
			insertThing += "<input type='button' value='Remove' style='display:inline-block;' class='removeFromArray' onclick='(function(){sonifyRemoveArray(\"" + key + ":" + chosenFeeds[key][i][0] + "\");})();'>";
			insertThing += "</div>";
		}
	}

	insertThing += "</ul>";
	document.getElementById("quickInfoSummation").innerHTML = insertThing;	
}
