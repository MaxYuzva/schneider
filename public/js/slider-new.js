(function($) {

 	$.fn.sliderNew = function(settings)
 	{
 		var config =
 		{
 			autoplayEnabled: true,
 			timerPaused: false,
 			autoplayDelay: 7000,
 			pauseOnHover: false,
 			wipeEnabled: true,
 			multiple: false
 		};


 		if(settings) $.extend(config, settings);

 		var map = this.map(function()
 		{
 			var container = $(this);
 			var slideContainer = container.find(".slides");
 			var paginationContainer = container.find(".pagination");
 			var leftButton = container.find(".left-button");
 			var rightButton = container.find(".right-button");
 			var slideCount, currentSlide, firstCycle = true, autoplayTimer, enabled = true;

 			function init()
 			{
 				// Setup
 				updateSlides();
	 			startTimer();
	 			goto(0);

	 			if(config.wipeEnabled)
				container.touchwipe({
	 				wipeLeft: 	next,
	 				wipeRight: 	prev,
	 				preventDefaultEvents: false
	 			});

	 			// Autoplay hover interrupt
	 			if(config.pauseOnHover) container.hover(stopTimer, startTimer);

	 			leftButton.click(prev);
	 			rightButton.click(next);
 			}

 			function goto(newSlide)
 			{
 				if(!enabled) return;

 				currentSlide = (newSlide+slideCount)%slideCount;
 				startTimer();

 				$(this).trigger("lazyappear");


 				// If under IE9, we actually animate the transition ourselves 
 				if($('body,html').css("direction") == "rtl") {
 					if(/MSIE 9.0/i.test(navigator.userAgent)) slideContainer.animate({marginRight: '-'+currentSlide+'00%'}, 250);
	 				else
	 				// Sliding (smoothly with css-transitions) the container to bring the current slide on the front
	 				slideContainer.css({marginRight: '-'+currentSlide+'00%'});
 				}
				else {
					if(/MSIE 9.0/i.test(navigator.userAgent)) slideContainer.animate({marginLeft: '-'+currentSlide+'00%'}, 250);
	 				else
	 				// Sliding (smoothly with css-transitions) the container to bring the current slide on the front
	 				slideContainer.css({marginLeft: '-'+currentSlide+'00%'});
				}

 				// Shifting the .current class around
 				slideContainer.children().removeClass("current").eq(currentSlide).addClass("current");
 				paginationContainer.children().removeClass("current").eq(currentSlide).addClass("current");

 				// Deactivating navigation button on first and last elements
 				if(currentSlide == slideCount-1) {
 					rightButton.removeClass("active");
 					firstCycle = false;
 				}
 				else rightButton.addClass("active");
 				if(currentSlide == 0) {
 					leftButton.removeClass("active");
 					if (!firstCycle) stopTimer();
 				}
 				else leftButton.addClass("active");
 			}

			function updateSlides(){
				slideCount = slideContainer.children().length;

				// Scaling (in %) the slideContainer and individual slides as to take the size of the container
				slideContainer.css("width", (100*slideCount)+'%');
				slideContainer.children().css("width", (100/slideCount).toFixed(8)+'%');

				// Generate pagination
				paginationContainer.empty();
				if(slideCount > 1) slideContainer.children().each(function(){
					$("<li>").appendTo(paginationContainer).click(function(){
						goto($(this).index());
						stopTimer();
						startTimer(15000);
					});
				});
			}

 			function prev() { goto(currentSlide - 1); }
 			function next()	{ goto(currentSlide + 1); }
 			function autoplayHandler() { if(!config.timerPaused) next(); }
 			function stopTimer() { clearInterval(autoplayTimer); timerPaused = true;}
 			function startTimer(duration) { clearInterval(autoplayTimer); timerPaused = false; if(config.autoplayEnabled) autoplayTimer = setInterval(autoplayHandler, duration || config.autoplayDelay); }
 			function enable() { enabled = true; updateSlides(); goto(0); }
 			function disable() { enabled = false; slideContainer.removeAttr("style"); slideContainer.children().removeAttr("style"); }

 			init();

 			container[0].sliderNew = {goto:goto, prev:prev, next:next, stopTimer:stopTimer, startTimer:startTimer, updateSlides:updateSlides, enable:enable, disable:disable}; // Methods export
 			return container[0].sliderNew;
 		});

		if(!config.multiple)
		{
			if( map.length == 0 ) return undefined;
			if( map.length == 1 ) return map[0];
		}
		return map;
 	};
})(jQuery);



