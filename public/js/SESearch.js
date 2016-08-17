/**
 * The SEGuidedSearch API contains the logic and functionality for the guided search within the global header.
 * See the Autonomy Search schema in Tridion for details on where the configuration comes from (url's).
 */
$(document).ready(function() {

    $.support.cors = true;
	var cat;
    var searchSwitch = $("#searchSwitch").val()
    var SEGuidedSearch = {

        /**
         * The jQuery element that contains the search category select element.
         */
        categoryElement: null,

        /**
         * The jQuery element for the element that contains the data attributes for the search configuration.
         */
        dataElement: null,

        /**
         * The jQuery element for the unordered list element that contains the results of the auto complete.
         */
        searchAutoCompleteElement: null,

        /**
         * The jQuery element for the search submit button within the header.
         */
        searchButtonElement: null,

        /**
         * The jQuery element for the text field that contains the search terms.
         */
        searchTermElement: null,

        /**
         * The url of the web service that returns the categories to populate the dropdown box.
         */
        categoriesUrl: null,

        /**
         * The url of the web service to get the guided search results from.
         * @type {string}
         */
        guidedSearchUrl: null,

        /**
         * The url of the external search results page.
         * @type {string}
         */
        searchResultsUrl: null,

        /**
         * Initializes the guided search.
         */
        init: function() {
            var self = this;

            this.categoryElement = $("#headerSearchCategory");
            this.dataElement = $(".headerSearchData");
            this.searchAutoCompleteElement = $(".headerSearchAutocompleteResults");
            this.searchButtonElement = $(".headerSearchSubmit");
            this.searchTermElement = $(".headerSearchTerm");

            this.categoriesUrl = this.dataElement.data("categoriesurl");
            this.guidedSearchUrl = this.dataElement.data("guidedsearchurl");
            this.searchResultsUrl = this.dataElement.data("searchresultsurl");

            this.searchTermElement.val("");

            // on key up o fthe search term text field, get guided search results...
            this.searchTermElement.on("keyup", function(event) {
                self.getGuidedSearch(event);
            });

            // on autocomplete link click, go to search results page for that term.
            this.searchAutoCompleteElement.on("click", "a", function(event) {
                self.onAutocompleteLinkClick(event, $(this));
            });

            // on click of the search submit button, go to search results page...
            this.searchButtonElement.on("click", function(event) {
                event.preventDefault();
                self.gotoSearchResults(event);
                return false;
            });

            // ensure that the url's supplied end with "/" character. if not, add them
            if (searchSwitch == "searchGSS") {
                if (this.guidedSearchUrl[this.guidedSearchUrl.length - 1] !== "/") {
                    this.guidedSearchUrl = this.guidedSearchUrl + "/";
                }

                if (this.searchResultsUrl[this.searchResultsUrl.length - 1] !== "/") {
                    this.searchResultsUrl = this.searchResultsUrl + "/";
                }
                if (this.categoryElement.type == "hidden") {
                    this.populateCategoriesDropdown();
                }

            }

        },

        /**
         * Converts the spaces to dashes within a string.
         * @returns {string}
		 * Function is depricated as part of SDL-1802 (6/30/2016)
		*/
		/* convertSpacesToDashes: function(str) {
            return str.split(" ").join("-");
        }, */

        /**
         * Gets the guided search and appends the results into the search autocomplete element.
         */
        getGuidedSearch: function(event) {
            var self = this,
                term = this.searchTermElement.val();
			cat = this.categoryElement.val();

            event.preventDefault();
            this.searchTermElement.off("keyup");
            this.searchAutoCompleteElement.html("");
            
            
            if (term.length >= 3) {
            
                term = encodeURIComponent(encodeURIComponent(term)).replace(/%2520/g, "+");
                
                var search_url;
                if (searchSwitch == "searchGSA") {
                  search_url = this.guidedSearchUrl + term;
                }
                if (searchSwitch == "searchGSS") {
                  search_url = this.guidedSearchUrl + term;
                }
                $.ajax({
                    type: "GET",
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8",
                    url: search_url
                }).done(function(data) {
                    var dataDetail = data;
                    if (searchSwitch == "searchGSA") {
                        var results = data.autnresponse.responsedata.autn_hit;
                        var rows = new Array();

                        for (var i = 0; i < results.length; i++) {
                            rows[i] = {
                                keywords: results[i].autn_content.DOCUMENT.KEYWORDS,
                                urlId: results[i].autn_content.DOCUMENT.URL
                            }
                            dataDetail = rows;
                        }
                    }

                    $.each(dataDetail, function(key, item) {
                        var str = item.keywords,
                            detailUrl = item.urlId,
                            searchTerm = self.searchTermElement.val(),
							itemURL = item.redirectUrl,
							langType = item.langType;
                        var encodedSearchTerm;
						var params = {};
						var redirectUrl = "";
						
						// init langType
						params.langType = langType;

                        if (str != null && str != "") {
							encodedSearchTerm = encodeURIComponent(encodeURIComponent(str)).replace(/%2520/g, "+");
                            str = str.replace(new RegExp(searchTerm, "gi"),
                                '<span class="highlight">' + searchTerm + '</span>');
                            
							// GSS search
							if (searchSwitch == "searchGSS") {
								var elementUrl = "";
								
								if (itemURL != "") {
									elementUrl = itemURL;
								} else {
									elementUrl = self.searchResultsUrl + encodedSearchTerm;
									// + "?category=" + cat
									params.category = cat;
								}
																
                                redirectUrl = elementUrl;
                            } 
							// GSA search
							else if (searchSwitch == "searchGSA") {
								redirectUrl = detailUrl;
							}
                            
							if (searchSwitch == "searchGSA" || searchSwitch == "searchGSS") {
								redirectUrl = redirectUrl + "?" + $.param(params);
								
								self.searchAutoCompleteElement.append(
                                    '<li><a href="' + redirectUrl + 
                                    '" title="">' + str + '</a></li>');
                            }

                        }
                    });

                }).always(function() {
                    self.searchTermElement.on("keyup", function(event) {
                        self.getGuidedSearch(event);
                    });
                });
            } else {
                this.searchTermElement.on("keyup", function(event) {
                    self.getGuidedSearch(event);
                });
            }
        },

        /**
         * Takes the user to the search results page using the given term and category.
         */
        gotoSearchResults: function(event) {
            var term = encodeURIComponent(encodeURIComponent(this.searchTermElement.val())).replace(/%2520/g, "+");


            if (searchSwitch == "searchGSS") {

                window.location = this.searchResultsUrl + term;
            }
            if (searchSwitch == "searchGSA") {

                window.location = this.searchResultsUrl + term;
            }
        },

        /**
         * Event for when an auto complete link is clicked. 
         * Used an event rather than default href behavior so that we could dynamically append the where category to the search.
         */
        onAutocompleteLinkClick: function(event, jqLink) {
            var href = jqLink.attr("href");

            event.preventDefault();

            window.location = href;
        },

        /**
         * Populates the categories select element within the header.
         */
        populateCategoriesDropdown: function() {
            var self = this;

            $.ajax({
                url: this.categoriesUrl,
                contentType: "application/json; charset=UTF-8",
                dataType: 'json',
                type: "GET",

                success: function(data) {
                    var property,
                        selectize = self.categoryElement[0].selectize,
                        categories = [],
                        category,
                        length,
                        i;

                    // convert to array to sort by title...
                    for (property in data) {
                        if (data.hasOwnProperty(property)) {
                            categories[categories.length] = {
                                title: data[property],
                                value: property
                            };
                        }
                    }
                    // sort the array by title...
                    /** categories.sort(function (a, b) {
                         if (a.title > b.title) {
                             return 1;
                         } else if (a.title < b.title) {
                             return -1;
                         }
                         return 0;
                     }); */


                    // append values to the categories element.
                    length = categories.length;
                    for (i = 0; i < length; i++) {
                        category = categories[i];
                        selectize.addOption({
                            value: category.value,
                            text: category.title
                        });
                        if (i === 0) {
                            selectize.addItem(category.value);
                        }
                    }


                },

                error: function(data) {
                    console.log("Error!");
                }
            });
        }
    };

    SEGuidedSearch.init();
});