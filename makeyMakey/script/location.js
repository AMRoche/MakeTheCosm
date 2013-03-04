var longitude = 0;
var latitude = 0;

navigator.geolocation.getCurrentPosition(GetLocation);
function GetLocation(location) {
   latitude = location.coords.latitude.toString().split(".");
   if(latitude[1].length >= 4){
   latitude = latitude[0]+"."+latitude[1].substring(0,4);
   }
   else{
   latitude = latitude[0]+"."+latitude[1];
   }
   longitude = location.coords.longitude.toString().split(".");
   if(longitude[1].length >= 4){
   longitude = longitude[0]+"."+longitude[1].substring(0,4);
   }
   else{
   longitude = longitude[0]+"."+longitude[1];
   }
   console.log("Got Co-ordinates to "+location.coords.accuracy+"accuracy.");
   console.log(latitude+","+longitude);
}

