(function($) { 
 	$.fn.slider = function(settings)
 	{
 		var config =
 		{
 			autoplayEnabled: true,
 			autoplayDelay: 5000,
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
 			var paginationNumbersContainer = container.find(".pagination-numbers");
 			var leftButton = container.find(".left-button");
 			var rightButton = container.find(".right-button");
 			var slideCount, currentSlide, autoplayTimer, enabled = true;

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
 				paginationNumbersContainer.text((currentSlide+1) + "/" + slideCount);

 				// Deactivating navigation button on first and last elements
 				if(currentSlide == slideCount-1) rightButton.removeClass("active"); else rightButton.addClass("active");
 				if(currentSlide == 0) leftButton.removeClass("active"); else leftButton.addClass("active");
 			}

			function updateSlides(){
				slideCount = slideContainer.children().length;

				// Scaling (in %) the slideContainer and individual slides as to take the size of the container
				slideContainer.css("width", (100*slideCount)+'%');
				slideContainer.children().css("width", (100/slideCount).toFixed(8)+'%');

				// Generate pagination
				paginationContainer.empty();
				if(slideCount > 1) slideContainer.children().each(function(){
					$("<li>").appendTo(paginationContainer).click(function(){ goto($(this).index()) });
				});
			}

 			function prev() { goto(currentSlide - 1); }
 			function next()	{ goto(currentSlide + 1); }
 			function stopTimer() { clearInterval(autoplayTimer); }
 			function startTimer() { clearInterval(autoplayTimer); if(config.autoplayEnabled) autoplayTimer = setInterval(next, config.autoplayDelay); }
 			function enable() { enabled = true; updateSlides(); goto(0); }
 			function disable() { enabled = false; slideContainer.removeAttr("style"); slideContainer.children().removeAttr("style"); }
 			
 			init();

 			return {goto:goto, prev:prev, next:next, stopTimer:stopTimer, startTimer:startTimer, updateSlides:updateSlides, enable:enable, disable:disable}; // Methods export
 		});

		if(!config.multiple)
		{
			if( map.length == 0 ) return undefined;
			if( map.length == 1 ) return map[0];
		}
		return map;
 	};
})(jQuery);