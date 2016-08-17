$(document).ready( function() {
	if($('#dispatch').length ){
		$('#support-bar').css({
			'visibility': 'visible',
			'top': '45%'
		});
	}

	//Sticky Side Social Share New
	$('#page').css('position', 'static');
	/*
	if($('#wrap-content-v1').length == 0){
		$('.wrap-content').attr('id', 'wrap-content-v1');
	}
	*/
	$("body").on("mobileToDesktop", function() {
		//Support Bar Bounce
		$supportBarTrig = false;
		$("#support-bar").click(function() {
			$supportBarTrig = true;
		});
		function supportBar_bounce(repeatNum) {
			$("#support-bar label").effect( 'bounce', {direction: "left", times: 10}, 1500);
			if (repeatNum < 5) {
				repeatNum = repeatNum + 1;
				repeatTime = repeatNum * 1500;
				setTimeout(function(){
					if ($supportBarTrig == false) {
						supportBar_bounce(repeatNum);
					}
				}, repeatTime);
			}				
		}
		setTimeout(function(){  
			supportBar_bounce(1);
		}, 1000);
		
		$('#support-bar > label').css('display', 'inline-block');
		
		if($('body').attr('id') != 'dispatch') {
			$curr_position = $('.main').offset().top;
			if ($('.main > .slider-new').length) { //For insights article page fix
				$curr_position_top = $('.main > .slider-new').height() + ($('.main').offset().top - $('.header-container').height());
			} else {
				$curr_position_top = $('.main').offset().top - $('.header-container').height();
			}
			if($('#cookie-notification').length){
				$curr_top_height = $('.header-container').height() + $('#trail').height() + $('#country-notification').height() + $('#cookie-notification').height() + 55;
			} else {
				$curr_top_height = $('.header-container').height() + $('#trail').height() + $('#country-notification').height() + 55;
			}
			$perm_header_height = $('#trail').height() + $('.header-container').height() + 20;
			$perm_header_height_tall = $('#trail').height() + $('.header-container').height() + $('#country-notification').height() + 20;

			$('#cookie-notification .notification-close').click(function(){
				$perm_header_height = $('#trail').height() + $('.header-container').height() + 20;
				$perm_header_height_tall = $('#trail').height() + $('.header-container').height() + $('#country-notification').height() + 20;
			});

			$('#country-notification .notification-close, #country-notification .confirm-location-btn').click(function(){
				setTimeout(function(){
					$curr_position_new = $('.main').offset().top;
					if($('#new-social-share:visible').length == 0){
						$('#new-social-share').css('display', 'block');
						$('#support-bar').css('display', 'table');
					}
					if($window_top != 0) {
						if ($window_top > $get_slider_htight) {
							$('#new-social-share').css('top', $perm_header_height);
							$('#support-bar').css('top', $perm_header_height);
						} else {
							if ($('.main > .slider-new').length) { //For insights article page fix
								$curr_position_new = $('.main').offset().top + $('.main > .slider-new').height();
							} else {
								$curr_position_new = $('.main').offset().top;
							}
							$('#new-social-share').css('top', $curr_position_new);
							$('#support-bar').css('top', $curr_position_new);
						}
					} else {
						if ($('.main > .slider-new').length) { //For insights article page fix
							$new_top_height = $('.header-container').height() + $('#trail').height() + 20 + $('.main > .slider-new').height();
						} else {
							$new_top_height = $('.header-container').height() + $('#trail').height() + 20;
						}
						if ($('.wrap-content > .slider-new').length == 0) {
							$('#new-social-share').css('top', $new_top_height);
							$('#support-bar').css('top', $new_top_height);
						} else {
							$('#new-social-share').css('top', $curr_position_new);
							$('#support-bar').css('top', $curr_position_new);
						}
					}
				}, 100);
			});
			$('#header-country-selector').click(function(){
				$get_slider_htight = $('.slider-new').height();
				$new_top_height = $('.header-container').height() + $('#trail').height() + $('#country-notification').height() + 55;
				setTimeout(function(){
					$curr_position_new = $('.main').offset().top;
					if($window_top != 0) {
						if ($window_top > $get_slider_htight) {
							$new_top_height = $('.header-container').height() + $('#trail').height() + 20;
							$('#new-social-share').css('top', $new_top_height);
							$('#support-bar').css('top', $new_top_height);
						} else {
							$('.wrap-content').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(e) {
								$('#new-social-share').css('top', $curr_position_new);
								$('#support-bar').css('top', $curr_position_new);
							});
						}
					} else {
						$new_top_height = $('.header-container').height() + $('#trail').height() + 20;
						if ($('.main > .slider-new').length) { //For insights article page fix
							$new_top_height = $('.header-container').height() + $('#trail').height() + 20 + $('.main > .slider-new').height();
						} else {
							$new_top_height = $('.header-container').height() + $('#trail').height() + 20;
						}
						if($('.wrap-content > .slider-new').length == 0){
							$('#new-social-share').css('top', $new_top_height);
							$('#support-bar').css('top', $new_top_height);
						} else {
							$('#new-social-share').css('top', $curr_position_new);
							$('#support-bar').css('top', $curr_position_new);
						}
					}
				}, 100);
				sticky_relocate();
			});
			$('#notification-btn-v1').click(function(){
				$curr_position_new = $('.main').offset().top;
				$('#new-social-share').toggle();
				$('#support-bar').toggle();
				if($('.wrap-content > .slider-new').length == 0){
					$('#new-social-share').css('top', $new_top_height);
					$('#support-bar').css('top', $new_top_height);
				} else {
					$('#new-social-share').css('top', $('.main').offset().top - $('#country-list-menu-v1').height());
					$('#support-bar').css('top', $('.main').offset().top - $('#country-list-menu-v1').height());
				}
			});
			function sticky_relocate() {
				$window_top = $(window).scrollTop();
				if ($window_top > $curr_position_top) {
					$('#support-bar').addClass('stick');
					if ($(".header-top a.csActive")[0]){
						$('#new-social-share').css('top', $perm_header_height_tall);
						$('#support-bar').css('top', $perm_header_height_tall);
					} else {
						if($('#cookie-notification').length){
							$('#new-social-share').css('top', $perm_header_height);
							$('#support-bar').css('top', $perm_header_height);
						} else {
							$('#new-social-share').css('top', $perm_header_height);
							$('#support-bar').css('top', $perm_header_height);
						}
					}
					$('#new-social-share').addClass('stick');
				} else {
					$('#support-bar').removeClass('stick');
					$('#new-social-share').removeClass('stick');
					if($('.wrap-content > .slider-new').length == 0){
						if ($('.main > .slider-new').length) { //For insights article page fix
							$curr_position = $('.main').offset().top + $('#trail').height() + 20 + $('.main > .slider-new').height();
						} else {
							$curr_position = $('.main').offset().top + $('#trail').height() + 20;
						}
					} else {
						$curr_position = $('.main').offset().top;
					}
					if ($(".header-top a.csActive")[0]){
						$('#new-social-share').css('top', $curr_position);
						$('#support-bar').css('top', $curr_position);
					} else {
						$('#new-social-share').css({
							'top': $curr_position
						});
						$('#support-bar').css({
							'top': $curr_position
						});
					}
				}
			}

			$(function() {
				$(window).scroll(sticky_relocate);
				setTimeout(function(){
					if($('#cookie-notification').length){
						$startTime = new Date().getTime();
						$interval = setInterval(function() {
							sticky_relocate();
						}, 100); 
					} else {
						sticky_relocate();
					}
					$('#support-bar').css('visibility', 'visible');
				}, 1000);
				$('#cookie-notification a.notification-close').click(function() {
					$('#new-social-share').css('top',0);
					$('#support-bar').css('top',0);
				});
			});
		}
	});
});