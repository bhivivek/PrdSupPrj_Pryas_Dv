jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

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
		"ibm/tlp/test/integration/NavigationJourneyPhone",
		"ibm/tlp/test/integration/NotFoundJourneyPhone",
		"ibm/tlp/test/integration/BusyJourneyPhone"
	], function () {
		QUnit.start();
	});
});