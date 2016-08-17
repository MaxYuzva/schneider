$(function() {
    var OVERLAYS_DELAY = 60;
    window.createCookie = function(name, value, days) {
        var expires;
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toGMTString();
        }
        else {
            expires = "";
        }
        document.cookie = name + "=" + value + expires + "; path=/;domain=" + window.location.host.substring(window.location.host.lastIndexOf(".", window.location.host.lastIndexOf(".") - 1) + 1);
    }

    // Too many problems with FF <= 30, let's detect it
    if (parseInt(navigator.userAgent.toLowerCase().split('firefox/').slice(-1)[0]) < 31) {
        $('html').addClass('ff-norontb');
    }

    window.lazyload = function(selector) {
        var options = {
            threshold: 50,
            failure_limit: 1000,
            effect: "fadeIn",
            event: "scroll lazyappear",
            appear: function() {
                $(this).removeClass('lazy');
                this.loaded = true;
            }
        };

        // move .lazy flag to .adapt-img-wrapper and launch lazyload
        if ($.fn.lazyload)
            $(selector).addClass('lazy').lazyload(options);
    };

    if ($('html.lazy').length) {
        window.lazyload('.adapt-img-wrapper');
        $('html').removeClass('lazy');
    }

    if (!($.fn.slider))
        window.sliderEnabled = false;

    if (typeof(window.sliderEnabled) == "undefined" || (typeof(window.sliderEnabled) != "undefined" && window.sliderEnabled == true)) {
        var slider = $(".slider:not(.slider-video)").slider();

    }

    // Textfill
    function updateTextfill() {
        if ($.fn.textfill) $(".textfill").textfill({
            debug: false,
            widthOnly: true,
            maxFontPixels: 80
        });
    }
    updateTextfill();

    $('#buorgclose').click(function() {
        $("#cookie-notification, #buorg").remove();
    });

    window.mobilecheck = function() {
        var check = false;
        (function(a) {
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true
        })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    }

    var breakpoints = {
        current: "load",
        mobileWidth: 980,

        triggerHandlers: function() {
            var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

            if (width < breakpoints.mobileWidth && breakpoints.current != "mobile") {
                breakpoints.desktopToMobile();
                breakpoints.current = "mobile";
                return;
            }

            if (width > breakpoints.mobileWidth && breakpoints.current != "desktop") {
                breakpoints.mobileToDesktop();
                breakpoints.current = "desktop";
                return;
            }
        },

        mobileToDesktop: function() {
            $("body").trigger("mobileToDesktop");
        },

        desktopToMobile: function() {
            $("body").trigger("desktopToMobile");
        }
    }

    window.breakpoints = breakpoints;

    $(window).resize(function() {
        breakpoints.triggerHandlers();
    });
    $(window).load(function() {
        breakpoints.triggerHandlers();
    });
    window.onfocus = (function() {
        breakpoints.triggerHandlers();
    });


    $('.picks-sign-up form, .footer-links form, .signup-overlay > div form').submit(function() {
        var regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        var inputVal = $(this).find('input[type=text]').val();
        if (!inputVal || inputVal.length < 1) return;
        if (regEmail.test(inputVal)) {
            $(".signup-overlay").remove();
            // Here you can add form logic like ajax request
            if ($.fn.colorbox && !(typeof(window.enableNewsletterPopup) != "undefined" && window.enableNewsletterPopup == false)) {
                $.colorbox({
                    width: colorboxWidth,
                    previous: false,
                    next: false,
                    fixed: true,
                    href: NEWSLETTER_URL + '?email=' + inputVal + ' .main > *',
                    onComplete: function() {
                        $(this).colorbox.resize();
                        window.createCookie("skip-signup-overlay", "on", 365*10);
                    }
                });
            }
        } else {
            var input = $(this).find("input");
            var tooltip = $("<span class=\"tooltip\">" + MESSAGE_INVALID_EMAIL + "</span>");

            $(".tooltip").remove();
            $(tooltip).clone()
                .appendTo($(this))
                .css({
                    "margin-top": 10
                })
                .css({
                    "color": "#D90749"
                })
                .fadeIn(100)
                .delay(60000)
                .fadeOut(100, function() {
                    $(this).remove();
                });

        }
        return false;
    });

    var colorboxWidth = "60%";

    $(document).bind('cbox_open', function() {
        $('html').css({
            overflow: 'hidden'
        });
    }).bind('cbox_closed', function() {
        $('html').css({
            overflow: 'auto'
        });
    });

    var colorboxOptions = {
        width: colorboxWidth,
        previous: false,
        next: false,
        fixed: false,
        onComplete: function() {
            $(this).colorbox.resize();
        }
    };

    $("body").on("desktopToMobile", function() {
        colorboxWidth = "80%";
        openColorbox();
        updateTextfill();
    });

    $("body").on("mobileToDesktop", function() {
        colorboxWidth = "60%";
        openColorbox();
        updateTextfill();
    });


    function openColorbox() {
        if ($.fn.colorbox) {
            $('.colorbox').each(function() {
                var copyOptions = colorboxOptions;
                if ($(this).parents('.gallery').length > 0) {
                    copyOptions.rel = "gallery";
                    copyOptions.previous = true;
                    copyOptions.next = true;
                    copyOptions.photo = true;
                    copyOptions.href = $(this).attr('href');
                } else {
                    copyOptions.scrolling = true;
                    copyOptions.href = $(this).attr("href") + ' .main > *';
                }
                $(this).colorbox(copyOptions);
            });
        }
    }

    if ($.fn.placeholder)
        $('input, textarea').placeholder();


    // Display support-bar
    $("#support-bar").bind('click', function(e) {
        $(this).toggleClass("active");
        e.stopPropagation();
    });
    $('.chat-availability').bind('click', function(e) {
        e.stopPropagation(); // Don't hide support-bar on click
    });
    $('.chat_button_offline').bind('click', function(e) {
        $('.chat-availability').css('display', 'table-cell');
        e.stopPropagation(); // Don't hide support-bar on click
    });
    $('.chat-availability-close').click(function() {
        $('.chat-availability').toggle();
    });

    //Styled select for work pages
    if ($.fn.selectize && !$("html").hasClass('ie8')) // No selectize on IE8
    {
        window.mySelect = $('select:not(.no-emulation)').selectize({
            allowEmptyOption: true
        });

        // Marketo Selectize
        $(".marketo-form").on("marketo-form-loaded", function(event) {
            $(this).find("select:not(.no-emulation)").selectize({
                allowEmptyOption: true,
                sortField: 'value'
            });
        });
    }

    // Required popup
    var tooltip = $("<span class=\"tooltip\"><img src=\"" + TOOLTIP_IMAGE + "\">" + MESSAGE_FIELD_MANDATORY + "</span>");

    // Add novalidate to overwrite any native validation handling
    if (!/chrome/i.test(navigator.userAgent)) {
	    $("form:not(.native-validation)").attr("novalidate", "").find("[required]").each(function(i) {

	        var input = $(this);
	        function addTooltip() {
	        	$(tooltip).clone()
	                .appendTo("body")
	                .offset(input.offset())
	                .css({
	                    "margin-top": input.outerHeight() + 8
	                })
	                .css({
	                    "margin-left": input.outerWidth() * .15
	                })
	                .attr("data-input-name",input.attr("name"))
	                .fadeIn(100);
	        }
	        $(this).keypress(function(event) {
	        		$(".tooltip[data-input-name='" + $(this).attr("name") + "']" ).remove();
	        });
	        $(this).closest("form").on("submit", function() {
	        	// First, we remove all remaining tooltips
	        	if (i == 0) $(".tooltip").remove();

	        	// Check if field is empty
	            if (input.val().length === 0 && !input.is("[type='hidden']")) {
	            	tooltip = $("<span class=\"tooltip\"><img src=\"" + TOOLTIP_IMAGE + "\">" + MESSAGE_FIELD_MANDATORY + "</span>")
	            	addTooltip();
	            	return false;
	            }

	            // Check if email field is valid
	            else if (input.is("[type='email']") && !input.val().match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
	            	tooltip = $("<span class=\"tooltip\"><img src=\"" + TOOLTIP_IMAGE + "\">" + MESSAGE_FIELD_EMAIL_INVALID + "</span>");
	            	addTooltip();
	            	return false;
	            }

	            // Check if phone number field is valid
	            else if (input.is("[type='tel']") && !input.val().match(/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g)) {
	            	tooltip = $("<span class=\"tooltip\"><img src=\"" + TOOLTIP_IMAGE + "\">" + MESSAGE_FIELD_PHONE_INVALID + "</span>");
	            	addTooltip();
	            	return false;
	            }

	            // If no errors, validate the form
	            else return true;
	        });
	    });
	}




    $(".chat-content form").on("submit", function() {
        var i = 0;
        $(this).find("[required]").each(function() {
            if ($(this).val().length === 0) {
                i++;
                return true;
            }
        });
        if (i === 0) {
            $(this).addClass('submitted');
            $('body,html').animate({scrollTop: ($(this).prevAll('h2').offset().top - 100) });
            $(".tooltip").hide(); // Hide tooltips if still visible on submit
            return false;
        }
    });

    // Proactive popup
    if (window.PROACTIVE_DELAY) {
        $(".proactive-chat").delay(PROACTIVE_DELAY * 1000).fadeIn();
        $(".proactive-chat .close-button").click(function(e) {
            e.preventDefault();
            e.stopPropagation();
            $(".proactive-chat").hide();
        });
    }



    function display_overlays() {
        // Overlays
        if (document.cookie.indexOf("skip-signup-overlay") == -1 && $(".signup-overlay").length > 0) {
            $(".signup-overlay").delay(OVERLAYS_DELAY * 1000).fadeIn(500, function () {
                $(".signup-overlay > div").click(function(e){ e.stopPropagation(); });
                $(".signup-overlay, .signup-overlay .close-button").click(function(e){
                    e.preventDefault();
                    $(".signup-overlay").remove();
                    if (document.cookie.indexOf("skip-partners-overlay") == -1)
                        window.createCookie("skip-signup-overlay", "on", 30);
                });
            });
        }

        if (document.cookie.indexOf("skip-partners-overlay") == -1 && $(".partners-overlay").length > 0) {
            $(".partners-overlay").delay(OVERLAYS_DELAY * 1000).fadeIn(500, function () {
                $(".partners-overlay > div").click(function(e){ e.stopPropagation(); });
                $(".partners-overlay, .partners-overlay .close-button").click(function(e){
                    e.preventDefault();
                    $(".partners-overlay").remove();
                    if (document.cookie.indexOf("skip-partners-overlay") == -1)
                        window.createCookie("skip-partners-overlay", "on", 30);
                });
            });
        }
    }



    if(document.cookie.indexOf("skip-video-overlay") == -1 && $(".video-overlay").length > 0)
    {
        $(".video-overlay").show();
        $('body').addClass('stop-scrolling');
        //$('body').bind('touchmove', function(e){e.preventDefault()});
        $(".video-overlay .skip-video").click(function(e){
            e.preventDefault();
            $(this).closest(".video-overlay").remove();
            //Make cookie
            window.createCookie("skip-video-overlay", "on", 30);
            display_overlays();
            $('body').removeClass('stop-scrolling');
            //$('body').unbind('touchmove');
        });
    }
    else {
        display_overlays();
    }

    $('.slider-new').sliderNew();

    if($("#dispatch .slider-new").length && $("#dispatch .slider-new")[0].sliderNew) {
        var sliderNew = $("#dispatch .slider-new")[0].sliderNew;
        $("body").on("mobileToDesktop", function() { sliderNew.enable(); });
        $("body").on("desktopToMobile", function() { sliderNew.disable(); });
    }

    var journeyBar, journeyBarItemHeight;
    $("body").on("desktopToMobile", function() {
        if ($('.tab-bar').length != 0) {
            journeyBar = $('.tab-bar');
        }

        $('.main .tab-bar .hamburger-button').click(function(e){
            e.preventDefault();
            $(this).toggleClass('active');
            if ($(this).hasClass('active')) {
                journeyBar.toggleClass('deployed');
            }
            else journeyBar.toggleClass('deployed');
        });
    });
    $("body").on("mobileToDesktop", function() {
        if ($('.tab-bar').length != 0) {
            journeyBar = $('.tab-bar');
            journeyBar.css('max-height','').removeClass('deployed');
        }
    });

    ///App CCC promotion
    if($('#ccc-app-notification').length > 0) {
        var ccpApp = $('#ccc-app-notification');
        var trailHeight = $('#trail').outerHeight()+3;

        //Close notification
        var contentHeight = ccpApp.find('>div').outerHeight();
        ccpApp.css('max-height', contentHeight);

        ccpApp.find('.app-info .notification-close').on('click', function() {
           ccpApp.css('max-height', 0);
           window.createCookie("ccc_app", "true", 1);
        });

        $("body").on("desktopToMobile", function() {
            trailHeight = $('.header-container').outerHeight();
            ccpApp.css('margin-top', trailHeight);
        });

        $("body").on("mobileToDesktop", function() {
            trailHeight = $('#trail').outerHeight()+3;
            ccpApp.css('margin-top', trailHeight);
        });


        //check device
        var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        var isAndroid = /Android/.test(navigator.userAgent);
        if(iOS) {
            ccpApp.find('.application-icons .google-play').css('display', 'none');
        }
        if(isAndroid) {
            ccpApp.find('.application-icons .app-store').css('display', 'none');
        }

        if (document.cookie.indexOf("ccc_app") != -1) {
            ccpApp.hide();
        }
    }
});
