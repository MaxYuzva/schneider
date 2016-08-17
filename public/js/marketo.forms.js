$(function() {
   

  //clear description field upon default message.
  var defaultMessage = "";
  
  $(document).on("focus",".marketo-form textarea",function(){
	if(defaultMessage ==="") defaultMessage = $(document).find(".marketo-form textarea").val();
		if($(this).val() === defaultMessage){
			$(this).val("");
		}
  });
  
  
  // marketo-form-submit
 
  $(".customer-care-center-form .marketo-form").on("marketo-form-submit", function(event, form, plugin) {

    // Set subject with value from level 2 drop down
    var level1Selector = $(this).find("select[name='subject']");
    var level2Selector = $(this).find("select[name='Subject_Lvl2']");
  	var countryCode = plugin.countryCode;
  	var co = "schneider-electric";
  	var len = co.length;
  	var newHost = $(location).attr('hostname')
  	var pos = newHost.toString().indexOf(co);

  	if(pos > 0) {
  		pos = pos + len;
  		newHost = customerAudience.toLowerCase() + ".SE" + newHost.substring(pos, newHost.length) + " - " + $("input[name='SourceDetail__c']").val();	
  	}

    if($(level2Selector).val() !== ""){
      var level2Value = level2Selector.val();

      if (level2Value.indexOf("\\")) {
        var level2Split = level2Value.split("\\");
        if (level2Split.length > 1) {
          level2Value = level2Split[1];
          $("option:selected", level2Selector).attr("value", level2Value.trim());
        } 
      }
      // This is code I'm commenting out for 802.
      // The original requirement from the marketo spreadsheet was to change the subject to the level 2 value.
      // $(level1Selector).find("option[value='"+$(level1Selector).val()+"']").attr("value", $(level2Selector).val());
    }
    else {
      $("option:selected", level2Selector).attr("value", "Not Selected");
    }

    if($(level1Selector).val() === ""){
      $("option:selected", level1Selector).attr("value", "Not Selected");
    }
    
       // Set Source detail for marketo
	 $(this).find("input[name='SourceDetail__c']").val(newHost);  
  }).on("marketo-form-loaded", function(event, form, plugin) {
    
  	// Set phone
    var phoneColumn = $(this).find("input[name='Phone']").closest('.mktoFormCol'); 
    phoneColumn.addClass('active');

    // Setup Country / State selector functionality
    // TODO: IE8 Selection
    var countrySelector = $(this).find("select[name='Country']");
    var stateSelector = $(this).find("select[name='State']");
    var countryCode = plugin.countryCode;

    if ($("html.ie8").length == 0 && $.fn.selectize) {
      $(countrySelector)[0].selectize.setValue(countryCode);

      function SetStateSelectize(countryCode) {

        var selectLabel = plugin.getFormLabel("State");
        var label = plugin.getFormLabel("State_" + countryCode);

        $(stateSelector)[0].selectize.clearOptions();

        if (selectLabel !== undefined && selectLabel.Values.length > 0) {
          $(stateSelector)[0].selectize.addOption({
            value: "",
            text: selectLabel.Values[0].Value
          });

        }

        if (label !== undefined) {

          for (var i = 0; i < label.Values.length; i++) {
            $(stateSelector)[0].selectize.addOption({
              value: label.Values[i].Name,
              text: label.Values[i].Value
            });
          }

          $(stateSelector)[0].selectize.enable();
        } else {
          $(stateSelector)[0].selectize.disable();
        }

        $(stateSelector)[0].selectize.setValue("");

      }

      SetStateSelectize(countryCode);

      $(countrySelector).on("change", function() {
        SetStateSelectize($(this).val());
      });


    } else {
      // Selection functionality for IE8

      $(countrySelector).val(countryCode);

      function SetState(countryCode) {
        var selectLabel = plugin.getFormLabel("State");
        var label = plugin.getFormLabel("State_" + countryCode);

        $(stateSelector).empty();

        if (selectLabel !== undefined && selectLabel.Values.length > 0) {

          var selectOption = $("<option />").attr("value", "").text(selectLabel.Values[0].Value);

          $(stateSelector).append(selectOption);

          if (label !== undefined) {
            for (var i = 0; i < label.Values.length; i++) {
              if (!label.Values[i]) {
                continue;
              }
              var option = $("<option />").attr("value", label.Values[i].Name).text(label.Values[i].Value);
              $(stateSelector).append(option);

            }

            $(stateSelector).removeAttr('disabled');
          } else {
            $(stateSelector).attr("disabled", "disabled");
          }

          $(stateSelector).val("");

        }

      }

      SetState(countryCode);

      $(countrySelector).on("change", function() {
        SetState($(this).val());
      });

    }

    // Segment or Brand Selector functionality
	var level0Selector = $(this).find("select[name='SupportCategory__c']");
    var level1Selector = $(this).find("select[name='subject']");
    var level2Selector = $(this).find("select[name='Subject_Lvl2']");

    if ($("html.ie8").length == 0 && $.fn.selectize) {
		var level2Options = $.extend({}, $(level2Selector)[0].selectize.options);
		//Disable selectize sort fields
	 	$(level0Selector)[0].selectize.settings.sortField=[];
	    $(level1Selector)[0].selectize.settings.sortField=[];
	    $(level2Selector)[0].selectize.settings.sortField=[];
	    
	    $(level0Selector).on("change", function() {
			var enableSubjectL2 = false;
			var subjectValue = $(level1Selector)[0].selectize.getValue();
			
			if (subjectValue !== "") {
				var level2 = $(level2Selector)[0].selectize.getValue();
				if(level2 === ""){
					$(level2Selector)[0].selectize.clearOptions();
					$.each(level2Options, function(key, object) {
						if (key.indexOf(subjectValue) >= 0 || key === "") {
							$(level2Selector)[0].selectize.addOption({
								text: object.text,
								value: object.value
							});

							if (key.indexOf(subjectValue) >= 0 && key !== "") {
								enableSubjectL2 = true;
							}
						}
				
						$(level2Selector)[0].selectize.setValue("");
				
						if (enableSubjectL2) {
							$(level2Selector)[0].selectize.enable();
						} else {
							$(level2Selector)[0].selectize.disable();
						}
					});
				}
			 }
	  
	  
			var categoryLabel = plugin.getFormLabel("SupportCategory__c");
			
			if(categoryLabel.Values.length > 0) {
				
				var categoryValue = $(this)[0].selectize.getValue();
				var subjectsDisabled = false;
				$.each(categoryLabel.Values, function(key,value) {
					if(value['disableSubjects'] && (value['Name'] == categoryValue)) {
						
						// reset the subject and disable subject / subject level 2
						$(level1Selector)[0].selectize.setValue("");
						$(level1Selector)[0].selectize.disable();
						$(level2Selector)[0].selectize.disable();
						subjectsDisabled = true;
					}
				});
				
				if(!subjectsDisabled) {
					$(level1Selector)[0].selectize.enable();
				}
			}
	  });
	
      $(level2Selector)[0].selectize.disable();
	  
      $(level1Selector).on("change", function() {
        var enable = false;
        var value = $(this)[0].selectize.getValue();

        if (value !== "") {
            $(level2Selector)[0].selectize.clearOptions();

            // Hack to set address values to Mandatory if Energy & Infrastructure is chosen
            if (ACTIVATE_ENIN_FUNCT && value === ENERGY_INFRASTRUCTURE_KEYWORD) {
                $("label[for='" + ADDRESS_KEYWORD + "'] > div").show();
                $("label[for='" + CITY_KEYWORD + "'] > div").show();
                $("label[for='" + STATE_KEYWORD + "'] > div").show();
            } else {
                $("label[for='" + ADDRESS_KEYWORD + "'] > div").hide();
                $("label[for='" + CITY_KEYWORD + "'] > div").hide();
                $("label[for='" + STATE_KEYWORD + "'] > div").hide();
            }

          $.each(level2Options, function(key, object) {

            if (key.indexOf(value) >= 0 || key === "") {
              $(level2Selector)[0].selectize.addOption({
                text: object.text,
                value: object.value
              });

              if (key.indexOf(value) >= 0 && key !== "") {
                enable = true;
              }
            }

          });
        }

        $(level2Selector)[0].selectize.setValue("");

        if (enable) {
          $(level2Selector)[0].selectize.enable();
        } else {
          $(level2Selector)[0].selectize.disable();
        }

      });


    } else {
      // Selection functionality for IE8

      $(level2Selector).attr("disabled", "disabled");

      var level2Options = [];

      $(level2Selector).find("option").each(function(index, item){
        var obj = {
          text: $(this).text(),
          value: $(this).val()
        };
        level2Options.push(obj);
      });

      $(level1Selector).on("change", function() {
        var enable = false;
        var value = $(this).val();

        if (value !== "") {

          $(level2Selector).empty();

          for(var i = 0; i < level2Options.length; i++){
            var obj = level2Options[i];

            if (obj.value.indexOf(value) >= 0 || obj.value === "") {

              var option = $("<option />").attr("value", obj.value).text(obj.text);
              $(level2Selector).append(option);
            }

            if (obj.value.indexOf(value) >= 0 && obj.value !== "") {
              enable = true;
            }

          }

        }

        $(level2Selector).val("");

        if (enable) {
          $(level2Selector).removeAttr("disabled");
        } else {
          $(level2Selector).attr("disabled", "disabled");
        }

      });

    }

  });

});
