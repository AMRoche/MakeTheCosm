var colour = "#0055ff";
var userColour = "#550055";
var layer;
var userLayer;
var _gaq = [['_setAccount', 'UA-XXXXX-X'], ['_trackPageview']];
( function(d, t) {
		var g = d.createElement(t), s = d.getElementsByTagName(t)[0];
		//g.src = ('https:' == location.protocol ? '//ssl' : '//www') + '.google-analytics.com/ga.js';
		s.parentNode.insertBefore(g, s)
	}(document, 'script'));

var map = mapbox.map('map',layer,null,[]);
map.addLayer(mapbox.layer().id('examples.map-vyofok3q'));
map.zoom(2).center({
	lat : 20,
	lon : 0
});
//map.ui.zoomer.add();
//map.ui.zoombox.add();
userLayer = mapbox.markers.layer();
mapbox.markers.interaction(userLayer);
map.addLayer(userLayer);
layer = mapbox.markers.layer();
var interacting = mapbox.markers.interaction(layer);
map.addLayer(layer);

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

  // clear the content of alert when the user clicks on a map area other
  // than a tooltip
  MM.addEvent(map.parent, 'click', function() {
      alert.innerHTML = '';
  });

 interacting.formatter(function(feature) {
        var o = '<h3><span id="feedId" style="display:none;">'+feature.properties.id+"</span><span id='feedName'>"+feature.properties.feedName + '</span></h3>' +
            '<ul>';
            if(feature.properties.datastreams.length > 3){var thing = 2;}
             if(feature.properties.datastreams.length <= 3){var thing = feature.properties.datastreams.length;}
            for(var i = 0; i < thing; i++){
            	o += "<li>"+feature.properties.datastreams[i].id+":"+feature.properties.datastreams[i].current_value;
            }
            if(thing==2){
            	o+= "<li>-> More than 3 inputs <-</li>";
            }
			o+="</ul>";
        return o;
    });
 var alert = document.getElementById('feedList');
console.log(alert);

 

