$(function(){
	//var sliderCategory = $("#product-category .product-list").sliderItem({itemPerRow: 1});
	var sliderIndustries = $("#work-level3 .slider-items").sliderItem({itemPerRow: 4});
	var sliderProduct = $(".slider-product").sliderItem();

	// Textfill
	function updateTextfill() { $(".textfill").textfill({debug:false, widthOnly:true, maxFontPixels:80}); }
	updateTextfill();

	// Handler for product sheet
	var mustOpenOne = true;

	function otherSlider(nbRow) {
		$("#product-category .product-list .slider-container").each(function(){
			var items = $(this).find(">div>ul>li");
			var image = $(this).parent().find(".image-container img");
			var description = $(this).parent().find(".text-container .description");

			//if(items.length > nbRow) $(this).sliderItem({itemPerRow: nbRow});
			$(this).sliderItem({itemPerRow: nbRow});
		});
	}

	$("#product-sheet .visual ul.color_list").each(function(){
		var items = $(this).find("li");
		var image = $(this).parent().find("img");

		items.click(function(){
			$(this).siblings().removeClass('active');
			$(this).addClass('active');
			image.attr("src", $(this).data("image"));
		})
	});

	var productList = function() {
		$('.product-list-cat').removeClass('deployed');
	};

	$("body").on("mobileToDesktop", function(){
		//if(sliderCategory) sliderCategory.disable();
		otherSlider(5);
		if(sliderIndustries) $("#work-level3 .slider-items").sliderItem({itemPerRow: 4});
		mustOpenOne = true;
		//if(sliderProduct) sliderProduct.enable();
		$(".tabs .tab input[type=radio]").each(function(){ $(this).removeAttr('checked'); });
		$(".tabs .tab input[type=radio]:first").prop("checked", true);

		$(".tabs .tab input[type=radio]:checked").each(function() {activateTab(this);});

		//Product list mobile click
		$($(".product-list-cat h2,.product-list-cat > span")).unbind();
		$(".tabs .tab input[type=radio]").unbind("change", productList);

		$('#product-sheet .other_products ul').multipleTableCells({size:4});
		$('#product-sheet .product-sheet-content h1 + h2').prependTo('#product-sheet .desc_product');
		$(".tabs .tab input[type=radio]:checked").each(function() {activateTab(this);});
		updateTextfill();
	});

	$("body").on("desktopToMobile", function(){
		otherSlider(3);
		if(sliderProduct) $(".slider-items").sliderItem({itemPerRow: 1});
		//if(sliderProduct) sliderProduct.enable();
		//if(sliderCategory) sliderCategory.enable();
		if(sliderIndustries) $("#work-level3 .slider-items").sliderItem({itemPerRow: 1});
		mustOpenOne = false;
		$(".tabs .tab input[type=radio]").each(function(){ $(this).removeAttr('checked'); });
		$(".tabs .tab input[type=radio]").bind("change", productList);

		//Product list mobile click
		$(".product-list-cat h2,.product-list-cat > span").click(function(e){
			$(this).parent().toggleClass("deployed");
			$(".tabs .tab input[type=radio]").prop("checked", false);
			$(this).parent().find('.adapt-img-wrapper').trigger("lazyappear");
			e.preventDefault();
		}).first().click();

		$('#product-sheet .other_products ul').multipleTableCells({size:3});
		$('#product-sheet .desc_product > h2').insertAfter('#product-sheet h1');

		$(".tabs .tab input[type=radio]:checked").each(function() {activateTab(this);});
		updateTextfill();
	});
	
	/* Added for new global/local homepage template by VML */
	$("body").on("tabletToDesktop", function(){
		//if(sliderCategory) sliderCategory.disable();
		otherSlider(5);
		if(sliderIndustries) $("#work-level3 .slider-items").sliderItem({itemPerRow: 4});
		mustOpenOne = true;
		if(sliderProduct) sliderProduct.enable();
		$(".tabs .tab input[type=radio]").each(function(){ $(this).removeAttr('checked'); });
		$(".tabs .tab input[type=radio]:first").prop("checked", true);

		$(".tabs .tab input[type=radio]:checked").each(function() {activateTab(this);});

		//Product list mobile click
		$($(".product-list-cat h2,.product-list-cat > span")).unbind();
		$(".tabs .tab input[type=radio]").unbind("change", productList);

		$('#product-sheet .other_products ul').multipleTableCells({size:4});
		$('#product-sheet .product-sheet-content h1 + h2').prependTo('#product-sheet .desc_product');
		$(".tabs .tab input[type=radio]:checked").each(function() {activateTab(this);});
		updateTextfill();
	});

	$("body").on("desktopToTablet", function(){
		otherSlider(3);
		if(sliderProduct) $(".slider-items").sliderItem({itemPerRow: 1});
		//if(sliderProduct) sliderProduct.enable();
		//if(sliderCategory) sliderCategory.enable();
		if(sliderIndustries) $("#work-level3 .slider-items").sliderItem({itemPerRow: 1});
		mustOpenOne = false;
		$(".tabs .tab input[type=radio]").each(function(){ $(this).removeAttr('checked'); });
		$(".tabs .tab input[type=radio]").bind("change", productList);

		//Product list mobile click
		$(".product-list-cat h2,.product-list-cat > span").click(function(e){
			$(this).parent().toggleClass("deployed");
			$(".tabs .tab input[type=radio]").prop("checked", false);
			$(this).parent().find('.adapt-img-wrapper').trigger("lazyappear");
			e.preventDefault();
		}).first().click();

		$('#product-sheet .other_products ul').multipleTableCells({size:3});
		$('#product-sheet .desc_product > h2').insertAfter('#product-sheet h1');

		$(".tabs .tab input[type=radio]:checked").each(function() {activateTab(this);});
		updateTextfill();
	});
	/* End Added for new global/local homepage template by VML */

	// Product sub-menu
	$("#home-products .home-products li").click(function(e){
		if ($(this).find("ul").length > 0) {
			e.preventDefault();
			$(this).toggleClass("opened").siblings().removeClass("opened");
			$(this).find('.adapt-img-wrapper').trigger("lazyappear");
			$("#home-products a.close-layer").toggleClass("hidden");
		}
		e.stopPropagation();
	});

	$("#home-products a.close-layer").click(function(e) {
		e.preventDefault();
		$("#home-products a.close-layer").toggleClass("hidden");
		$("#home-products .opened").removeClass("opened");
	});

	$(".tabs .tab input[type=radio]").click(function(){
		if (!mustOpenOne) {
			var previousValue = $(this).attr('previousValue');
			var name = $(this).attr('name');
			if (previousValue == 'checked') {
			    $(this).removeAttr('checked');
			    $(this).attr('previousValue', false);
			}
			else {
				$("input[name="+name+"]:radio").attr('previousValue', false);
				$(this).attr('previousValue', 'checked');
			}
		}
	});

	$("body#work-level4 .select ul.options li").click(function() {
		location.href = $(this).attr('rel');
	});

	$("button.phone_button").click(function() {
		$(this).hide();
		$(".phone_zone").show();
	});

	// Call me back on hold
	$("button.call_me_back").click(function() {
		$(this).hide();
		$(".call_me_back_zone").show();
	});

	$(".tabs .tab input[type=radio]").click(function(e) {
		activateTab(e.target);
	});

	function activateTab(tab) {
		var container = $(tab).closest('.tabs');
		var content = $(tab).parent().find('.content');
		container.css('min-height', content[0].offsetHeight+48);
	}

	// Activate first tab directly
	$(".tabs .tab input[type=radio]:checked").each(function() {activateTab(this);});
});
