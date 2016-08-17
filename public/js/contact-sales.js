$(function() {

	/*
	Global functions that are used for the whole form
	 */
	function initContactSalesForm() {
		hideStateSelects();
	}



	/*
	Functions to show/hide state select when a country is selected
	*/
	var countrySelect = $(".marketo-prefillable select[name=Country]").selectize();
	var stateSelect = $(".marketo-prefillable select[name^=State]");

	function hideStateSelects() {
		stateSelect.closest("p").hide();
		stateSelect.siblings(".selectize-control").hide();
	}

	function showSelectedStateSelect(countryCode) {
		stateSelect.closest("p").show();
		$(".marketo-prefillable select[name=State_" + countryCode + "] + .selectize-control").show();
	}

	countrySelect.change(function(e) {
		var countryIsSelectized = countrySelect[0].selectize;
		var selectedCountryCode = countrySelect[0].selectize.getValue();
		hideStateSelects();
		if (countryIsSelectized && $("select[name=State_" + selectedCountryCode + "] + .selectize-control").length != 0){
			showSelectedStateSelect(selectedCountryCode);
		}
	});



	

	/*
	Social fill-in
	Some social integrations are made, that use various social networks api (front-end only, javascript sdk).
	They are all triggered on click
	The sdk and key application are directly in the markup
	 */

	// LINKEDIN
	$(".linkedin").click(function(e) {
		e.preventDefault();
		IN.User.authorize(function(){});
		onLinkedInLoad();
	});

	// Setup an event listener to make an API call once auth is complete
	function onLinkedInLoad() { IN.Event.on(IN, "auth", getProfileData); }

	// Handle the successful return from the API call
	function onLinkedinSuccess(data) {
		$(".marketo-prefillable input[name='FirstName']").val(data.firstName);
		$(".marketo-prefillable input[name='LastName']").val(data.lastName);
		$(".marketo-prefillable input[name='Email']").val(data.emailAddress);
		$(".marketo-prefillable input[name='Company']").val(data.positions.values[0].company.name);
		if (countrySelect[0].selectize)
			countrySelect[0].selectize.addItem(data.location.country.code.toUpperCase());
		else
			$('.marketo-prefillable select>option[value="' + data.location.country.code.toUpperCase() + '"]').prop('selected', true);
	}

	// Handle an error response from the API call
	function onLinkedinError(error) { console.log(error); }

	// Use the API call wrapper to request the member's profile data
	function getProfileData() { IN.API.Raw("/people/~:(id,first-name,last-name,email-address,positions,location)").result(onLinkedinSuccess).error(onLinkedinError); }




	// FACEBOOK
	$(".facebook").click(function(e) {
		e.preventDefault();
		FB.login(function(response) {
			var token = response.authResponse.accessToken;
			var uid = response.authResponse.userID;
			var locationID = "";
			if (response.authResponse)
				FB.api('/me', 'get', { access_token: token, fields: 'id,email,first_name,last_name,location{location},work' }, function(response) {
					$(".marketo-prefillable input[name='FirstName']").val(response.first_name);
					$(".marketo-prefillable input[name='LastName']").val(response.last_name);
					$(".marketo-prefillable input[name='Email']").val(response.email);
					if (typeof response.work !== 'undefined') {
						$(".marketo-prefillable input[name='Company']").val(response.work[0].employer.name);
					}
					if (countrySelect[0].selectize && typeof response.location !== 'undefined') {
						countrySelect[0].selectize.addItem(getCountryCode(response.location.location.country));
					}
					else if (typeof response.country !== 'undefined') {
						$('.marketo-prefillable select>option[value="' + getCountryCode(response.country) + '"]').prop('selected', true);
					}
				});
			}, {scope: 'email,user_location,public_profile,user_work_history'}
		);
	});






	var isoCountries = {
		'AF' : 'Afghanistan',
		'AX' : 'Aland Islands',
		'AL' : 'Albania',
		'DZ' : 'Algeria',
		'AS' : 'American Samoa',
		'AD' : 'Andorra',
		'AO' : 'Angola',
		'AI' : 'Anguilla',
		'AQ' : 'Antarctica',
		'AG' : 'Antigua And Barbuda',
		'AR' : 'Argentina',
		'AM' : 'Armenia',
		'AW' : 'Aruba',
		'AU' : 'Australia',
		'AT' : 'Austria',
		'AZ' : 'Azerbaijan',
		'BS' : 'Bahamas',
		'BH' : 'Bahrain',
		'BD' : 'Bangladesh',
		'BB' : 'Barbados',
		'BY' : 'Belarus',
		'BE' : 'Belgium',
		'BZ' : 'Belize',
		'BJ' : 'Benin',
		'BM' : 'Bermuda',
		'BT' : 'Bhutan',
		'BO' : 'Bolivia',
		'BA' : 'Bosnia And Herzegovina',
		'BW' : 'Botswana',
		'BV' : 'Bouvet Island',
		'BR' : 'Brazil',
		'IO' : 'British Indian Ocean Territory',
		'BN' : 'Brunei Darussalam',
		'BG' : 'Bulgaria',
		'BF' : 'Burkina Faso',
		'BI' : 'Burundi',
		'KH' : 'Cambodia',
		'CM' : 'Cameroon',
		'CA' : 'Canada',
		'CV' : 'Cape Verde',
		'KY' : 'Cayman Islands',
		'CF' : 'Central African Republic',
		'TD' : 'Chad',
		'CL' : 'Chile',
		'CN' : 'China',
		'CX' : 'Christmas Island',
		'CC' : 'Cocos (Keeling) Islands',
		'CO' : 'Colombia',
		'KM' : 'Comoros',
		'CG' : 'Congo',
		'CD' : 'Congo, Democratic Republic',
		'CK' : 'Cook Islands',
		'CR' : 'Costa Rica',
		'CI' : 'Cote D\'Ivoire',
		'HR' : 'Croatia',
		'CU' : 'Cuba',
		'CY' : 'Cyprus',
		'CZ' : 'Czech Republic',
		'DK' : 'Denmark',
		'DJ' : 'Djibouti',
		'DM' : 'Dominica',
		'DO' : 'Dominican Republic',
		'EC' : 'Ecuador',
		'EG' : 'Egypt',
		'SV' : 'El Salvador',
		'GQ' : 'Equatorial Guinea',
		'ER' : 'Eritrea',
		'EE' : 'Estonia',
		'ET' : 'Ethiopia',
		'FK' : 'Falkland Islands (Malvinas)',
		'FO' : 'Faroe Islands',
		'FJ' : 'Fiji',
		'FI' : 'Finland',
		'FR' : 'France',
		'GF' : 'French Guiana',
		'PF' : 'French Polynesia',
		'TF' : 'French Southern Territories',
		'GA' : 'Gabon',
		'GM' : 'Gambia',
		'GE' : 'Georgia',
		'DE' : 'Germany',
		'GH' : 'Ghana',
		'GI' : 'Gibraltar',
		'GR' : 'Greece',
		'GL' : 'Greenland',
		'GD' : 'Grenada',
		'GP' : 'Guadeloupe',
		'GU' : 'Guam',
		'GT' : 'Guatemala',
		'GG' : 'Guernsey',
		'GN' : 'Guinea',
		'GW' : 'Guinea-Bissau',
		'GY' : 'Guyana',
		'HT' : 'Haiti',
		'HM' : 'Heard Island & Mcdonald Islands',
		'VA' : 'Holy See (Vatican City State)',
		'HN' : 'Honduras',
		'HK' : 'Hong Kong',
		'HU' : 'Hungary',
		'IS' : 'Iceland',
		'IN' : 'India',
		'ID' : 'Indonesia',
		'IR' : 'Iran, Islamic Republic Of',
		'IQ' : 'Iraq',
		'IE' : 'Ireland',
		'IM' : 'Isle Of Man',
		'IL' : 'Israel',
		'IT' : 'Italy',
		'JM' : 'Jamaica',
		'JP' : 'Japan',
		'JE' : 'Jersey',
		'JO' : 'Jordan',
		'KZ' : 'Kazakhstan',
		'KE' : 'Kenya',
		'KI' : 'Kiribati',
		'KR' : 'Korea',
		'KW' : 'Kuwait',
		'KG' : 'Kyrgyzstan',
		'LA' : 'Lao People\'s Democratic Republic',
		'LV' : 'Latvia',
		'LB' : 'Lebanon',
		'LS' : 'Lesotho',
		'LR' : 'Liberia',
		'LY' : 'Libyan Arab Jamahiriya',
		'LI' : 'Liechtenstein',
		'LT' : 'Lithuania',
		'LU' : 'Luxembourg',
		'MO' : 'Macao',
		'MK' : 'Macedonia',
		'MG' : 'Madagascar',
		'MW' : 'Malawi',
		'MY' : 'Malaysia',
		'MV' : 'Maldives',
		'ML' : 'Mali',
		'MT' : 'Malta',
		'MH' : 'Marshall Islands',
		'MQ' : 'Martinique',
		'MR' : 'Mauritania',
		'MU' : 'Mauritius',
		'YT' : 'Mayotte',
		'MX' : 'Mexico',
		'FM' : 'Micronesia, Federated States Of',
		'MD' : 'Moldova',
		'MC' : 'Monaco',
		'MN' : 'Mongolia',
		'ME' : 'Montenegro',
		'MS' : 'Montserrat',
		'MA' : 'Morocco',
		'MZ' : 'Mozambique',
		'MM' : 'Myanmar',
		'NA' : 'Namibia',
		'NR' : 'Nauru',
		'NP' : 'Nepal',
		'NL' : 'Netherlands',
		'AN' : 'Netherlands Antilles',
		'NC' : 'New Caledonia',
		'NZ' : 'New Zealand',
		'NI' : 'Nicaragua',
		'NE' : 'Niger',
		'NG' : 'Nigeria',
		'NU' : 'Niue',
		'NF' : 'Norfolk Island',
		'MP' : 'Northern Mariana Islands',
		'NO' : 'Norway',
		'OM' : 'Oman',
		'PK' : 'Pakistan',
		'PW' : 'Palau',
		'PS' : 'Palestinian Territory, Occupied',
		'PA' : 'Panama',
		'PG' : 'Papua New Guinea',
		'PY' : 'Paraguay',
		'PE' : 'Peru',
		'PH' : 'Philippines',
		'PN' : 'Pitcairn',
		'PL' : 'Poland',
		'PT' : 'Portugal',
		'PR' : 'Puerto Rico',
		'QA' : 'Qatar',
		'RE' : 'Reunion',
		'RO' : 'Romania',
		'RU' : 'Russian Federation',
		'RW' : 'Rwanda',
		'BL' : 'Saint Barthelemy',
		'SH' : 'Saint Helena',
		'KN' : 'Saint Kitts And Nevis',
		'LC' : 'Saint Lucia',
		'MF' : 'Saint Martin',
		'PM' : 'Saint Pierre And Miquelon',
		'VC' : 'Saint Vincent And Grenadines',
		'WS' : 'Samoa',
		'SM' : 'San Marino',
		'ST' : 'Sao Tome And Principe',
		'SA' : 'Saudi Arabia',
		'SN' : 'Senegal',
		'RS' : 'Serbia',
		'SC' : 'Seychelles',
		'SL' : 'Sierra Leone',
		'SG' : 'Singapore',
		'SK' : 'Slovakia',
		'SI' : 'Slovenia',
		'SB' : 'Solomon Islands',
		'SO' : 'Somalia',
		'ZA' : 'South Africa',
		'GS' : 'South Georgia And Sandwich Isl.',
		'ES' : 'Spain',
		'LK' : 'Sri Lanka',
		'SD' : 'Sudan',
		'SR' : 'Suriname',
		'SJ' : 'Svalbard And Jan Mayen',
		'SZ' : 'Swaziland',
		'SE' : 'Sweden',
		'CH' : 'Switzerland',
		'SY' : 'Syrian Arab Republic',
		'TW' : 'Taiwan',
		'TJ' : 'Tajikistan',
		'TZ' : 'Tanzania',
		'TH' : 'Thailand',
		'TL' : 'Timor-Leste',
		'TG' : 'Togo',
		'TK' : 'Tokelau',
		'TO' : 'Tonga',
		'TT' : 'Trinidad And Tobago',
		'TN' : 'Tunisia',
		'TR' : 'Turkey',
		'TM' : 'Turkmenistan',
		'TC' : 'Turks And Caicos Islands',
		'TV' : 'Tuvalu',
		'UG' : 'Uganda',
		'UA' : 'Ukraine',
		'AE' : 'United Arab Emirates',
		'GB' : 'United Kingdom',
		'US' : 'United States',
		'UM' : 'United States Outlying Islands',
		'UY' : 'Uruguay',
		'UZ' : 'Uzbekistan',
		'VU' : 'Vanuatu',
		'VE' : 'Venezuela',
		'VN' : 'Viet Nam',
		'VG' : 'Virgin Islands, British',
		'VI' : 'Virgin Islands, U.S.',
		'WF' : 'Wallis And Futuna',
		'EH' : 'Western Sahara',
		'YE' : 'Yemen',
		'ZM' : 'Zambia',
		'ZW' : 'Zimbabwe'
	};

	var isoCodes = {};
	for (var code in isoCountries) { isoCodes[isoCountries[code]] = code; }
	function getCountryCode (countryName) {
		if (isoCodes.hasOwnProperty(countryName)) return isoCodes[countryName];
		else return countryName;
	}








	var contactFormDropdown = $(".contact-form--widget .dropdown-contact");
	var maxHeightDropdown;

	if ($('.contact-form--widget .dropdown-contact .confirm').length > 0) {
		var rightColumnHeight = $(".contact-form--widget .confirm").outerHeight();
		var leftColumnHeight = 0;
	}
	else {
		var rightColumnHeight = $(".contact-form--widget .right-column").outerHeight();
		var leftColumnHeight = $(".contact-form--widget .left-column").outerHeight();
	}

	contactFormDropdown.css('max-height', 0);

	function contactFormHeight() {
		if ($(".contact-form--widget").hasClass('active')) contactFormDropdown.css('max-height', maxHeightDropdown);
		else contactFormDropdown.css('max-height', 0);
	}

	//accordion contact-form
	$(".contact-form--widget .accordion-contact").on("click", function(){
		if($(this).parent().hasClass('active'))
			$(this).parent().removeClass('active');
		else
			$(this).parent().addClass('active');
		contactFormHeight();
	});

	$("body").on("desktopToMobile desktopToTablet", function() {
		rightColumnHeight = $(".contact-form--widget .right-column").outerHeight();
		leftColumnHeight = $(".contact-form--widget .left-column").outerHeight();
		maxHeightDropdown = leftColumnHeight + rightColumnHeight;
		contactFormHeight();
	});

	$("body").on("mobileToDesktop tabletToDesktop", function() {
		maxHeightDropdown = rightColumnHeight > leftColumnHeight ? rightColumnHeight : leftColumnHeight;
		contactFormHeight();
	});





	initContactSalesForm();

});