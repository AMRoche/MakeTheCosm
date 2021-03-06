var colour = "#32CDB4"; //flags
var userColour = "#550055";//home
var layer = mapbox.layer().id('examples.map-vyofok3q');
var userLayer;

var map = mapbox.map('map',layer,null);

map.zoom(2).center({
	lat : 20,
	lon : 0
});

userLayer = mapbox.markers.layer();
mapbox.markers.interaction(userLayer);
map.addLayer(userLayer);
layer = mapbox.markers.layer();
var interacting = mapbox.markers.interaction(layer);
map.addLayer(layer);
map.ui.zoomer.add();

layer.factory(function(feature) {
     var elem = mapbox.markers.simplestyle_factory(feature);
     MM.addEvent(elem, 'click', function(e) {
        var o = '<h3>'+feature.properties.feedName + '</h3>' +
           '<ul>';
           for(var i = 0; i < feature.properties.datastreams.length; i++){
	           	o += "<li>"+feature.properties.datastreams[i].id+":"+feature.properties.datastreams[i].current_value;
           }
		o+="</ul>";
		e.innerHTML = o;
        e.stopPropagation();
     });
    return elem;
});

 interacting.formatter(function(feature) {
        var o = '<h3><span id="feedId" style="display:none;">'+feature.properties.id+"</span><span id='feedName'>"+feature.properties.feedName + '</span></h3>' +
            '<ul>';
   			 var thing = 3;
             if(feature.properties.datastreams.length < 3){var thing = feature.properties.datastreams.length;}
             if(feature.properties.datastreams.length > 3){var thing = 2;}
            for(var i = 0; i < thing; i++){
            	o += "<li>"+feature.properties.datastreams[i].id+":"+feature.properties.datastreams[i].current_value;
            }
            if(feature.properties.datastreams.length>3){
            	o+= "<li>-> More than 3 inputs <-</li>";
            }
			o+="</ul>";
        return o;
    });
var alert = document.getElementById('feedList');
console.log(alert);

 

