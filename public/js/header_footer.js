// // Prevent user from clicking on the menu while the window isn't fully loaded
$(".level1").click(function (e) { e.preventDefault(); });
$newToggleSet = false;
$(function() {
	// Set variables for header functions
	var headerHeight = $('.header-content').height() + $('.header-top').height();
	var level1 = $('.level1');
	var dropdown = $('.dropdown');
	var level2 = $('.level2');
	var level3 = $('.level3');
	var trail = $('#trail');
	var defaultDropdownHeight = 340;
	var index = -1; // set to -1 in order to not trigger closeMenu on first click
	var openedMenu = false;
	var timer;
	var level2Max = 0;
	var level3Max = 0;
	var firstTimeDesktop = true;
	$clickCount = 0;
	$supportOld = 0;
	$setOnce = true;

	function calculDropdownHeight() {
		level2.each(function(i){
			if ($(this).height() > level2Max)
				level2Max = $(this).height();
		});
		level3.each(function(i){
			if ($(this).height() > level3Max)
				level3Max = $(this).height();
		});

		if (level3Max > level2Max)
			dropdownHeight =  100 + level3Max;
		else dropdownHeight = 100 + level2Max;
	}

	// Update padding related to notifications displayed at the top of the page
	var notificationHeight = 0;
	function fitNotification() {
		notificationHeight = 0;
		var trailHeight = 0;
		if ($('.notification').is(':visible')) {
			$('.notification').each(function(i) {
				if (i>0)
					$(this).css('top',notificationHeight);
				else $(this).css('top','');
				notificationHeight += $(this).height();
			});
		}

		if (breakpoints.current === 'desktop') {
			trailHeight = trail.height();
			dropdown.css('top', notificationHeight + headerHeight + trailHeight);
		}

		//Edited by VML
		//$('.header-container').css('top',notificationHeight);
		//trail.css({'top': (notificationHeight + $('.header-container').height())});
		if($supportOld != 0 && $('body #country-notification').length && $('#header-container-v1').length) {
			setTimeout(function(){
				if($('#cookie-notification').length) {
					$('#trail').css({
						'top': $('.header-container').height(),
						'transition': 'none'
					});
				} else {
					$('#trail').css({
						'top': (notificationHeight + $('.header-container').height()),
						'transition': 'none'
					});
				}
			}, 1);
		} else {
			if($('body #country-notification').length && $('#header-container-v1').length) {
				$('#trail').css({
					'top': ($('.header-container').height()),
					'transition': 'none'
				});
			} else {
				trail.css({'top': (notificationHeight + $('.header-container').height())});
			}
		}
		if( $('#header-container-v1').length ) {
			if( $('#cookie-notification').length ) {
				$("body").on("desktopToMobile", function() {
					setTimeout(function(){
						$('.header-container').css('top', $('#cookie-notification').height());
					}, 1);
				});
				$("body").on("mobileToDesktop", function() {
					$('#header-container-v1 .header-container').css('top',0);
				});
				if (breakpoints.current === 'desktop') {
					$('.wrap-content').css('margin-top', notificationHeight - $('#country-notification').height());
				} else {
					$('.wrap-content').css('margin-top', (notificationHeight - $('#country-notification').height())+4);
				}
			} else {
				$('#header-container-v1 .header-container').css('top',0);
				if (breakpoints.current === 'desktop') {
					$('.wrap-content').css('margin-top', notificationHeight);
				} else {
					$('.wrap-content').css('margin-top', notificationHeight+4);
				}
			}
		} else {
			$('.header-container').css('top',notificationHeight);
			$('.wrap-content').css('margin-top', notificationHeight);
		}
		//End Edited by VML

		if (breakpoints.current === 'desktop') {$('#support-bar').css('margin-top', headerHeight);}
	}
	fitNotification();

	/** Added by VML **/
	// Update paddings when closing notifications
	$('#country-notification .notification-close').click(function(e){
		window.createCookie("country_selected", "true", 1);
		countryNotificationClase();
	}); 

	$('#cookie-notification .notification-close').click(function(e){
		document.cookie = "display_cookie=1";
		$('#cookie-notification').remove();
		cookieNotificationClase();
	});	
	
	function cookieNotificationClase() {
		if (breakpoints.current === 'desktop'){
			$('ul.tier-two').css('height','auto'); //resets dropdown menu height
			$('#country-notification').css('top', $('.header-top').height());
		} else {
			$('#country-notification').css('top', $('.header-top').height()+$('.header-content').height());
		}
		if($('#header-country-selector a').hasClass('csActive')){
			if($('#notification-btn-v1').hasClass('active')){
				if (breakpoints.current === 'desktop'){
					$('#country-list-menu-v1').css('top', $('#country-notification').height()-$('.header-content').height());
				} else {
					$('#country-list-menu-v1').css('top', $('#country-notification').height()+$('.header-content').height());
				}
				$('.wrap-content').css('margin-top', $('#country-notification').height()-$('.header-content').height());
			} else {
				$('.wrap-content').css('margin-top', $('#country-notification').height());
			}
		} else {
			$('.wrap-content').css('margin-top', '4px');
		}
		$('#trail').css('top', $('.header-container').height());
	}
	function countryNotificationClase() {
		//$(this).closest('.notification').remove();
		//if($(window).width() > 994){
		if (breakpoints.current === 'desktop'){
			$('ul.tier-two').css('height','auto'); //resets dropdown menu height
		}
		$('#country-notification').css('display','none');
		$('#header-top-v1').css('margin-bottom','0');
		$('#header-country-selector a').removeClass('csActive');
		$('.country-list-menu').css('display','none');
		$('#cboxOverlay').css('display','none');
		if($('#notification-btn-v1').hasClass('active')){
			$('#notification-btn-v1').removeClass('active');
		};
		if($('#header-content-v1').css('display') == 'none'){
			$('#header-content-v1').css('display','table-footer-group');
		};
		$('.region-list li:first-child').siblings().find('ul').css('display','none');
		$('.region-list li').siblings().removeClass('active');
		$('ul.region-list > li:first-child').addClass('active');
		$('ul.region-list > li:first-child ul.first-list').css('display','block');

		//if($(window).width() > 994){
		if (breakpoints.current === 'desktop'){
			var defaultHr = 200;
			if(defaultHr < $('ul.region-list > li:first-child ul.first-list').height()/3){
				$("body").on("desktopToMobile", function() {
					$('.region-list').css('height',"100%");
				});
				$("body").on("mobileToDesktop", function() {
					$('.region-list').css('height',($('ul.region-list > li:first-child ul.first-list')+100)/3);
				});
			} else {
				$("body").on("desktopToMobile", function() {
					$('.region-list').css('height',"100%");
				});
				$("body").on("mobileToDesktop", function() {
					$('.region-list').css('height',defaultHr);
				});
			}
		} else {
			$('#header-container-v1').css('position','fixed');
			$('#header-container-v1 .header-container').css('position','fixed');
		}
		if($supportOld == 0){
			$supportOld = 1;
		}
		/** End Added by VML **/
		fitNotification();
	}

	function updateMenu(index) {
		var i = 0, left = 0;
		dropdown.each(function(){
			left = ((i - index) * 100);
			$(this).css('transform', 'translate('+left+'%)');
			i++;
		});
		level2.closest('ul').find('> li').removeClass('selected');
		level2.find('> li:nth-of-type(1)').addClass('selected');
	}


	function fitMenu() {
		// Adjust dropdown height in order to fit level3 height
		if (dropdownHeight > defaultDropdownHeight) {
			dropdown.css('max-height', dropdownHeight);
			defaultDropdownHeight = dropdownHeight;
		}
		else {
			dropdown.css('max-height', defaultDropdownHeight);
		}
		fitNotification();
		$('.wrap-content').css('margin-top', defaultDropdownHeight + notificationHeight);
		$('#support-bar').css('margin-top', defaultDropdownHeight + headerHeight);
		// Adjust level3 height in order to fit level2's largest item
		level2.each(function(i){
			var maxWidth = 0;
			$(level2[i]).find('> li > a').each(function(){
				if(this.offsetWidth > maxWidth)
				maxWidth = this.offsetWidth;
			});
			maxWidth+=40;
			$(level2[i]).find('> li > div > div > a').css('margin-left', maxWidth);
			$(level2[i]).find(level3).css('margin-left',maxWidth);
			$(level2[i]).find(level3).css('padding-right',maxWidth);
			$(this).next('.additional-links').css('max-width',maxWidth);
		});
		openedMenu = true;
	}

	/* Removed requested by SE Team VML-207
	if($('body #country-notification').length && $('#header-container-v1').length) {
		if (document.cookie.indexOf("country_selected") == -1) {
			$('#header-container-v1 .header-container').css('top','0');
			$('#header-country-selector > a').addClass('csActive');
			$('#header-top-v1').css('margin-bottom',$('.notification').height());
		}
	}
	*/

	// Toggle class on selected item
	function selectItem(item) {
		$(item).closest('ul').find('> li').removeClass('selected');
		$(item).closest('li').addClass('selected');
	}

	function closeMenu(e) {
		// CSS properties added new header
		if($supportOld != 0 && $('body #country-notification').length && $('#header-container-v1').length) {
			if (breakpoints.current === 'mobile') {
				if($('#cookie-notification').length) {
					$('#header-container-v1 .header-container').css('top',$('#cookie-notification').height());
				} else {
					$('#header-container-v1 .header-container').css('top','0');
				}
			} else {
				$('#header-container-v1 .header-container').css('top','0');
			}
		}
		if(!$('#header-container-v1').length) {
			$('.wrap-content').css('margin-top', notificationHeight);
		};
		$('#support-bar').css('margin-top', '');
		if (breakpoints.current == 'desktop') {dropdown.css('max-height',0);}
		setTimeout(function(){
			dropdown.css('transform', '');
		}, 450);

		// Classes
		level1.removeClass('active');
		level1.find('> .selected').removeClass('selected');
		level1.find('> li > div, > li > div > div').removeClass('active');
		level2.find('> li > div').removeClass('active');
		$('.main-menu .hamburger-button').removeClass('active');
		$('body').removeClass('menu-open');

		// Variables
		index = -1;
		openedMenu = false;
	}

	// Set somes classes when clicking hamburger button
	$(".main-menu .hamburger-button").click(function(e) {
		if ($(this).hasClass('active')) {
			$('body').css('overflow-y','auto');
			level2.closest('.active').css('overflow-y','auto');
			level1.css('overflow-y','auto');
			$(this).toggleClass('active');
			closeMenu();
		}
		else {
			$('body').css('overflow','hidden');
			level1.toggleClass('active');
			$(this).toggleClass('active');
		}
	});

	// for New Nav
	$(".hamburger-button-v1").click(function(e) {
		if ($(this).hasClass('mactive')) {
			$('body').css('overflow-y','auto');
			$(this).toggleClass('mactive');
			$tierOne.toggleClass('mactive');
			$tierOne.find('li').removeClass('mselected');
		} else {
			$('body').css('overflow','hidden');
			$(this).toggleClass('mactive');
			$tierOne.toggleClass('mactive');
			$('#wrap-content-v1').css('margin-top','0');
			$('.wrap-content').css('margin-top','0');
			$('#country-notification').css('display','none');
			$('#header-top-v1').css('margin-bottom','0');
			$('#header-country-selector > a').removeClass('csActive');
			$('.country-list-menu').css('display','none');
			$('#cboxOverlay').css('display','none');
			if($('#notification-btn-v1').hasClass('active')){
				$('#notification-btn-v1').removeClass('active');
			};
			if($('#header-content-v1').css('display') == 'none'){
				$('#header-content-v1').css('display','table-footer-group');
			};
			$('.region-list li:first-child').siblings().find('ul').css('display','none');
			$('.region-list li').siblings().removeClass('active');
			$('ul.region-list > li:first-child').addClass('active');
			$('ul.region-list > li:first-child ul.first-list').css('display','block');
			$('#header-container-v1').css('position','fixed');
			$('#header-container-v1 .header-container').css('position','fixed');
			if($supportOld == 0){
				$supportOld = 1;
			}
		}
	});

	/* Removed requested by SE Team VML-207
	if (document.cookie.indexOf("country_selected") == -1) {
		$('#country-notification').show();
		$('#header-country-selector > a').addClass('csActive');
		$('#header-top-v1').css('margin-bottom',$('.notification').height());
		fitNotification();
	}
	*/

	// $('.notification').css('z-index',4); Edited by VML
	$('.notification').css('z-index',9002);

	// Close menu when toggling between tablet/mobile & desktop version
	$("body").on("mobileToDesktop", function() {
		//$('#country-notification').css('top','30px');
		$('#header-content-v1').css('display','table-footer-group');
		if(firstTimeDesktop)  {
			calculDropdownHeight();
			firstTimeDesktop = false;
		}
		if(firstTimeDesktop) calculDropdownHeight();
		dropdown.css('top', notificationHeight + headerHeight).addClass('dropdown');
		fitNotification();
		$(this).css('overflow-y','visible');
		$(this).css('overflow-x','hidden');
		closeMenu();
		countryNotificationClase();
	});

	$("body").on("desktopToMobile", function() {
		$('#header-content-v1').css('display','table-header-group');
		dropdown.css('top',0);
		level3.closest('div').find('> a').css('margin-left',0);
		level3.css({
			'margin-left':0,
			'padding-right':0
		});
		$('#support-bar').css('margin-top',0);
		dropdown.removeClass('dropdown');
		fitNotification();
		closeMenu();
		//Added by VML - banner pagination button position
		countryNotificationClase();
		$( window ).resize(function() {
			$("#slider-new-v1 ul.pagination").css("top",($("#slider-new-v1 .adapt-img-wrapper").height() - 45));
		});
		$("#slider-new-v1 ul.pagination").css("top",($("#slider-new-v1 .adapt-img-wrapper").height() - 45));
	});

	if (breakpoints.current != 'desktop') {
		level1.find('> li').on("click", "a", function(e){
			$(this).closest('.active').scrollTop(0);
		});
		level2.find('> li').on("click", "a", function(e){
			$(this).closest('.active').scrollTop(0);
		});
	}

	$("body").off('click', closeMenu());

	// Back button: used on mobile devices
	dropdown.find("> div").on("click", "a.back-button", function(e) {
		$(this).closest("div.active").removeClass("active").closest("li").removeClass("selected");
		e.preventDefault();
	});
	level2.find("> li").on("click", "a.back-button", function(e) {
		$(this).parents(level2).closest('.active').css('overflow-y','auto');
		e.preventDefault();
	});

	// Check for old menu
	if (!$('#header-container-v1').length) {
		// For the body click handler not to trigger on an internal click
		$(".level1 > li > a, .level2 > li > a").not(".openLink").click(function(e) {
			e.stopPropagation();
			e.preventDefault();
		});
	}

	// Search box
	$(".search-results, .header-content .reset-search").hide();

	$(".header-content .search-field").on($("html").is(".ie8, .ie9") ? "keyup" : "input", function() {
		if ((breakpoints.current == 'desktop') && ($(this).val().length > 0))
			$(".header-content .search-results, .header-content .reset-search").show();
		else
			$(".header-content .search-results, .header-content .reset-search").hide();
	});

	$(".header-content .search-field").focusin(function(){
		if ((breakpoints.current == 'desktop') && ($(this).val().length > 0))
			$(".header-content .search-results, .header-content .reset-search").show();

		$(document).one("click", function(){
			$(".header-content .search-results").hide();
			setTimeout(function(){
				$(".header-content .reset-search").hide();
			},90);
		});
	});

	$(".header-content .search-layer").click(function(e){e.stopPropagation();});

	$(".header-content .reset-search").click(function () {
		$(".header-content .search-results").hide();
		$(this).hide();
	});

	$(document).keyup(function(e) {
		 if (e.keyCode == 27)
			$(".header-content .search-results").hide();
	});

	$('#page > *').not('.header-container').click(function(e) {
		closeMenu();
	});

	$(".header-container").mouseout(function(){
		if (breakpoints.current == 'desktop') {
			timer = setTimeout(function(){
				closeMenu();
			}, 1000);
		}
	});

	$(".header-container").mouseover(function(){
		clearTimeout(timer);
	});

	// Open menu when clicking on a level1 link
	level1.find('> li:not(.mobile-country-selector) > a').click(function(e) {
		// Deploy dropdown if menu is not open yet
		e.preventDefault();
		if (!openedMenu && (breakpoints.current === 'desktop')) {
			fitMenu();
			setTimeout(function(){
				dropdown.addClass('active');
			}, 450);
		}
		// If the clicked item is already selected, close the menu, on desktop
		if ((breakpoints.current === 'desktop') && (($(this).parent().index()) == index)) {
			closeMenu();
			return;
		}

		// Set index regarding which item was clicked
		index = $(this).parent().index();

		if (breakpoints.current === 'desktop')  {
			updateMenu(index);
			selectItem(this);
		}
		else {
			selectItem(this);
			level1.css('overflow','hidden');
			$(this).closest('li').find('>div>div').addClass('active');
		}
	});

	// Update dropdown when clicking on a level2 link
	level2.find('> li > a').click(function(e) {
		e.preventDefault();
		if (breakpoints.current === 'desktop')  {
			selectItem(this);
		}
		else {
			selectItem(this);
			level2.closest('.active').css('overflow','hidden');
			$(this).closest('li').find('>div').addClass('active');
		}
	});

	$(window).on('scroll', function() {
		if (($('.notification').is(':visible')) && (breakpoints.current != 'desktop')){
			var st = $(this).scrollTop();
			if (st <= notificationHeight) {
				$('#trail').css({
					'top': (notificationHeight + $('.header-container').height() - st),
					'transition': 'none'
				});
				//$('.header-container').css({ 'top' : (notificationHeight - st) });
				if($('body #country-notification').length && $('#header-container-v1').length) {
					//if($(window).width() > 994){
					if (breakpoints.current === 'desktop')  {
						$('.header-container').css({ 'top' : (notificationHeight - st) });
					} else {
						if($('body #cookie-notification').length) {
							$('.header-container').css({'top': $('#cookie-notification').height()});
						} else {
							$('.header-container').css({'top': 0});
						}
						$('#header-container-v1').css('position','absolute');
					}
				}
			}
			else {
				$('#trail').css({
					'top': $('.header-container').height(),
					'transition': 'none'
				});
				if(!$('body #cookie-notification').length) {
					$('.header-container').css({'top': 0});
				}
			}
		}
	});

/** Added by VML **/
	$('ul.region-list > li:first-child').addClass('active');
	$('#header-container-v1').css({'top':'0', 'width':'100%', 'z-index':'9000'});
	iniHeaderContainerH = $('#header-container-v1').height();
	iniCountryListTop = '-' + (iniHeaderContainerH + $('#country-list-menu-v1').height()) + "px";
	$('#country-notification').css('z-index',9003);
	$('#country-list-menu-v1').css('top', iniCountryListTop);
	$(window).load(function(){
		$('#notification-btn-v1').click(function(e) {
			e.preventDefault();
			if ($clickCount == 0) {
				$clickCount = 1;
			} else {
				$clickCount = 0;
			}
			$('#notification-btn-v1').toggleClass('active');
			$('#country-list-menu-v1').toggle();
			$('.region-list li:first-child').siblings().find('ul').css('display','none');
			$('.region-list li').siblings().removeClass('active');
			$('ul.region-list > li:first-child').addClass('active');
			$('ul.region-list > li:first-child ul.first-list').css('display','block');

			if (breakpoints.current == 'desktop') {
				$('#header-container-v1').css({'top':'0', 'width':'100%', 'z-index':'9000', 'position':'relative'});
				$('#cboxOverlay').toggle();
				$('#header-content-v1').toggle();
				if( $('#header-container-v1').length ) {
					$('#country-list-menu-v1 .region-list').css('height', $('#country-list-menu-v1 .region-list .first-list').height()+59);
					$('#country-list-menu-v1').css('top',($('#header-container-v1 .header-container').height()-$('#header-content-v1 .header-content').height()-$('#header-top-v1 .header-top').height())-4);
				} else {
					$('#country-list-menu-v1').css('top',($('.notification').height()-$('.header-container').height()));
				}
				if($(this).hasClass('active')){
					if($('#cookie-notification').length) {
						$('.wrap-content').css('margin-top', $('#country-notification').height()+$('.header-top').height()+10);
					} else {
						$('.wrap-content').css('margin-top', $('#country-notification').height()-($('#header-content-v1').height()+10));
					}
					$('html, body').animate({ scrollTop: 0 }, 'slow');
				} else {
					if($('#cookie-notification').length) {
						$('.wrap-content').css('margin-top', notificationHeight);
					} else {
						$('.wrap-content').css('margin-top', $('#country-notification').height());
					}
				}
			} else {
				$('#cboxOverlay').toggle();
				if( $('#header-container-v1').length ) {
					if($('#cookie-notification').length) {
						$('#country-list-menu-v1').css('top',($('#header-container-v1').height() - $('#header-content-v1 .header-content').height()));
					} else {
						$('#country-list-menu-v1').css('top',($('#country-notification').height()+$('.header-content').height()));
					}
				
				} else {
					$('#country-list-menu-v1').css('top',($('.notification').height()-$('.header-container').height()));
				}
				if($(this).hasClass('active')){
					if($('#cookie-notification').length) {
						$('.wrap-content').css('margin-top', ($('#country-notification').height()+$('#country-list-menu-v1').height()) + $('#cookie-notification').height()+$('.header-top').height()-35);
					} else {
						$('.wrap-content').css('margin-top', ($('#country-notification').height()+$('#country-list-menu-v1').height())-10);
					}
					$('html, body').animate({ scrollTop: 0 }, 'slow');
				} else {
					if($('#cookie-notification').length) {
						$('.wrap-content').css('margin-top', $('#country-notification').height() + $('#cookie-notification').height());
					} else {
						$('.wrap-content').css('margin-top', $('#country-notification').height());
					}
				}
			}

		});
	});
	$('.region-list > li').click(function() {
		$(this).siblings().find('ul').css('display','none');
		$(this).siblings().removeClass('active');
		if(!$(this).hasClass('active')){
			//if($(window).width() > 994){
			if (breakpoints.current == 'desktop') {
				var defaultHr = 200;
				if(defaultHr < $(this).find('ul').height()/3){
					$('.region-list').css('height',($(this).find('ul').height()+100)/3);
				} else {
					$('.region-list').css('height',defaultHr);
				}
			} else {
				if($(this).index() == 1){
					$('html, body').animate({ scrollTop: 0 }, 'slow');
				} else {
					$('html, body').animate({ scrollTop: $(this).index()*25 }, 'slow');
				}
			}
			$(this).addClass('active');
			$(this).find('ul').css('display','block');
		};
	});

	var defaultHr = 200;
	if(defaultHr < $('ul.region-list > li:first-child ul.first-list').height()){
		$("body").on("desktopToMobile", function() {
			$('.region-list').css('height',"100%");
		});
		$("body").on("mobileToDesktop", function() {
			$('.region-list').css('height',$('ul.region-list ul.first-list').height());
		});
	} else {
		$("body").on("desktopToMobile", function() {
			$('.region-list').css('height',"100%");
		});
		$("body").on("mobileToDesktop", function() {
			$('.region-list').css('height',defaultHr);
		});
	}

	$('.region-list > li > ul > li a').click(function(e) {
		$('.country-list-menu').toggle();
		$('#cboxOverlay').toggle();
		$('#notification-btn-v1').toggleClass('active');
		$("html, body").animate({ scrollTop: 0 }, "slow");
		// return false;
	});
	$('#header-top-v1 #header-country-selector').click(function(e) {
		if($('#country-notification').css('display') != 'block'){
			setTimeout(function(){
				$('#trail').css({
					'top': $('.header-container').height(),
					'transition': 'none'
				});
			}, 1);
		}
		e.preventDefault();
        $(this).find('> a').addClass('csActive');
        $('.main-menu .dropdown').css('display','none');
		closeMenu();
		$('#country-notification').css('display','block');
		if($('#cookie-notification').length) {
			if (breakpoints.current === 'mobile') {
				$('#country-notification').css('top', $('#cookie-notification').height() + $('.header-top').height() + $('.header-content').height());
			} else {
				$('#country-notification').css('top', $('.notification').height() + $('.header-top').height());
			}
			$('#header-top-v1').css('margin-bottom', $('#country-notification').height());
		} else {
			if (breakpoints.current === 'mobile') {
				$('#country-notification').css('top', $('.header-top').height() + $('.header-content').height());
			} else {
				$('#country-notification').css('top', $('.header-top').height());
			}
			$('#header-top-v1').css('margin-bottom',$('.notification').height());
		}
		//if($(window).width() < 994){
		if (breakpoints.current == 'mobile') {
			$('#header-container-v1').css('position','absolute');
			if ($(".hamburger-button-v1").hasClass('mactive')) {
				$('body').css('overflow-y','auto');
				$(".hamburger-button-v1").removeClass('mactive');
				$tierOne.removeClass('mactive');
				$tierOne.find('li').removeClass('mselected');
				$tierOne.find('ul').removeClass('mselected');
			};
		};
		$('#header-container-v1').css('top',0);
		//$('#header-top-v1').css('margin-bottom',$('.notification').height());
		if($('#country-list-menu-v1').css('display') != 'block'){
			if($('#cookie-notification').length) {
				$('.wrap-content').css('margin-top',$('#country-notification').height() + $('#cookie-notification').height());
			} else {
				$('.wrap-content').css('margin-top',$('#country-notification').height());
			}
		};
	});
	$('.confirm-location-btn').click(function(e) {
		e.preventDefault();
		if($('#notification-btn-v1').hasClass('active')){
			$('#notification-btn-v1').removeClass('active');
		};
		$("body").on("mobileToDesktop", function() {
			$('#header-content-v1').css('display','table-footer-group');
		});
		$("body").on("desktopToMobile", function() {
			$('#header-content-v1').css('display','table-header-group');
		});
		$('.region-list li:first-child').siblings().find('ul').css('display','none');
		$('.region-list li').siblings().removeClass('active');
		$('ul.region-list > li:first-child').addClass('active');
		$('ul.region-list > li:first-child ul.first-list').css('display','block');
		window.createCookie("country_selected", "true", 1);
		$('#country-notification').css('display','none');
		$('.country-list-menu').css('display','none');
		//for new menu
		$('#header-top-v1').css('margin-bottom','0');
		$('#header-country-selector > a').removeClass('csActive');
		$('#cboxOverlay').css('display','none');

		if (breakpoints.current == 'desktop') {
			$('#header-content-v1').css('display','table-footer-group');
		};
		fitNotification();
	});

	//New Megamenu
	$tierOne = $('.nav > ul');
	$tierTwo = $('.nav > ul > li > ul');
	$tierThree = $('.nav > ul > li > ul > li > div');
	$tierTwoList = $('.nav > ul > li > ul > div > li');
	$catTitle = $('.nav > ul > li > ul > div > li > a').not($(".nav > ul > li > ul > div > li.col-promo > a"));
	$menuDropDown = $('.nav > ul > li:has( > ul)');
	$menuSingleTier = $('.nav > ul > li:not(:has( > ul))');
	$normalSub = $('.nav > ul > li > ul:not(:has(ul))');

	function buildNewMegaMenu(){
		$tierOne.addClass('tier-one');
		$tierTwo.addClass('tier-two');
		$tierTwo.find('div:nth-of-type(1)').addClass('tier-two-wrap');
		$tierTwoList.addClass('tier-two-list');
		$catTitle.addClass('cat-title');
		$tierThree.addClass('tier-three');
		$menuDropDown.addClass('menu-dropdown');
		$menuSingleTier.addClass('single-tier');
		$normalSub.addClass('normal-sub');

		$pageDirection = $('body').attr('dir');

		$('.nav .tier-two-wrap').each(function(index){
			$(this).prepend('<h2><a class="backbtn" href="#">' + $(this).parent().parent().find('> a').text() + '</a></h2>');
			$('.backbtn').click(function(e) {
				$('.menu-dropdown').removeClass('mselected');
			});
			$(this).find('li.tier-two-list ul').each(function(index){
				$(this).prepend('<h2><a class="backbtn-one" href="#">' + $(this).prev('a').text() + '</a></h2><li style="display:none;"><a href="'+$(this).prev('a').attr("href")+'">' + $(this).prev('a').text() + '</a></li>');
				$('.backbtn-one').click(function(e) {
					$('.col-promo').css('display','table-cell');
					$('.tier-two-list ul').removeClass('mselected');
				});
			});
		});

		$('.nav .tier-two .tier-two-list').each(function(index){
			var catArr = new Array();
			$(this).find('.cat-title').each(function(index){
				catArr.push($(this).text());
			});
		});
		$('ul.tier-one > .menu-dropdown > a').click(function(){
			$('.col-promo').css('display','table-cell');
			$tierOne.find('.menu-dropdown').removeClass('mselected');
			$(this).parent().addClass('mselected');
		});
		$catTitle.click(function(){
            //if($(window).width() < 980){
            if (breakpoints.current == 'mobile') {
                //$('.col-promo').css('display','none');
				$('.tier-two').scrollTop(0);
                $('.tier-two-list ul').removeClass('mselected');
                $(this).next().find('li').css('display','block');
                $(this).next().addClass('mselected');
            }
		});

		$("body").on("desktopToMobile", function() {
			$('.nav .menu-dropdown > ul').css('left', 0);
		});
		$("body").on("mobileToDesktop", function() {
			var leftPosition = (($(window).width() - 980) / 2 );
			$('.nav .menu-dropdown > ul').css('left', leftPosition);
			if($pageDirection == 'rtl') {
				$('.nav .menu-dropdown > ul').css('right', leftPosition);
			}
		});
	};
	buildNewMegaMenu();

	//resets dropdown menu height after window size change
	$(window).resize(function() {
		if(this.resizeTO) clearTimeout(this.resizeTO);
		this.resizeTO = setTimeout(function() {

			if (breakpoints.current == 'desktop') {
				$('ul.tier-two').css('height','auto');
				$('.nav .menu-dropdown > ul').css('left', 0);
				var leftPosition = (($(window).width() - 980) / 2 );
				$('.nav .menu-dropdown > ul').css('left', leftPosition);

				if($pageDirection == 'rtl') {
					$('.nav .menu-dropdown > ul').css('right', leftPosition);
				}
				
				$('.nav .menu-dropdown').children("ul").css('display','none');
			};
		}, 100);
	});
	//If width is more than 980px dropdowns are displayed on hover
    $(".nav .menu-dropdown > a").click(function(e) {
        e.stopPropagation();
        e.preventDefault();
    });
	
	$("body").on("mobileToDesktop", function() {
		$(".nav .menu-dropdown").hover(function() {
			if($newToggleSet == true){
				$(this).children("ul").toggle();
			};
			if((calcWindowDimensions().height - findOffset()) < $(this).find('> ul').height()){
				$(this).find('> ul').css({'overflow-y': 'auto'});
				var newH = calcWindowDimensions().height - findOffset();
				$(this).find('> ul').css('height',newH);
			}
		});
		$(".nav .menu-dropdown").mouseleave(function() {
			if($(this).find('> ul').css('display') == 'block'){
				$(this).find('> ul').css('display','none');
			};
		});
	});
	//HELPERS
	function calcWindowDimensions(){
		//returns height/ width obj
		dimensions = {
			height: $(window).height(),
			width: $(window).width()
		}
		return dimensions
	}
	function findOffset(){
		var dimensions = calcWindowDimensions(),
			topHeader = $('#header-top-v1'),
			pad = 55;
		if($('#header-country-selector > a').hasClass('csActive')){
			countryListAdjHeight = topHeader.height() + $('#country-notification').height() + pad;
		} else {
			countryListAdjHeight = topHeader.height() + pad;
		};
		return countryListAdjHeight;
	}
/** End Added by VML **/
});