$(function(){

	// When clicking on a video link
	$(".image-banner .video-link").click(function(e){
		e.preventDefault();

		// Create the markup
		var videoContainer = $('<div class="video-container"></div>').hide();
		var closeButton = $('<a href="#" class="close-button"></a>');

		videoContainer.append(closeButton);
		$(this).closest(".image-banner").prepend(videoContainer);

		// Get the (potential) slider reference
		var sliderNew = $(this).closest(".slider-new");
		sliderNew.length ? sliderNew = sliderNew[0].sliderNew : sliderNew = false;

		// Stop autoplay until video has finished
		if(sliderNew) sliderNew.stopTimer();


		// Check for the url and call the right player
		var url = $(this).attr("href");

		setTimeout(function(){
			if(/youtube/.test(url))
				loadYoutube(url);
			else
				loadOoyala(url);
		}, 500);


		var OOPlayer;
		function hideVideo()
		{
			// Restart autoplay and remove frame
			if(OOPlayer) OOPlayer.destroy();
			videoContainer.remove();

			if(sliderNew) sliderNew.startTimer();
		};

		function addClickHandlers()
		{
			// Add the click handlers for proper closing of the video
			videoContainer.click(function(e){ e.stopPropagation(); });
			closeButton.click(function(e){ e.preventDefault(); hideVideo(); })
			$("body").one("click", function(e){ hideVideo(); });
		}



		function loadYoutube(url)
		{
			var iframe = $('<iframe type="text/html" src="" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>');
			videoContainer.prepend(iframe)

			// Generate iframe's src
			url += "?autoplay=1&autohide=1&rel=0&&enablejsapi=1&wmode=transparent";

			// Load the embed url, and wait for loading to finish
			iframe.attr({"src": url, "wmode":"opaque"}).one("load", function(){
				addClickHandlers();
				videoContainer.show();

				// Subscribe to the Youtube API status updates to know when the video is done playing
				$(this)[0].contentWindow.postMessage('{"event":"listening","id":"' + $(this).attr("id") + '"}', '*');
				$(window).on("message", function(e){
					if(!e || !e.originalEvent || !e.originalEvent.data) return;

					var data = JSON.parse(e.originalEvent.data);

					if(data && data.info)
						if(data.info.playerState === 0) // Playback completed
							hideVideo();
				});
			});
		}

		function loadOoyala(url)
		{
			//url = url.split("#ec=")[1];
			/* Added by VML */
			var container = $(
				'<div id="ooyala-container"></div>' +
				'<noscript><div>Please enable Javascript to watch this video</div></noscript>'
			);
			videoContainer.prepend(container);
			OO.ready(function() {
				OOPlayer = OO.Player.create('ooyala-container', url, {wmode: 'opaque',autoplay: true});
				videoContainer.show();
				OOPlayer.mb.subscribe(OO.EVENTS.PLAYBACK_READY, '', function(){
					addClickHandlers();
					OOPlayer.mb.subscribe(OO.EVENTS.PLAYED, '', function(){
						hideVideo();
					});
				});
			});
			/*
			var container = $('<div id="ooyala-container" data-player-params="{ \'wmode\': \'opaque\' }"></div>');
			videoContainer.prepend(container);
			url = url.split("?ec=")[1];
		
			OO.ready(function(){

				OOPlayer = OO.Player.create('ooyala-container', url, {autoplay: true, wmode: "opaque"});
				videoContainer.show();

				OOPlayer.mb.subscribe(OO.EVENTS.PLAYBACK_READY, '', function(){
					addClickHandlers();

					OOPlayer.mb.subscribe(OO.EVENTS.PLAYED, '', function(){
						hideVideo();
					});
				});
			});
			*/
		}
	});
});
