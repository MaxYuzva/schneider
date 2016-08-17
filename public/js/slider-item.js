(function($) { 
 	$.fn.sliderItem = function(settings)
 	{
 		var config =
 		{
 			itemPerRow: 5,
 			wipeEnabled: true
 		};

 		if(settings) $.extend(config, settings);

 		var map = this.map(function()
 		{
 			var container = $(this);
 			var itemContainer = container.find(">ul, >div>ul");
 			var leftButton = container.find(">.left-button");
 			var rightButton = container.find(">.right-button");
 			var itemCount, currentItem, autoplayTimer, partialSize, enabled = true;

 			function init()
 			{
 				// Setup
 				updateSize();
	 			goto(0);

				if(config.wipeEnabled)
				container.touchwipe({
	 				wipeLeft: 	next,
	 				wipeRight: 	prev,
	 				preventDefaultEvents: false
	 			});

	 			leftButton.click(prev);
	 			rightButton.click(next);
 			}

 			function goto(newItem)
 			{
 				if(!enabled) return;

 				if(newItem > itemCount-config.itemPerRow || newItem < 0) return;
 				currentItem = newItem;

 				// Sliding (smoothly with css-transitions) the container to bring the current item on the front
 				if($('body,html').css("direction") == "rtl") 
 					itemContainer.css({'marginRight': '-'+currentItem*partialSize+'%'});
 				else 
 					itemContainer.css({'marginLeft': '-'+currentItem*partialSize+'%'});

 				$(this).find('.adapt-img-wrapper').trigger("lazyappear");

 				// Deactivating navigation button on first and last elements
 				if(currentItem == itemCount-config.itemPerRow) rightButton.removeClass("active"); else rightButton.addClass("active");
 				if(currentItem == 0) leftButton.removeClass("active"); else leftButton.addClass("active");
 			}

			function updateSize(){
				itemCount = itemContainer.children().length;

				// Scaling (in %) the itemContainer and individual items as to take the size of the container
				partialSize = (100/config.itemPerRow).toFixed(8);

				itemContainer.css({'width': itemCount*partialSize+'%'});
				itemContainer.children().css({'width': (100/itemCount).toFixed(8)+'%'});

				goto(currentItem);
			}

 			function prev() { goto(currentItem - 1); }
 			function next()	{ goto(currentItem + 1); }
 			function enable() { enabled = true; updateSize(); goto(0); }
 			function disable() { enabled = false; itemContainer.removeAttr("style"); itemContainer.children().removeAttr("style"); }
 			
 			init();

 			return {goto:goto, prev:prev, next:next, updateSize:updateSize, enable:enable, disable:disable, config:config}; // Methods export
 		});

		if( map.length == 0 ) return undefined;
		if( map.length == 1 ) return map[0];
		return map;
 	};
})(jQuery);