//Mining Solutions Script	
$(document).ready( function() {
	//image map - coordinates
	if ($('.box-solutions').length > 0) {
		var wimg = $('.box-solutions .adapt-img-wrapper').width();
		var middle = wimg / 2;
		$('.box-solutions .popup').each( function () {      
			var xPos = $(this).attr('data-position-x'),
				yPos = $(this).attr('data-position-y');
			$(this).css('top', yPos+'px');
			if ( xPos <= middle ){
				$(this).children('.c-popup').addClass('left');
				$(this).css('left', xPos+'px');
			} else {
				var rightPos = wimg - xPos;
				$(this).children('.c-popup').addClass('right');
				$(this).css('right', rightPos+'px');
			}
		});
	}
	$(".open-popup").click(function(){
		$(".popup").removeClass("open");
		$(this).parent().addClass("open");
	});
	$(".close-popup").click(function(){
		$(this).parent().removeClass("open");
	});

	// pass in the class name you'd like to scroll to
	window.anchorScroll = function(className) {
		if ($(className).length) {
			$("html, body").animate({							
				scrollTop: $(className).offset().top - ($(".header-container").height() + 30)
			}, 1000);
		}
	};
	
	$('.anchor-comp a').click(function() {
		window.anchorScroll($(this).attr('data-scroll'));
	});

	$('.jump-to-top a.more-link').click(function() {
		$("html, body").animate({							
			scrollTop: $('body').offset().top
		}, 1000);
	});

	//Featured content load more
	$countN = 3;
	$boxList = $('.featured-content .box-list > div.row');
	$('.featured-content .box-list > div:nth-of-type(2)').addClass('row-last');
	$('.loadmore').click(function() {
		$boxListRepeat = $('.featured-content .box-list > div:nth-of-type(' + $countN + ')');
		$boxListRepeat.css('display','inline-block');
		$boxList.removeClass('row-last');
		$boxListRepeat.addClass('row-last');
		$countN = $countN + 1;
		if($countN > $('.featured-content .box-list > div').length) {
			$('.loadmore').css('display','none');
		}
	});	
	
	if ($('#mining-solutions-application-area').length) {
		$('.simple-content-comp.simple-featured-content.width50:last').addClass('lastitm');
	}
	if ($('#mining-solutions-uvp').length) {
		$('.simple-content-2col:last').addClass('lastitm');
	}
});