$(document).ready(function(){
// For Disclaimers for new header
	if (document.cookie.indexOf("display_cookie") >= 0) {
		$('#cookie-notification').remove();
	} else {
		$('#cookie-notification').css('display','block');
	}
	if($('#trail').css('display') == 'none'){
		$('#trail').remove();
	}
});

$(window).load(function(){
	//$(".header-container").find("a").bind("click");
	$(".level1").bind("click");
	if( $('#header-container-v1').length ) {
		$("#colorbox, #cboxOverlay, #cboxWrapper").css('z-index','8999');
		$('#cboxOverlay').css({
			'background': '#000',
			'opacity': '0.9'
		});
	}
	$newToggleSet = true;
	
	$('#cookie-notification').detach().prependTo('#header-top-v1');
	$('#cookie-notification').css('position','inherit');
	if($('#cookie-notification').length){
		$('.wrap-content').css('margin-top', $('#cookie-notification').height() + 4);
	}
	
	$("body").on("mobileToDesktop", function() {
		// For Disclaimers for new header
		$('#cookie-notification').detach().prependTo('#header-top-v1');
		$('#cookie-notification').css('position','inherit');
		if($('#cookie-notification').length){
			$('.wrap-content').css('margin-top', $('#cookie-notification').height() + 4);
		}
	});

	$("body").on("desktopToMobile", function() {
		$("#header-container-v1 .header-container .nav a").not($("li.col-promo a")).not($("#header-container-v1 .header-container .tier-two-list ul li a")).click(function (e) {
			e.preventDefault();
		});
		// For Disclaimers for new header
		$('#cookie-notification').detach().prependTo('#header-container-v1');
		$('#cookie-notification').css('position','fixed');
		if($('#cookie-notification').length){
			$('.wrap-content').css('margin-top', $('#cookie-notification').height() + 4);
		}
	});
	$(window).resize(function() {
		if (breakpoints.current === 'mobile') {
			$("#header-container-v1 .header-container .nav a").not($("li.col-promo a")).not($("#header-container-v1 .header-container .tier-two-list ul li a")).click(function (e) {
				e.preventDefault();
			});
			// For Disclaimers for new header
			$('#cookie-notification').detach().prependTo('#header-container-v1');
			$('#cookie-notification').css('position','fixed');
			if($('#cookie-notification').length){
				$('.header-container').css('top',$('#cookie-notification').height());
				$('.wrap-content').css('margin-top', $('#cookie-notification').height() + 4);
			}
		} else {
			// For Disclaimers for new header
			$('#cookie-notification').detach().prependTo('#header-top-v1');
			$('#cookie-notification').css('position','inherit');
		}
	});
	// For Single Tier menu item - no dropdown
	$menuSingleTier.click(function (e) {
		e.stopPropagation();
		var ghref = $(this).find('> a').attr('href');
		var gtarget = $(this).find('> a').attr('target');
		if(gtarget) {
			window.open(ghref);
		} else {
			window.location.href = $(this).find('> a').attr('href');
		}
	});
});