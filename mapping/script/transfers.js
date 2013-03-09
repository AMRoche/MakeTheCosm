( function() {"use strict";
		var hashThing = document.URL.substr(document.URL.indexOf('#'), document.URL.length);
		//#blurb, #mailSubscribe, #speakerSubmit
		var hashes = ["", "#soundList", "#userArea"];
		//var hashes = ["","","#speakerSubmit"]; //multiple blank hashlinks breaks history in this caes.
		var increment = 0;
		var active = $('.slideshow .slide.active');
		var totalSlides = $('.slide');
		//var //hammer = new Hammer(document.getElementsByClassName("slideshow")[0]);
		if (hashThing.indexOf("#") != -1) {
			changeScreen(hashThing);
			history.pushState({
				hash : hashThing
			}, "", hashThing);
		}//sort it defaulting to #blurb

			document.getElementById("map").addEventListener('onswipe',function(event){
				//hammer.cancelEvent();
			});
		for (var i = 0; i < document.getElementsByClassName("slide").length; i++) {
			document.getElementsByClassName("content")[i].addEventListener('onswipe', function(event) {
				////hammer.cancelEvent();
			}, false);
			document.getElementsByClassName("content")[i].addEventListener('touchend', function(event) {
				event.stopPropagation();
			}, false);
			document.getElementsByClassName("content")[i].addEventListener('mouseup', function(event) {
				event.stopPropagation();
			}, false);
		}

		/*hammer.onswipe = function(ev) {
			var direction = ev.direction;
			var active = $('.slideshow .slide.active');
			var totalSlides = $('.slide');
			
			if (direction == "right") {//left moving
				backOne();
			}
			if (direction == "left") {//right moving
				nextOne();
			}
		};*/

		$(document).keydown(function(e) {
			if (e.keyCode == 37) {
				backOne();
			}
			if (e.keyCode == 39) {
				nextOne();
			}
		});

		$('#prev-button').on('click', function() {
			backOne();
		});
		$('#next-button').on('click', function() {
			nextOne();
		});

		window.addEventListener('popstate', function(event) {
			//			//console.log('popstate fired!');
			////console.log(event.state);

			if (event.state != null) {
				//console.log(event.state.hash);
				changeScreen(event.state.hash);
			}

			//get event state, calculate distance from current to history using hashes and increment,
			//simulate clicks off of that.
			//$('#elementid').click();

		});
		function changeScreen(hashToChange) {

			var index;
			for (var i = 0; i < hashes.length; i++) {
				if (hashToChange == hashes[i]) {
					index = i;
				}
			}

			////console.log(index+","+increment);
			//"next-button" , "prev-button"
			if (index > increment) {
				//console.log("index");
				var nums = index - increment;
				for (var i = 0; i < nums; i++) {
					//console.log("clicking next");
					var next = active.next();
					if (next.length) {
						//increment++;
						//historySwapper(increment);
						active.removeClass('active');
						next.addClass('active');
						active = next;
						if (active[0] != totalSlides[0]) {
							document.getElementById("prev-button").className = "";
						}
						if (active[0] == totalSlides[totalSlides.length - 1]) {
							document.getElementById("next-button").className = "hidden";
						}
					}

				}
				increment = index;
			} else if (increment > index) {
				//console.log("increment");
				var nums = increment - index;
				for (var i = 0; i < nums; i++) {
					//console.log("clicking prev");
					var prev = active.prev();
					if (prev.length) {
						//increment--;
						//historySwapper(increment);
						active.removeClass('active');
						prev.addClass('active');
						active = prev;
						if (active[0] == totalSlides[0]) {
							document.getElementById("prev-button").className = "hidden";
						}
						if (active[0] != totalSlides[totalSlides.length - 1]) {
							document.getElementById("next-button").className = "";
						}
					}
				}
				increment = index;
			}
		}

		function nextOne() {
			var next = active.next();
			if (next.length) {
				increment++;
				historySwapper(increment);
				active.removeClass('active');
				next.addClass('active');
				active = next;
				if (active[0] != totalSlides[0]) {
					document.getElementById("prev-button").className = "";
				}
				if (active[0] == totalSlides[totalSlides.length - 1]) {
					document.getElementById("next-button").className = "hidden";
				}
			}
		}

		function backOne() {
			var prev = active.prev();
			if (prev.length) {
				increment--;
				historySwapper(increment);
				active.removeClass('active');
				prev.addClass('active');
				active = prev;
				if (active[0] == totalSlides[0]) {
					document.getElementById("prev-button").className = "hidden";
				}
				if (active[0] != totalSlides[totalSlides.length - 1]) {
					document.getElementById("next-button").className = "";
				}
			}
		}

		function historySwapper(num) {
			//console.log(num);
			//console.log(hashes[num]);
			//var hashlink = '"'+hashes[num].toString()+'"';
			var stateObj = {
				hash : hashes[num]
			};
			if (hashes[num] != "") {
				history.pushState(stateObj, "", hashes[num]);
			} else if (hashes[num] == "" && document.URL.indexOf('#') != -1) {
				history.pushState(stateObj, "", document.URL.substr(0, document.URL.indexOf('#')));
			} else if (hashes[num] == "" && document.URL.indexOf('#') == -1) {
				history.pushState(stateObj, "", document.URL.substr(0, document.URL));
			}
		}

		if (hashThing.indexOf("#") == -1 || increment == 0) {
			history.pushState({
				hash : ""
			}, "", hashes[0]);
		}

	}());
