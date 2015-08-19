'use strict';

/* Services */

angular.module('myApp.services', [])
.service('competitionservice', ['$http', '$q', '$rootScope',
	function($http, $q, $rootScope, myConfig) {

		this.createCustomer = function(access_token, data) {
			return $.ajax({
				url: "/webresources/api/v3/sites/current/customers",
				type: "POST",
				conenection: "keep-alive",    
				contentType: "application/json",
				mimeType: "applicaiton/json ",
				processData: false,
				headers: {
				    "Authorization": $.cookie('access_token'),
				  
				},
				data: JSON.stringify(data)
			})

			.success(function(msg) {
				console.log(msg)

				return 'Created'
			})
			
			.done(function(msg) {
				console.log(msg);

				return 'Created'
			})

			.fail(function(jqXHR) {
				console.log("Request failed.");
				console.log("Error code: " + jqXHR.status);
				console.log("Error text: " + jqXHR.statusText);
				console.log("Response text: " + jqXHR.responseText);
				
				return jqXHR.statusText;
			})
		}

		this.getCustomers = function(access_token) {
			return $.ajax({
			    url: "/webresources/api/v3/sites/current/customers?fields=email1,mobilePhone,firstName,lastName,middleName,username",
			    type: "GET",
			    conenection: "keep-alive",    
			    contentType: "application/json",
			    mimeType: "applicaiton/json ",
			    headers: {
			        "Authorization": $.cookie('access_token')

			    }
			})

			.success(function(msg) {
				console.log(msg)

				return msg
			})
			
			.done(function(msg) {
				console.log(msg);

				return msg
			})

			.fail(function(jqXHR) {
				console.log("Request failed.");
				console.log("Error code: " + jqXHR.status);
				console.log("Error text: " + jqXHR.statusText);
				console.log("Response text: " + jqXHR.responseText);
				
				return jqXHR;
			})
		}
	}
])