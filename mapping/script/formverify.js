function formsubmit() {
	document.getElementById("success").innerHTML = "";
	document.getElementById("error").innerHTML = "";
	//console.log("being called");
	var x = document.forms["signup"]["MERGE0"].value;
	//console.log(x);

	if (x.length == 0) {
		//console.log("0");
		document.getElementById("error").innerHTML = "Seems like this is empty!";
		return false;
	} else if (x.indexOf("@") == -1) {
		//console.log("1");
		document.getElementById("error").innerHTML = "Seems like the '@' went missing!";
		return false;
	} else if (x.indexOf("@") == 0) {
		//console.log("2");
		document.getElementById("error").innerHTML = "Seems like there's no recipient!";
		return false;
	} else if (x.lastIndexOf(".") < x.indexOf("@")) {
		//console.log("3");
		document.getElementById("error").innerHTML = "Seems like there's no country extension!";
		return false;
	} else if ((x.lastIndexOf(".") - x.indexOf("@")) < 2) {
		//console.log("4");
		document.getElementById("error").innerHTML = "Seems like a domain is missing!";
		return false;
	}
	else if(x.lastIndexOf(".") == x.length-1){
		document.getElementById("error").innerHTML = "Seems like there's no country extension!";
		return false;
	}
	document.getElementById("success").innerHTML = "We seem to have a valid email! Check your email to confirm!";
	setTimeout(function() {
	//console.log("testing");
	document.getElementById("MERGE0").value = null;
}, 100);
	return true;
}

function speakerFormSubmit() {

	var x=document.forms["speakerform"]["entry.0.single"].value;
	var y=document.forms["speakerform"]["entry.1.single"].value;

if (( x == null || x == "" ) && ( y == null || y == ""))
	{
	document.getElementById("speaker").innerHTML = 
 "<div class = \"boxLeftEmpty\">"+
			"<div class = \"text\"><strong>Warning!</strong> Oh dear, it seems you forgot to tell us the name of the speaker you'd like to see. Please type that in in the \"Name\" section and submit the form again at the bottom of the page. "+		
		"</div></div> " ;
		
	document.getElementById("contactSpeaker").innerHTML =  
	"<div class = \"boxLeftEmpty\">"+
			"<div class = \"text\"><strong>Warning!</strong> Whoops, it seems you forgot to include how we can contact the speaker. Please type that in and give us their details so we can get in touch with them and get some ideas going."+		
		"</div></div> " ;
		
		document.getElementById("submitWarning").innerHTML =  
	"<div class = \"boxLeftEmpty bottomShove\">"+
	"<div class = \"text\"><strong>Warning!</strong> How mysterious of you, you didn't tell us your suggested speakers' name or contact details. Please fill in both the name and contact sections of the form and submit at the bottom of the page so we know who they are.</div>"+					
		"</div></div> " ;
	
	
	return false;
	}

	if (x==null || x=="")
	  {
	  	document.getElementById("contactSpeaker").innerHTML = "";
	  
	  
		document.getElementById("speaker").innerHTML = 
 "<div class = \"boxLeftEmpty\">"+
			"<div class = \"text\"><strong>Warning!</strong>  Oh dear, it seems you forgot to tell us the name of the speaker you'd like to see. Please type that in in the \"Name\" section and submit the form again at the bottom of the page. "+		
		"</div></div> " ;
		
		document.getElementById("submitWarning").innerHTML =  
	"<div class = \"boxLeftEmpty bottomShove\">"+
			"<div class = \"text\"><strong>Warning!</strong>  Oh dear, it seems you forgot to tell us the name of the speaker you'd like to see. Please type that in in the \"Name\" section and submit the form again at the bottom of the page. "+					
		"</div></div> " ;	
		
	  return false;
	  }
	

	if (y==null || y=="")
	  {
	  	document.getElementById("speaker").innerHTML = "";
	  
	document.getElementById("contactSpeaker").innerHTML =  
	"<div class = \"boxLeftEmpty\">"+
			"<div class = \"text\"><strong>Warning!</strong> Whoops, it seems you forgot to include how we can contact the speaker. Please type that in and give us their details so we can get in touch with them and get some ideas going."+					
		"</div></div> " ;
	
		document.getElementById("submitWarning").innerHTML =  
	"<div class = \"boxLeftEmpty bottomShove\">"+
		"<div class = \"text\"><strong>Warning! </strong> Whoops, it seems you forgot to include how we can contact the speaker. Please type that in and give us their details so we can get in touch with them and get some ideas going."+					
		"</div></div> " ;

	  return false;

	  }


	setTimeout(function() {
	//console.log("testing");
	document.getElementById("speakerform").id="speakerFormSubmitted";
document.getElementById("speakerFormSubmitted").innerHTML = "<p> We've received your suggestion for a speaker and it looks good.</p>"+
"<p>Thank you for submitting your speaker; we'll get in touch with them soon!</p>";
}, 100);

return true;
}