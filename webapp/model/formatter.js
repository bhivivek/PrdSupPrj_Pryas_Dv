sap.ui.define([
	], function () {
		"use strict";

		return {
			/**
			 * Rounds the currency value to 2 digits
			 *
			 * @public
			 * @param {string} sValue value to be formatted
			 * @returns {string} formatted currency value with 2 digits
			 */
			currencyValue : function (sValue) {
				if (!sValue) {
					return "";
				}

				return parseFloat(sValue).toFixed(2);
			},
			prepareUrl: function(ProductPicUrl){
				var productId = ProductPicUrl.split("/")[ProductPicUrl.split("/").length - 1];
				productId = productId.replace(".jpg","");
				return "/sap/opu/odata/sap/Z_MERA_FIORI_FAL_SPLITAPP_SRV/ProductSet('" + productId + "')/$value";
			}
		};

	}
);