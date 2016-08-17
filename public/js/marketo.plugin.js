;
(function($, window, document, undefined) {
  'use strict';

  var pluginName = "marketo",

    defaults = {
      labels: [],
      additionalFields: []
    };

  function Plugin(element, options) {
    this.element = element;
    this.$element = $(element);

    this.options = $.extend({}, defaults, options);
    this.counts = {};

    this._defaults = defaults;
    this._name = pluginName;

    this.url = "//" + $(this.element).data("url");
    this.accountId = $(this.element).data("account-id");
    this.formId = $(this.element).data("form-id");
    this.redirectUrl = $(this.element).data("redirect-url");
    this.removeStyles = $(this.element).data("remove-styles");
    this.postUrl = $(this.element).data("post-url");
    this.web2emailPostUrl = $(this.element).data("web2email-post-url");
    this.languageCode = $(this.element).data("language-code");
    this.languageCodeField = $(this.element).data("language-code-field");
    this.countryCode = $(this.element).data("country-code");
    this.countryCodeField = $(this.element).data("country-code-field");
    this.honeyPot = $(this.element).data("honey-pot");
    this.watcherTimerId = undefined;
    this.watcherInterval = (!isNaN(parseInt($(this.element).data("watcher-interval")))) ? parseInt($(this.element).data("watcher-interval")) : 100;
    this.secondSourceSubmissionComplete = false;

    this.init();
  }

  Plugin.prototype = {
    // Initailise plugin
    init: function() {

      if (typeof MktoForms2 !== "undefined" && this.url !== undefined && this.accountId !== undefined && this.formId !== undefined) {
        this.loadForm();
      }

    },
    // Load and Setup form actions
    loadForm: function() {
      var self = this;
	  var formSubmitted = false;

      $(this.element).hide();
      $(this.element).append($("<form/>").attr("id", "mktoForm_" + this.formId));

      MktoForms2.loadForm(this.url, this.accountId, this.formId, function(form) {

        // Check for duplicate submissions. We shouldn't really have to
		// do this but form is being submitted twice in some cases
		form.onSubmit(function(form) {
			if (formSubmitted) {
				form.submitable(false);
			}
			
			formSubmitted = true;
		});
		
		// Process Successful submissions
        form.onSuccess(function(values, followUpUrl) {
          return Success(form, self);
        });

        // Process form validation
        form.onValidate(function() {
          return IsValid(form, self);
        });

        // Set form defaults
        form.vals(GetDefaults(form, self));

        // Set the Country and Language Codes
        SetLocaleDefaults(form, self);

        // Set form Labels
        SetLabels(form, self);

		// Set the validations
		SetValidation();

        // Remove marketo styles
        if (self.removeStyles) {
          RemoveStyles(form, self);
        }

        HideHoneyPot(form, self);

        AddAdditionalFields(form, self);

        if ($("html.ie8").length == 0) {

          // Setup wait for Social Sign In widget
          $(self.element).on('DOMNodeInserted', function(event) {
            if (event.target !== undefined && $(event.target).hasClass("cf_sign_on")) {
              SetSocialSignInLabels(event.target, self);
              $(self.element).off('DOMNodeInserted');
            }
          });

          // Catch the insert of the Social Sign In Tool Tip
          $(document).on('DOMNodeInserted', function(event) {
            if (event.target !== undefined && $(event.target).hasClass("cf_dialog")) {
              SetSocialSignInPopUpLabels(event.target, self);
            }
          });

        } else {
          // Use Timeout to watch for DOM changes if IE8
          // Start watcher if IE 8
          Watcher(self);
        }

        $(self.element).trigger("marketo-form-loaded", [form, self]);

        $(self.element).show();
      });

    },
    getFormLabel: function(key) {
      return GetFormLabel(key, this);
    },
    validateTelephone: function(tel) {
      return ValidateTelephone(tel);
    },
    validateEmail: function(email) {
      return ValidateEmail(email);
    },
    showError: function(element, form, message){
      ShowError(element, form, message);
    }

  };

  function Watcher(plugin) {

    // Catch Social Sign Insert if IE 8
    if ($("html.ie8").length > 0) {
      if ($(".cf_sign_on").length > 0) {
        SetSocialSignInLabels($(".cf_sign_on"), plugin);
      }

      if ($(".cf_dialog").length > 0) {
        SetSocialSignInPopUpLabels($(".cf_dialog"), plugin);
      }
    }

    // Catch submit button text change
    var submitLabel = GetSubmitLabel(plugin);
    var submitButton = GetSubmitButton(plugin);

    if (submitLabel !== undefined && submitButton.text() !== submitLabel.Label) {
      $(submitButton).text(submitLabel.Label);
    }

    // Refire Watcher
    plugin.watcherTimerId = setTimeout(function() {
      Watcher(plugin);
    }, plugin.watcherInterval);
  }

  // Find and set the localisations for the Soical Sign In Box
  function SetSocialSignInLabels(element, plugin) {
    var label = GetFormLabel("SocialSignOnTitle", plugin);
    if (label !== undefined && $(element).find(".cf_sign_on_caption").text() !== label.Label) {
      $(element).find(".cf_sign_on_caption").text(label.Label);
    }
  }

  // Find and set the localisations for the Soical Sign In Tool Tip
  function SetSocialSignInPopUpLabels(element, plugin) {
    var labelTitle = GetFormLabel("SocialSignOnPopUpTitle", plugin);
    if (labelTitle !== undefined) {
      $(element).find(".cf_synd_title").text(labelTitle.Label);
    }

    var labelMessage1 = GetFormLabel("SocialSignOnPopUpMessage1", plugin);
    if (labelMessage1 !== undefined) {
      $(element).find(".cf_newwindow_msg").text(labelMessage1.Label);
    }

    var labelMessage2 = GetFormLabel("SocialSignOnPopUpMessage2", plugin);
    if (labelMessage2 !== undefined) {
      var message = $(element).find(".cf_newwindow_msg2");
      var linkLabel = GetFormLabel("SocialSignOnPopUpMessage2Link", plugin);

      if ($(message).find("a").length > 0 && linkLabel !== undefined) {
        var link = $(message).find("a").text(linkLabel.Label);
        $(message).empty();
        $(message).append(labelMessage2.Label + " ");
        $(message).append(link);
      } else {
        $(message).text(labelMessage2.Label);
      }

    }
  }

  function SetLocaleDefaults(form, plugin) {

    if (plugin.languageCodeField !== undefined && plugin.languageCode !== undefined) {
      $(plugin.element).find(".mktoField[name='" + plugin.languageCodeField + "']").val(plugin.languageCode);
    }

    if (plugin.countryCodeField !== undefined && plugin.countryCode !== undefined) {
      $(plugin.element).find(".mktoField[name='" + plugin.countryCodeField + "']").val(plugin.countryCode);
    }

  }

  function HideHoneyPot(form, plugin) {
    if (plugin.honeyPot !== undefined) {
      $(plugin.element).find(".mktoFormRow:has(.mktoField[name='" + plugin.honeyPot + "'])").hide();
    }
  }

  function AddAdditionalFields(form, plugin) {

    if (plugin.options.additionalFields.length > 0) {
      for (var i = 0; i < plugin.options.additionalFields.length; i++) {
        var field = plugin.options.additionalFields[i];
        var hiddenElement = $("<input />").attr("type", "hidden").attr("name", field.Name).addClass("additonalField").val(field.Value);
        $(plugin.element).find(".mktoButtonRow").before(hiddenElement);
      }
    }
  }

  //
  function SetValidation() {
  $.each(validationLabels, function(index, value) {
    $("input#" + validationLabels[index].Name).attr("data-validation", validationLabels[index].Validation);
  });
  }

  function SetLabels(form, plugin) {
    $(plugin.element).find(".mktoField").each(function(index, item) {

      if (!$(this).is("button")) {
        var name = $(this).attr("name");
        var label = GetFormLabel(name, plugin);

        if (label !== undefined) {

          var labelElement = $(plugin.element).find("label[for='" + name + "']");

          // Set ELement Label
          if ($(labelElement).text() !== label.Label) {
            if ($(labelElement).find('.mktoAsterix').length > 0) {
              var asterix = labelElement.find('.mktoAsterix');
              $(labelElement).empty();
              $(labelElement).append(asterix);
              $(labelElement).append(label.Label);
            } else {
              $(labelElement).text(label.Label);
            }
          }

          // Set Drop down list Value labels
          if ($(this).is("select")) {
            if (label.Values !== undefined) {
              for (var i = 0; i < label.Values.length; i++) {
                var valueLabel = label.Values[i];
                if (!valueLabel) {
                  continue;
                }
                if ($(this).find("option[value='" + valueLabel.Name + "']").length > 0) {
                  $(this).find("option[value='" + valueLabel.Name + "']").text(valueLabel.Value);
                } else {
                  $(this).find("option").filter(function(index) {
                    return $(this).text() === valueLabel.Name
                  }).text(valueLabel.Value);
                }
              }
            }
          }

          // Set Radio button and Check box value labels
          if ($(this).is("[type='radio']") || $(this).is("[type='checkbox']")) {
            if (label.Values !== undefined) {
              var id = $(this).attr("id");
              var elementLabel = $(plugin.element).find("label[for='" + id + "']");
              for (var i = 0; i < label.Values.length; i++) {
                var valueLabel = label.Values[i];
                if ($(this).val() === valueLabel.Name || valueLabel.Name === elementLabel.text()) {
                  elementLabel.text(valueLabel.Value);
                  break;
                }
              }
            }
          }

          // Show / Hide Mandatory asterix
          if (labelElement.find('.mktoAsterix').length > 0) {
            if (label.Mandatory) {
              labelElement.find('.mktoAsterix').css({
                display: ""
              });
            } else {
              labelElement.find('.mktoAsterix').hide();
            }
          }

        }

      }


    });

    // Set Label for the submit button
    var submitLabel = GetSubmitLabel(plugin);

    if (submitLabel !== undefined) {
      var submitButton = GetSubmitButton(plugin);

      $(submitButton).text(submitLabel.Label);
    }

  }


  /**
   * Maps the field identifiers to match what the postUrl service is expecting for field names.
   * @param {object} values - the form values supplied by form.vals().
   * @returns {object} the new mapped field object (does not modify values object).
   */
  function MapPostUrlFields(values, plugin) {
    var mapping = {},
      i,
      label,
      mappedLabels,
      property;

    for (property in values) {
      if (values.hasOwnProperty(property)) {
        label = GetFormLabel(property, plugin);
        if (!label || !label.MappedName || mapping[label.MappedName]) {
          continue;
        }
        mappedLabels = GetFormMappedFields(label.MappedName, plugin);
        mapping[label.MappedName] = "";

        for (i = 0; i < mappedLabels.length; i++) {
          if (values[mappedLabels[i].Name]) {
            if (mapping[label.MappedName]) {
              mapping[label.MappedName] += "\r\n";
            }
            mapping[label.MappedName] += values[mappedLabels[i].Name];
          }
        }
      }
    }

    /*
     * This piece is for https://schneider.atlassian.net/browse/FBTWO-1010 and is a quick temporary fix to ensure the label gets submitted
     * to bFO. This solution WILL NOT work with anything other than the English site as bFO requires the english spellings.
     * A future fix will be put into place that will work cross sites/languages.
     */
    if (mapping["00NA0000006VNP6"]) {
      var countryLabel = GetFormLabel("Country", plugin);
      for (i = 0; i < countryLabel.Values.length; i++) {
        if (countryLabel.Values[i].Name === mapping["00NA0000006VNP6"]) {
          mapping["00NA0000006VNP6"] = countryLabel.Values[i].Value;
          break;
        }
      }
    }

    return mapping;
  }

  function Success(form, plugin) {

    // Redirect Page to custom thank you page
    if (plugin.redirectUrl !== undefined && plugin.redirectUrl !== '') {
      document.location.href = plugin.redirectUrl;
    }

    return false;

  }

  function FindRouteRule(form, plugin) {
    var formValues = form.vals();
    var routeRules = plugin.options.routingRules.routeMap;

    var categoryValue = formValues["SupportCategory__c"]; // ex. Additional Documentation Request
    var subjectValue = formValues["subject"];             // ex. Square D
    var subjectLevel2Value = formValues["Subject_Lvl2"];  // ex. NAFTA Information

    var routeRule; // ex. { type: "web2case", routeTo: "PRM_USA_ConsEng" }
    if (routeRules[categoryValue] && routeRules[categoryValue][subjectValue]) {
        if (routeRules[categoryValue][subjectValue][subjectLevel2Value]) {
            routeRule = routeRules[categoryValue][subjectValue][subjectLevel2Value];
        } else {
            routeRule = routeRules[categoryValue][subjectValue];
        }
    } else if(routeRules[categoryValue]) {
      routeRule = routeRules[categoryValue];
    }

    return routeRule;
  }

  function DoWeb2CaseSubmission(form, plugin, postUrl, values) {
      if ($("html.ie8").length == 0 && $("html.ie9").length == 0) {
          $.post(postUrl, values, function () {
              //alert( "success" );
          })
            .fail(function () {
                //alert( "error" );
            })
            .always(function () {
                //alert( "finished" );
                plugin.secondSourceSubmissionComplete = true;
                form.submit();
            });

      } else {
          var extIframe = $("<iframe />").css({
              "height": "0px;display:none;"
          }).attr("id", "marketo-plugin-form");
          var extForm = $("<form />").attr("method", "POST").attr("action", postUrl);

          $.each(values, function (key, value) {
              var extElement = $("<input />").attr("type", "hidden").attr("name", key).attr("id", key).attr("value", value);
              $(extForm).append(extElement);
          });

          var extSubmitButton = $("<button />").attr("type", "button").attr("value", "Submit");
          $(extForm).append(extSubmitButton);

          $(extIframe).appendTo('body').ready(function () {
              // console.log("ready");

              setTimeout(function () {
                  var extBody = $(extIframe).contents().find('body');
                  $(extBody).append(extForm);

                  $(extIframe).load(function () {
                      // console.log("load");
                      setTimeout(function () {
                          plugin.secondSourceSubmissionComplete = true;
                          form.submit();
                      }, 100);
                  });
                  // console.log("submit")
                  $(extBody).find("form").submit();

              }, 100);
          });
      }
  }

  function SubmitToSecondSource(form, plugin) {
      /**
      // UNCOMMENT THIS SECTION TO SEE MAPPED FIELDS WITHOUT POSTING TO URL
      console.log("FORM SUCCESSFUL:", MapPostUrlFields(form.vals(), plugin)); // TODO: Remove
      return false;
       **/

      var routeRule = FindRouteRule(form, plugin);
      if (routeRule === undefined || routeRule === null || routeRule.routeType === undefined || routeRule.routeType === null || routeRule.routeTo === undefined || routeRule.routeTo === null) {
          // console.error("Error: No rule found. Please check your configuration.");
          plugin.secondSourceSubmissionComplete = true;
          form.submit();
          return;
      }

      // only want to do this for the web2case route type
      if (routeRule.routeType == "web2case") {

          // Send data to another data repository
          if (plugin.postUrl !== undefined && plugin.postUrl !== '') {

              var values = MapPostUrlFields(form.vals(), plugin);
              values[plugin.options.routingRules.bfoId] = routeRule.routeTo; // ex. values["00NA000000AMM5z"] = "PRM_USA_ConsEng"

              $(plugin.element).find(".additonalField").each(function (index, item) {
                  values[$(this).attr("name")] = $(this).val();
              });

              DoWeb2CaseSubmission(form, plugin, plugin.postUrl, values);
          }
      } else if (routeRule.routeType == "web2email") {

          // plugin.web2emailPostUrl should never be empty if there are web2email routes,
          // but we should probably still check
          if (plugin.web2emailPostUrl !== undefined && plugin.web2emailPostUrl !== '') {
              var values = form.vals();
              values['SupportRoutingEmail'] = routeRule.routeTo;
              values['SupportRoutingSubject'] = routeRule.emailSubject;
              //values['FromEmail'] = plugin.options.routingRules.fromEmail;
              values['FromEmail'] = values['Email'];

              $.ajax({
                  url: plugin.web2emailPostUrl + ".request",
                  contentType: 'application/json; charset=utf-8',
                  dataType: 'json',
                  type: 'POST',
                  data: JSON.stringify(values),

                  success: function (data) {
                      //console.log("web2mail success");
                  },

                  error: function (data) {
                      //console.log("web2email error");
                  },

                  complete: function (data, status) {
                      plugin.secondSourceSubmissionComplete = true;
                      form.submit();
                  }
              });
          } else {
              console.error("Error: Post URL for web2email scenario was empty.")
          }
      } else {
          // default scenario. do nothing right now.
      }

  }

  function IsValid(form, plugin) {
    var vals = form.vals();
    var showError = false;

    $(plugin.element).find(".mktoField").each(function(index, item) {

      // Not sure why were not using 'item' here
      var name = $(this).attr("name");
      var label = GetFormLabel(name, plugin);

      // Check if the field is defined as mandatory
      if (!showError && label !== undefined) {

        var value = vals[name].trim();
        var element = form.getFormElem().find("#" + name);
        var type = $(this).attr("type");
		var validationType = $(this).data("validation");
		validationType = (validationType != null) ? validationType.toLowerCase() : '';
		
		// For text fields, update value to remove extra spaces from the user's input (whitespace is trimmed when variable is set above)
		if (type === "text") {
			$(element).val(value);
		}

        // Hack to set address values to Mandatory if Energy & Infrastructure is chosen
		if (ACTIVATE_ENIN_FUNCT && vals['subject'] === ENERGY_INFRASTRUCTURE_KEYWORD) {
		    if (name === ADDRESS_KEYWORD || name === CITY_KEYWORD || name === STATE_KEYWORD) {
		        label.Mandatory = true;
		    }
		} else {
		    if (name === ADDRESS_KEYWORD || name === CITY_KEYWORD || name === STATE_KEYWORD) {
		        label.Mandatory = false;
		    }
		}

		// if it's a mandatory field and is empty then it's an error, or if the field is disabled, or is a hidden selectize field
		if ((!label.Mandatory && value === '') || $(this).is(":disabled") || (!$(this).is(":visible") && !$(this).hasClass("selectized"))) {
          console.log("Either field is not mandatory & empty or the field is disabled. Ignoring.");
        } else if(label.Mandatory && value === '') {
          showError = true;
        } else if (validationType == "email" && !ValidateEmail(value)) {
          showError = true;
        } else if(validationType == "numeric" && !isNumber(value)) {
          showError = true;
        } else if(validationType == "alphanumeric" && !isAlphaNumeric(value)) {
          showError = true;
        } else if (validationType == "telephone" && !ValidateTelephone(value)) {
          showError = true;
        } else if ((type === "text") && (value === '' || value === label.Default)) {
          showError = true;
        } else if (($(this).is("textarea")) && (value === '' || value === label.Default || value.length < 10)) {
          showError = true;
        }

        if (showError) {
          form.submittable(false);
          ShowError(element, form, label.Error);
          //form.showErrorMessage(label.Error, element);

      return false;
        }
      }
    });

    if (!showError) {
      form.submittable(true);
    }

    if (form.submittable()) {
      // if the form is submittable, then add the submission date to the hidden field
      populateDateHiddenField(form, plugin, "emailFooterPostingDate");

      // Start watch for text change on submit button (DOMSubtreeModified not support in IE)
      if (CanSubmit(plugin)) {
        if(plugin.postUrl === ""){
          $(plugin.element).trigger("marketo-form-submit", [form, plugin]);

          DisableInputs(form, plugin);
        }
        if ($("html.ie8").length == 0) {
          clearTimeout(plugin.watcherTimerId);
          Watcher(plugin);
        }
      } else {
        $(plugin.element).trigger("marketo-form-submit", [form, plugin]);
        DisableInputs(form, plugin);
        form.submittable(false);
        SubmitToSecondSource(form, plugin);
      }
    }


    return !showError;
  }

  function GetDefaults(form, plugin) {
    // Set Default Values
    var defaults = {};

    $(plugin.element).find(".mktoField").each(function(index, item) {

      var name = $(this).attr("name");
      var label = GetFormLabel(name, plugin);

      if (label !== undefined && label.Default !== '') {
        defaults[name] = label.Default;
      }

    });

    return defaults;
  }

  function DisableInputs(form, plugin) {

    $(plugin.element).find(".mktoField, .mktoButton").each(function(index, item){

      if($(this).is("select") && $.fn.selectize && $("html.ie8").length == 0){
        $(this)[0].selectize.disable();
      }

      $(this).attr("disabled", "disabled");

    });
  }

  function ShowError(element, form, message){

    var height = $(element).parents(".mktoFormCol").outerHeight() +10;

    $('html, body').animate({

    }, 500, function(){
      form.showErrorMessage(message, element);
    });

  }

  function RemoveStyles(name, plugin) {
    // Remove Styles
    $("#mktoForm_" + plugin.formId + " style").remove();
    $("#mktoForm_" + plugin.formId + "").attr("style", "");
    $(".mktoLabel").attr("style", "");
    $(".mktoField").attr("style", "");
    $(".mktoFormRow").attr("style", "");
    $(".mktoFormCol").attr("style", "");
    $(".mktoButtonWrap").attr("style", "");
    $("#mktoForms2BaseStyle").remove();
    $("#mktoForms2ThemeStyle").remove();

    // To remove IE linked stylesheets
    $("html head link").each(function(index, item) {
      var href = $(this).attr("href");
      if (href.indexOf("marketo.com") >= 0) {
        $(this).remove();
      }
    });
  }

  /**
   * Gets an array of all the mapped fields given a supplied mapped field name.
   * @param {string} mappedName - the mapped field name to get the labels for.
   * @param {object} plugin - reference to the marketo plugin.
   * @returns {object[]} an array of labels.
   */
  function GetFormMappedFields(mappedName, plugin) {
    var i,
      length = plugin.options.labels.length,
      label,
      labels = [];

    for (i = 0; i < length; i++) {
      label = plugin.options.labels[i];
      if (label.MappedName === mappedName) {
        labels[labels.length] = label;
      }
    }
    return labels;
  }

  function GetFormLabel(name, plugin) {

    var label = undefined;

    for (var i = 0; i < plugin.options.labels.length; i++) {
      var l = plugin.options.labels[i];
      if (l.Name === name) {
        label = l;
      }

    }

    return label;

  }

  function populateDateHiddenField(form, plugin, fieldName) {
    var date = new Date(); 
    $(plugin.element).find("input[name='" + fieldName + "']").attr("Value",date.toUTCString());
  }

  function GetSubmitLabel(plugin) {
    return GetFormLabel("Submit", plugin);
  }

  function GetSubmitButton(plugin) {
    return $(plugin.element).find(".mktoButton[type='submit']");
  }

  function CanSubmit(plugin) {

    if (plugin.postUrl === undefined || plugin.postUrl === "") {
      return true;
    }

    if (plugin.postUrl !== undefined && plugin.postUrl !== "" && plugin.secondSourceSubmissionComplete) {
      return true;
    }

    return false;
  }

  function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
  }

  function isAlphaNumeric(inputtxt)
  {
    var letters = /^[0-9a-zA-Z]+$/;
    if(inputtxt.match(letters)) {
        return true;
    }
    else {
        return false;
    }
  }

  // Strip out the special characters and see if it's a valid number (no letters)
  function ValidateTelephone(tel) {
    var stripped = tel.replace(/[_\W]+/g, '');
    return isNumber(stripped);
  }

  function ValidateEmail(email) {
    var re = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return email !== '' && re.test(email);
  }

  $.fn[pluginName] = function(options) {
    return this.each(function() {
      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName,
          new Plugin(this, options));
      }
    });
  };

})(jQuery, window, document);
