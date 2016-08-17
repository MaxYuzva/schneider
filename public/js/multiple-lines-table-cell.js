// Splitting ul>li groups into several ul>li if there's more than x items. Needed if we want to have have multiple lines while still using display:table-cell
(function($) { 
 	$.fn.multipleTableCells = function(settings)
 	{
 		var config =
 		{
 			size: 3,
 			reset: false
 		};

 		if (settings) $.extend(config, settings);

 		var map = this.map(function () {
 			var container = $(this);
 			
 			function explode() {
 				var items = container.find(">li:not(.empty)");
 				var batches = [];

 				// Split into several batches of config.size
				while (items.length > 0) batches.push(items.splice(0, config.size));

				// Pad the end of the array
				var last = batches[batches.length-1];
				while (last !== undefined && last.length < config.size) last.push($("<li class=\"empty\">"));

				// Convert arrays to uls
				var ul = container.clone().empty();
				for(var i = 0; i < batches.length; i++) batches[i] = ul.clone().addClass('sub-ul').append(batches[i]);

				// Append the uls
				container.after(batches).remove();
			}

			function getSiblings(){
				return container.next(classNameOfContainer).add(container.prev(classNameOfContainer));
			}

	 		function merge() {
 				getSiblings().remove().find('li:not(.empty)').appendTo(container);
	 		}
	 		
	 		// We target only the right ul
	 		var classNameOfContainer = "ul";
	 		if (container.attr('class') != undefined)
	 			classNameOfContainer = classNameOfContainer + "." + container.attr('class').replace(/ +(?= )/g,'').split(' ').join('.');
	 		if (classNameOfContainer.indexOf(".sub-ul") == -1)
	 			classNameOfContainer = classNameOfContainer + '.sub-ul';

	 		if (config.reset)
	 			merge();
	 		else
	 			if (getSiblings().length >= 1)
	 				merge();
				explode();

			return {explode: explode, merge: merge, config: config};
 		});

 		return map;
 	};
})(jQuery);