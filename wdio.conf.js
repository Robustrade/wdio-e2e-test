const { execSync } = require('child_process');

exports.config = {
    runner: 'local',

    specs: (process.env.PLATFORM === 'web') 
        ? ['./test/specs/web/**/*.spec.js'] // Only web tests
        : (process.env.PLATFORM === 'android') 
        ? ['./test/specs/mobile/android/**/*.spec.js'] // Only Android mobile tests
        : (process.env.PLATFORM === 'ios') 
        ? ['./test/specs/mobile/ios/**/*.spec.js'] // Only iOS mobile tests
        : [], // Default to empty if platform is not set

    maxInstances: 5,

    capabilities: getCapabilities(),

    logLevel: 'info',
    bail: 0,
    baseUrl: 'https://www.amazon.com',
    waitforTimeout: 10000,
    connectionRetryTimeout: 180000, // Increased timeout
    connectionRetryCount: 3,

    services: [
        ['chromedriver'], // For web tests
        ['appium', { args: { address: '127.0.0.1', port: 4723 } }], // For mobile tests
    ],

    framework: 'mocha',
    reporters: [
        'spec',
        ['allure', { outputDir: 'reports/allure-results' }],
    ],

    mochaOpts: {
        ui: 'bdd',
        timeout: 60000,
    },

    before: function () {
        global.expect = require('chai').expect;
    },

    /**
     * After test execution, generate the Allure HTML report and optionally open it.
     */
    onComplete: function () {
        console.log('Generating Allure HTML report...');
        try {
            // Generate the Allure HTML report
            execSync('allure generate --clean reports/allure-results -o reports/allure-report', { stdio: 'inherit' });

            // Optionally, open the Allure HTML report
            console.log('Opening Allure HTML report...');
            execSync('allure open -h localhost reports/allure-report', { stdio: 'inherit' });
        } catch (error) {
            console.error('Error generating or opening Allure HTML report:', error.message);
        }
    },

    afterSession: function (config, capabilities, specs) {
        // Make sure the Appium server is stopped after the test
        try {
            execSync('pkill -f "appium"'); // This will kill any running Appium server
            console.log('Appium server stopped.');
        } catch (error) {
            console.log('Error stopping Appium server:', error);
        }
    },
};

function getCapabilities() {
    const platform = process.env.PLATFORM || 'web'; // Default to 'web' if PLATFORM is not set
    console.log('Selected platform:', platform); // Debug: Log the platform

    if (platform === 'web') {
        return [
            {
                maxInstances: 1,
                browserName: 'chrome',
                acceptInsecureCerts: true,
            },
        ];
    } else if (platform === 'android') {
        return [
            {
                "appium:platformName": "Android",
                "appium:automationName": "UiAutomator2",
                "appium:deviceName": "L9AIGF00E117GY4",
                "appium:platformVersion": "12.0",
                "appium:app": "/Users/testvagrant/Downloads/WebDriverIOApp.apk", // Need To Change
                "appium:noReset": true,
                "appium:newCommandTimeout": 300,
                "appium:appWaitForLaunch": true,
            },
        ];
    } else if (platform === 'ios') {
        return [
            {
                "appium:platformName": "iOS",
                "appium:udid": "3C957481-5123-4E20-B6FE-460CA7471A37",
                "appium:deviceName": "iPhone 14 pro",
                "appium:platformVersion": "16.2",
                "appium:app": "/Users/testvagrant/Downloads/webDriverIOSApp.zip", // Need To Change
                "appium:automationName": "XCUITest",
                "appium:noReset": true,
                "appium:newCommandTimeout": 900,
                "appium:appWaitForLaunch": true,
            },
        ];
    }

    throw new Error(`Unsupported platform: ${platform}`);
}
