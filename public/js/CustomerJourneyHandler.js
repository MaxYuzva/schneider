$(document).ready(function () {

    var CustomerJourneyHandler = {

        includeLegacy: false,

        /**
         * The css selector for links that should have the customer journey querystring appended.
         * @type {string}
         */
        customerJourneyClass: "a.queryStringJourney",

        /**
         * The jquery element for the actual customer journey navigation presentation.
         */
        customerJourneyNavElement: null,

        /**
         * Selectors for links that will have query string appended if current url has the special param already.
         * @type {string[]}
         */
        includeJourneyLinks: [
            ".tips-section",             // Segment pages
            ".uvp-items",                // Category pages
            ".little-list",              // Solution pages
            ".tab-bar"                   // Solution pages
        ],

        /**
         * Initializes the customer journey handler.
         */
        init: function () {
            this.customerJourneyNavElement = $(".tab-bar"); // SDL-980 - change from .journey-bar to .tab-bar

            this.appendQueryStringToClasses();
            if (this.includeLegacy === true) {
                if (this.isOnCustomerJourney()) {
                    this.showCustomerJourneyNavigation();
                    if (this.customerJourneyNavElement.length > 0) {
                        this.setActivePage();
                        this.appendQueryStringToJourneySections();
                    }
                }
            } else {
                this.setActivePage();
            }
        },

        /**
         * Appends the journey query string to any links that has the customerJourneyClass class.
         */
        appendQueryStringToClasses: function () {
            var self = this;

            $(this.customerJourneyClass).each(function (index, element) {
                self.appendQueryString(element);
            });
        },

        /**
         * Appends the journey query string to any links within journey sections (specified by the includeJourneyLink array of selectors).
         * Should only get called if current url contains the journey=true query param.
         */
        appendQueryStringToJourneySections: function () {
            var self = this,
                i, 
                length = this.includeJourneyLinks.length;

            for (i = 0; i < length; i++) {
                $(this.includeJourneyLinks[i] + " a").each(function (index, element) {
                    self.appendQueryString(element);
                });
            }
        },

        /**
         * Appends the journey=true to the querystring of a given element.
         */
        appendQueryString: function (element) {
            var href;

            element = $(element);
            href = element.attr("href");
            if (!this.isOnCustomerJourney(href)) {
                href += this.hasQueryString(href) ? "&" : "?";
                href += "journey=true";

                element.attr("href", href);
            }
        },

        /**
         * Whether or not a given url has a query string already.
         * @returns {boolean}
         */
        hasQueryString: function (url) {
            if (url.indexOf("?") !== -1) {
                return true;
            }
            return false;
        },

        /**
         * Whether or not the page is on a customer journey (based on query string). If no argument is passed, will use the window location.
         * @param {string=} url - the url to check to see if it contains the journey query param
         * @returns {boolean}
         */
        isOnCustomerJourney: function (url) {
            if (!url) {
                url = window.location.href;
            }
            if (url.indexOf("?journey=true") !== -1 || url.indexOf("&journey=true") !== -1) {
                return true;
            }
            return false;
        },

        /**
         * Sets a page as being selective if its an active page. Adds 'selected' to the <li /> element.
         */
        setActivePage: function () {
            var self = this;
            var foundJourneyLink = false;

            $("a", this.customerJourneyNavElement).each(function (index, element) {
                var href,
                    pathParts,
                    page,
                    path;

                element = $(element);
                href = element.attr("href");

                if (href.indexOf(window.location.pathname) !== -1) {
                    element.parent().addClass("selected");
                    foundJourneyLink = true;
                    return false; /* same as break */
                }
            });
            if (!foundJourneyLink) {
                $("a", this.customerJourneyNavElement).each(function (index, element) {
                    var href,
                        pathParts,
                        page,
                        path;

                    element = $(element);
                    href = element.attr("href");

                    if (href.indexOf(window.location.pathname) === -1 && self.includeLegacy === false) {
                        pathParts = href.split("/");
                        page = pathParts.pop().split("?")[0];
                        if (page === "index.jsp") {
                            path = pathParts.join("/");
                            if (window.location.pathname.indexOf(path) !== -1) {
                                element.parent().addClass("selected");
                                foundJourneyLink = true;
                                return false; /* same as break */
                            }
                        }
                    }
                });
            }
        },

        /**
         * Shows the customer journey navigation.
         */
        showCustomerJourneyNavigation: function () {
            this.customerJourneyNavElement.show();
        }
    };

    CustomerJourneyHandler.init();
});