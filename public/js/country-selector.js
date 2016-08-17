$(function() {
	var countrySelectorClass='.country-selector';

	$(countrySelectorClass).each(init);

	function init() {
		$(this).find('> ul > li:not(.back) > a').click(openContinent);
		$(this).find('> ul > li li.back > a').click(closeContinentOrCountry); // Make span act like link
		$(this).find('> ul > li li:not(.back) > a, > ul > li li:not(.back) > span ').click(openCountry); // Make span act like link
		fitCountrySelector();
	}

	function openContinent(e) {
		var item = $(this).parent();
		item.siblings().removeClass('selected'); // Close other continents
		item.addClass('selected'); // Open selected one
		e.preventDefault(); e.stopPropagation(); // Avoid link redirect
		$('.wrap-content').css({
			'height':'100%'
		})
	}

	function closeContinentOrCountry(e) {
		var item = $(this).parent();
		item.closest('.selected').removeClass('selected');
		item.parent().parent().parent().css({
			'overflow':'auto',
			'height':''
		});
		$('.wrap-content').css({
			'height':'auto'
		})
	}

	function openCountry(e) {
		var item = $(this).parent();

		if (item.find('ul').length) {
			item.siblings().removeClass('selected');
			item.addClass('selected');
			if (breakpoints.current != 'desktop') {
				item.closest('ul').css({
					'overflow':'hidden',
					'height':0
				});
			}
		}
	}

	function fitCountrySelector() {
		var countrySelectorContainer = $(countrySelectorClass+" > ul");
		var height = 0;
		countrySelectorContainer.find('> li > ul').each(function() {
			$(this).css({'display': 'block'}); // Force show (to get offsetHeight)
			height = Math.max(height, this.offsetHeight); // 20 is added in order to have a padding
			$(this).css({'display': ''}); // Hiding... unless if has class selected.
		});
		countrySelectorContainer.css({'height': height+'px'});
	}



	$("body").on("desktopToMobile", function(){
		$(countrySelectorClass).find('li').removeClass('selected'); // Deselect menus
	});

	$("body").on("mobileToDesktop", function(){
		$(countrySelectorClass).find('li').removeClass('selected'); // Deselect menus
		$(countrySelectorClass).find('>ul > li').first().addClass('selected'); // select menus
	});

});