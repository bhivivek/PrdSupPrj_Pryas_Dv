/*global location */
sap.ui.define([
		"ibm/tlp/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"ibm/tlp/model/formatter" 
	], function (BaseController, JSONModel, oDataModel, formatter) {
		"use strict";

		return BaseController.extend("ibm.tlp.controller.Detail", {

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
					delay : 0,
					
					lineItemListTitle: this.getResourceBundle().getText("detailLineItemTableHeading"),
					Suppliers: []

				});
				debugger;

				this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);

				this.setModel(oViewModel, "detailView");

				this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));
			},

			/* =========================================================== */
			/* event handlers                                              */
			/* =========================================================== */

			/**
			 * Event handler when the share by E-Mail button has been clicked
			 * @public
			 */
			onShareEmailPress : function () {
				var oViewModel = this.getModel("detailView");

				sap.m.URLHelper.triggerEmail(
					null,
					oViewModel.getProperty("/shareSendEmailSubject"),
					oViewModel.getProperty("/shareSendEmailMessage")
				);
			},

			/**
			 * Event handler when the share in JAM button has been clicked
			 * @public
			 */
			onShareInJamPress : function () {
				this.getRouter().navTo("anubhav");
				// var oViewModel = this.getModel("detailView"),
				// 	oShareDialog = sap.ui.getCore().createComponent({
				// 		name : "sap.collaboration.components.fiori.sharing.dialog",
				// 		settings : {
				// 			object :{
				// 				id : location.href,
				// 				share : oViewModel.getProperty("/shareOnJamTitle")
				// 			}
				// 		}
				// 	});

				// oShareDialog.open();
			},

			onListUpdateFinished: function(oEvent) {
				var sTitle,
				iTotalItems = oEvent.getParameter("total"),
				oViewModel = this.getModel("detailView");
				debugger;
				if (this.byId("lineItemsList").getBinding("items").isLengthfinal()) {
					if(iTotalItems) {
						sTitle = this.getResourceBundle().getText("detailLineItemTableHeadingCount", [iTotalItems]);
					}
					else {
						sTitle = this.getResourceBundle().getText("detailLineItemTabHeading");


					}
					oViewModel.setProperty("/lineItemListTitle", sTitle);

					}
				},

			

			/* =========================================================== */
			/* begin: internal methods                                     */
			/* =========================================================== */

			/**
			 * Binds the view to the object path and expands the aggregated line items.
			 * @function
			 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
			 * @private
			 */
			
			_onObjectMatched : function (oEvent) {
				var sObjectId =  oEvent.getParameter("arguments").objectId;
				this.getModel().metadataLoaded().then( function() {
					var sObjectPath = this.getModel().createKey("ProductSet", {
						ProductId :  sObjectId
					});
					debugger;
					this._bindView("/" + sObjectPath);
				}.bind(this));
			},

			/**
			 * Binds the view to the object path. Makes sure that detail view displays
			 * a busy indicator while data for the corresponding element binding is loaded.
			 * @function
			 * @param {string} sObjectPath path to the object to be bound to the view.
			 * @private
			 */
			_bindView : function (sObjectPath) {
				// Set busy indicator during view binding
				var oViewModel = this.getModel("detailView");

				// If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
				oViewModel.setProperty("/busy", false);

				this.getView().bindElement({
					path : sObjectPath,
					events: {
						change : this._onBindingChange.bind(this),
						dataRequested : function () {
							oViewModel.setProperty("/busy", true);
						},
						dataReceived: function () {
							oViewModel.setProperty("/busy", false);
						}
					}
				});


				//call /To_Supplier
				debugger;
				//var oDataModelNew = new oDataModel("/sap/opu/odata/sap/Z_MERA_FIORI_FAL_SPLITAPP_SRV/");
				var oDataModel = new oDataModel("/sap/opu/odata/sap/Z_MERA_FIORI_FAL_SPLITAPP_SRV/");
				var that = this;
				var sObjDetPath = ( sObjectPath + "/To_Supplier" );	
				oDataModel.read(sObjDetPath, {    
					success: function(oData, response){
						debugger;
						var olocalJSONModel = that.getView().getModel("detailView");
						olocalJSONModel.setProperty("/Suppliers", [oData]);

					},
					error: function(oError){
						debugger;
					}
				}
				);
			},

			_onBindingChange : function () {
				var oView = this.getView(),
					oElementBinding = oView.getElementBinding();

				// No data for the binding
				if (!oElementBinding.getBoundContext()) {
					this.getRouter().getTargets().display("detailObjectNotFound");
					// if object could not be found, the selection in the master list
					// does not make sense anymore.
					this.getOwnerComponent().oListSelector.clearMasterListSelection();
					return;
				}

				var sPath = oElementBinding.getPath(),
					oResourceBundle = this.getResourceBundle(),
					oObject = oView.getModel().getObject(sPath),
					sObjectId = oObject.ProductId,
					sObjectName = oObject.Name,
					oViewModel = this.getModel("detailView");

				this.getOwnerComponent().oListSelector.selectAListItem(sPath);

				oViewModel.setProperty("/saveAsTileTitle",oResourceBundle.getText("shareSaveTileAppTitle", [sObjectName]));
				oViewModel.setProperty("/shareOnJamTitle", sObjectName);
				oViewModel.setProperty("/shareSendEmailSubject",
					oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
				oViewModel.setProperty("/shareSendEmailMessage",
					oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
			},

			_onMetadataLoaded : function () {
				// Store original busy indicator delay for the detail view
				var iOriginalViewBusyDelay = this.getView().getBusyIndicatorDelay(),
					oViewModel = this.getModel("detailView");

				// Make sure busy indicator is displayed immediately when
				// detail view is displayed for the first time
				oViewModel.setProperty("/delay", 0);

				// Binding the view will set it to not busy - so the view is always busy if it is not bound
				oViewModel.setProperty("/busy", true);
				// Restore original busy indicator delay for the detail view
				oViewModel.setProperty("/delay", iOriginalViewBusyDelay);
			}

		});

	}
);