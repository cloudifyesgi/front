exports.config = {
    seleniumServerJar: "../node_modules/protractor/node_modules/webdriver-manager/selenium/selenium-server-standalone-3.141.59.jar",
    framework: "mocha",
    capabilities: {
        'browserName': 'chrome'
    },
    specs: ["./e2e/unit_test_mmi.ts"],
};
