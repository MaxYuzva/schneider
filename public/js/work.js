$(function() {
    $(".component-K").slider({
        autoplayDelay: 8000
    });

    $(".business-solution-slider").each(function() {
        var businessSlider = $(this).sliderItem({
            itemPerRow: 3
        });
        $("body").on("desktopToMobile", function() {
            businessSlider.config.itemPerRow = 1;
            businessSlider.updateSize();
        });
        $("body").on("mobileToDesktop", function() {
            businessSlider.config.itemPerRow = 3;
            businessSlider.updateSize();
        })
    });


    // Multiple picks on homepage
    $(".multiple-picks .intro-picks ul li").each(function(index) {
        if ($(this).hasClass('active'))
            $(".multiple-picks .picks").eq(index).show();
        else
            $(".multiple-picks .picks").eq(index).hide();
        $(this).find('a').click(function(e) {
            e.preventDefault();
        })
    });
    $(".multiple-picks .intro-picks ul").on("click", "li:not(.active)", function() {
        $(this).parent().find('.active').removeClass('active');
        $(this).addClass('active');
        $(".multiple-picks .picks:visible").hide();
        $(".multiple-picks .picks").eq($(this).index()).show();
    });

    // tips click
    $("#support .tips-section li h3").click(function(e) {
        e.stopPropagation();
        e.preventDefault();

        // Need to handle the class change differently because of the split between two ul/li groups
        $(this).parent().parent().parent().find('li.selected').not($(this).parent()).removeClass("selected");
        $(this).parent().toggleClass("selected"); //.siblings().removeClass("selected");
    });

    // There is no more tips-section in home page, so now we use multipleTableCells for all tips-sections
    // $('body .tips-section').multipleTableCells({
    //     size: 3
    // });
    // $('.featured-block ul').multipleTableCells({
    //     size: 4
    // });
    // $('.featured ul').multipleTableCells({
    //     size: 3
    // });
    $('.just-links ul').multipleTableCells({
        size: 4
    });


    // Submit perspectives form onchange of select
    $(".perspectives .filter form select").change(function() {
        $(".perspectives .filter form").submit();
    });

    //news load click
    $(".perspectives a.load").click(function(e) {
        e.stopPropagation();
        e.preventDefault();
        var link = $(this);
        content = link.parent().find('> div:not(.filter)');
        $.get(PERSPECTIVE_WIDGET, function(data) {
            //refetch divs with content
            $(".perspectives .noresults").remove();
            $(data).filter('article').each(function(index) {
                if ($(".perspectives .column-article:eq(0)").height() < $(".perspectives .column-article:eq(1)").height()) {
                    $(".perspectives .column-article:eq(0)").append($(this));
                }
                else  {
                    $(".perspectives .column-article:eq(1)").append($(this));
                }

            });

            window.lazyload('.perspectives .adapt-img-wrapper');
        });
    });

    //debug form ie
    //$('.ie8 .selectize-input input').each(function(){
    //	$(this).val($(this).attr('placeholder'));
    //});

    // Slider component
    $(".simple-slider").slider({
        autoplayEnabled: false
    });

    // Autocomplete search
    $(".main .search-field").on("input", function() {
        if ($("html").hasClass("ie9")) window.setTimeout(function() {
            $("#search .main .search-field").trigger("input");
        }, 1000); // Thanks IE9

        if ($(this).val().length > 0) {
            // Displaying and sticking the block right under the input field
            $(this).parent().find(".search-autocomplete").show().css({
                top: $(this).position().top + $(this).outerHeight()
            });
            $(document).on("click", searchAutoCompleteClose);
        } else
            searchAutoCompleteClose();
    });

    function searchAutoCompleteClose() {
        $(document).off("click", searchAutoCompleteClose);
        $(".main .search-autocomplete").hide();
    }

    // Search Information menu
    $(".information-menu > li > a").click(function(e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).parent().addClass("deployed").siblings().removeClass("deployed");
    });

    // Mobile swap search elements
    $("body").on("mobileToDesktop", function() {
        var r = $("#search .main .search-bar");

        $(".submit-search", r).remove().first().appendTo($(">ul >li:last-child", r));
        $(".message", r).remove().first().insertAfter($(".search-field", r));

        /*if ($('.tab-bar + .get-started').length > 0) {
            $(".tab-bar li").bind("click", function(e) {
                $('.get-started > div').hide();
                $('.get-started > ul li').hide();
                $('.get-started > ul li').eq($(this).index()).css({
                    "display": "table"
                });
                $(this).siblings().removeClass('selected');
                $(this).addClass('selected');
                return false;
            });
        } */
    });

    $("body").on("desktopToMobile", function() {
        var r = $("#search .main .search-bar");

        $(".submit-search", r).remove().first().insertAfter($(".search-field", r));
        $(".message", r).remove().first().insertAfter($(".search-within", r));

        /*if ($('.tab-bar + .get-started').length > 0) {
            $('.tab-bar li').unbind('click');
        }*/
    });

    // Sticky behavior
    $(".sticky").each(function() {
        var sticky = $(this);
        var minTop = 250;
        var offsetTop = 150;
        var maxTop = $(document).height() - $(".footer-container").height() - sticky.height() - 50;

        $(window).scroll(function() {
            // Sticky top = Scroll value + offset, clamped between [minTop; maxTop]
            sticky.css({
                top: Math.max(Math.min($(window).scrollTop() + offsetTop, maxTop), minTop)
            });
        })
    });

    function shareBehavior() {
        if ($('.share-popin').length > 0) {

            // Share popin validation
            $(".share-popin .checkEmailFormat").on('input', function() {
                var val = $(this).val();
                if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val)) // Email validation
                    $(this).addClass("valid");
                else
                    $(this).removeClass("valid");
            });

            $(".share-popin #message").on('input', function() {
                $(this).val().length > 0 ? $(this).addClass("valid") : $(this).removeClass("valid");
            });

            $(".share-popin form").submit(function(e) {
                if ($("#to_who").hasClass("valid") && $("#from_who").hasClass("valid") && $("#message").hasClass("valid"))
                    return true;
                else {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }
            });
        }
    }

    $(document).bind('cbox_complete', shareBehavior);

    $(".perspectives + .no-column").find("article").each(function(index) {
        $(".perspectives .noresults").remove();
        var art = $(this).clone();
        $(".perspectives .column-article:eq(" + (index % 2) + ")").append(art);
        $(this).remove();
        window.lazyload('.perspectives .column-article article .adapt-img-wrapper');
    });

    $(".tagline.deployable h1, .tagline.deployable h2").click(function(e) {
        $(this).parent().toggleClass("deployed");
    });

    // Share an Insights article page (generic.php)
    if ($('.generic-text').length > 0) {
        $(document).on("scroll", function() {
            var scrollStart = $(".generic-text").position().top - 65;
            var scrollHeight = $(".generic-text").height() + 110;
            if (($(this).scrollTop() > scrollStart) && ($(this).scrollTop() < scrollHeight)) {
                $(".share").addClass("scroll");
            } else {
                $(".share").removeClass("scroll");
            }

            if ($(this).scrollTop() > scrollHeight) {
                $(".share").addClass("bottom");
            } else {
                $(".share").removeClass("bottom");
            }
        });
    }

    // Solutions Editorial Case studies
    // Prevent videos from misalignement when there are more than 3 videos - BETC-46
    // > Pierre 30/072015 : Not needed with nth-child(odd){clear:both} apparently. Commented
    $('.case-studies > ul > li:even').each(function(index){
        if ($(this).height() < $(this).prev().height()) {
            //$(this).css("padding-bottom", ($(this).prev().height() - $(this).height()));
        }
        else {
            //$(this).prev().css("padding-bottom", ($(this).height() - $(this).prev().height()));
        }
    });

    var maxHeightSubsegment = $('.subsegments > div > div').css('max-height');
    $('.subsegments > div > i, .subsegments > div > h4' ).click(function(e){
        var wrapper = $(this).parent('div');
        if (!wrapper.is('.active')) {
            $(this).siblings('div').css('max-height','100vh');
        }
        else {
            $(this).siblings('div').css('max-height',maxHeightSubsegment);
        }
        wrapper.toggleClass('active');
    });

    //featured block : table-cell -> size 4
    $("body").on("mobileToDesktop", function() {
        $('.featured-block ul').multipleTableCells({size:4});
    });

    $("body").on("desktopToMobile", function() {
        $('.featured-block ul').multipleTableCells({size:2});
    });

});
