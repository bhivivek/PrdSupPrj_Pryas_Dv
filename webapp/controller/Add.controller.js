/*global location */
sap.ui.define([
		"ibm/tlp/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"ibm/tlp/model/formatter"
	], function (BaseController, JSONModel, formatter) {
		"use strict";

		return BaseController.extend("ibm.tlp.controller.Add", {

			formatter: formatter,

			/* =========================================================== */
			/* lifecycle methods                                           */
			/* =========================================================== */

			onInit : function () {
				// Model used to manipulate control states. The chosen values make sure,
				// detail page is busy indication immediately so there is no break in
				// between the busy indication for loading the view's meta data
				var oViewModel = new JSONModel({
					busy : false,
					delay : 0
				});

				 this.getRouter().getRoute("anubhav").attachPatternMatched(this._onObjectMatched, this);

				// this.setModel(oViewModel, "detailView");

				// this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));
			},
			onSave: function(){
				var payload = {	"ProductId": this.getView().byId("prodId").getValue(),
								"TypeCode": "PR",
								"Category": "Notebooks",
								"Name": this.getView().byId("name").getValue(),
								"Description": "This is created from Fiori",
								"SupplierId": "100000000",
								"SupplierName": "SAP",
								"TaxTarifCode": 1,
								"MeasureUnit": "EA",
								"Price": "999.0000",
								"CurrencyCode": "EUR"
					
				};
				
				var oDataModel = this.getView().getModel();
				oDataModel.create("/ProductSet", payload,{
					success: function(){
						sap.m.MessageToast.show("Wow!! magic");
					},
					error: function(oErrr){
						sap.m.MessageBox.error("Oops Something went wrong");
					}
				});
				
			},
		
			_onObjectMatched : function (oEvent) {
				// var sObjectId =  oEvent.getParameter("arguments").objectId;
				// this.getModel().metadataLoaded().then( function() {
				// 	var sObjectPath = this.getModel().createKey("ProductSet", {
				// 		ProductId :  sObjectId
				// 	});
				// 	this._bindView("/" + sObjectPath);
				// }.bind(this));
			}


		});

	}
);