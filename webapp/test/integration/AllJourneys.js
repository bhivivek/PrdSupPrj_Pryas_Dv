jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

// We cannot provide stable mock data out of the template.
// If you introduce mock data, by adding .json files in your webapp/localService/mockdata folder you have to provide the following minimum data:
// * At least 3 ProductSet in the list

sap.ui.require([
	"sap/ui/test/Opa5",
	"ibm/tlp/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"ibm/tlp/test/integration/pages/App",
	"ibm/tlp/test/integration/pages/Browser",
	"ibm/tlp/test/integration/pages/Master",
	"ibm/tlp/test/integration/pages/Detail",
	"ibm/tlp/test/integration/pages/NotFound"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "ibm.tlp.view."
	});

	sap.ui.require([
		"ibm/tlp/test/integration/MasterJourney",
		"ibm/tlp/test/integration/NavigationJourney",
		"ibm/tlp/test/integration/NotFoundJourney",
		"ibm/tlp/test/integration/BusyJourney",
		"ibm/tlp/test/integration/FLPIntegrationJourney"
	], function () {
		QUnit.start();
	});
});