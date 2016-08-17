$( document ).ready(function() {

    var GoBackButtonHandler = {

        /**
         * The css selector for links that should have the 'go back Button' querystring appended.
         * @type {string}
         */
        goBackButtonClass: "a.go-back-button",

        /**
         * The css selector for siblings links that should have the 'go back Button' querystring appended.
         * @type {string}
         */
        goBackButtonSiblingsClass: "a.go-back-siblings",

        /**
         * The css selector for siblings links that should have the 'go back Button' querystring appended.
         * @type {string}
         */
        goBackButtonTagClass: "a.go-back-button-tag",


        /**
         * Initializes the 'go back Button' handler.
         */
        init: function () {
            this.appendQueryStringToClasses();
        },

        /**
         * Appends the 'go back Button' query string to any links that has the goBackButtonClass class.
         */
        appendQueryStringToClasses: function () {
            var self = this;

            $(this.goBackButtonClass).each(function (index, element) {
                self.appendQueryString(element);
            });

            $(this.goBackButtonSiblingsClass).each(function (index, element) {
                self.appendQueryStringToSibling(element);
            });

            $(this.goBackButtonTagClass).each(function (index, element) {
                self.appendQueryStringToTag(element);
            });
        },


        /**
         * Appends the 'go-back-url' and 'component-id' to the querystring of a given element.
         */
        appendQueryString: function (element) {
            var href;

            var compId = this.getComponentIdFromCssClass(element);
            element = $(element);


            href = element.attr("href");
            href += !this.hasQueryString(href) ? "?" : "&";
            href += "go-back-url=" + encodeURIComponent(window.location.href.split('?')[0]);
            if (compId !== undefined) {
                href += "&component-id=" + compId;
            }

            href = this.addQueryStringContext(href);
            element.attr("href", href);
        },

        /**
         * Appends the 'go-back-url' and 'component-id' to the querystring of the sibiling of the current page (second level Nav).
         */
        appendQueryStringToSibling: function (element) {
            var href;

            var goBackUrl = this.getQueryStringValue("go-back-url");
            var componentId = this.getQueryStringValue("component-id");


            element = $(element);
            href = element.attr("href");
            href += !this.hasQueryString(href) ? "?" : "&";
            if(goBackUrl != null && goBackUrl)
                href += "go-back-url=" + encodeURIComponent(goBackUrl);
            if(componentId != null && componentId)
                href += "&component-id=" + componentId;

            href = this.addQueryStringContext(href);
            element.attr("href", href);
        },


        appendQueryStringToTag: function (element) {
            var href;

            element = $(element);
            href = element.attr("href");
            href += !this.hasQueryString(href) ? "?" : "&";
            var queryParams = this.parseQueryString(window.location.search);
            for(var key in queryParams)
            {
                if (href.indexOf(key) === -1 && key != "go-back-url" && key != "component-id")
                {
                    var strSeparator = href.lastIndexOf("?") + 1 == href.length ? "" : "&";
                    href += strSeparator + key +"=" + queryParams[key];
                }
            }
            element.attr("href", href);
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

        getQueryStringValue : function (name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        },

        getComponentIdFromCssClass: function (element) {
            element = $(element);
            var compId;
            var classList = element.attr('class').split(/\s+/);
            $.each( classList, function(index, item){
                var items = item.match("^compid-(\\d+$)")
                if (items) {
                    compId = items[1];
                    return false;
                }
            });
            return compId;
        },

        parseQueryString : function( queryString ) {
            if (queryString.indexOf("?") == 0) {
                queryString = queryString.substring(1);
            }


            var params = {}, queries, temp, i, l;
            // Split into key/value pairs
            queries = queryString.split("&");

            // Convert the array of strings into an object
            for ( i = 0, l = queries.length; i < l; i++ ) {
                temp = queries[i].split('=');
                params[temp[0]] = temp[1];
            }
            return params;
        },

        addQueryStringContext : function(href)
        {
            var queryParams = this.parseQueryString(window.location.search);
            for(var key in queryParams)
            {
                if (href.indexOf(key) === -1)
                {
                    href += "&" + key +"=" + queryParams[key];
                }
            }

            return href;
        }


    };

    GoBackButtonHandler.init();
});