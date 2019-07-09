const protractor = require('protractor');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const path = require('path');
chai.use(chaiAsPromised);
// const expect = chai.expect;
const browser = protractor.browser;
const element = protractor.element;
const by = protractor.by;

const urlChanged = function (url) {
    return function () {
        return browser.getCurrentUrl().then(function (actualUrl) {
            return url !== actualUrl;
        });
    };
};

function httpGet(siteUrl) {
    const http = require('http');
    const defer = protractor.promise.defer();

    http.get(siteUrl, function (response) {

        let bodyString = '';

        response.setEncoding('utf8');

        response.on("data", function (chunk) {
            bodyString += chunk;
        });

        response.on('end', function () {
            defer.fulfill({
                statusCode: response.statusCode,
                bodyString: bodyString
            });
        });

    }).on('error', function (e) {
        defer.reject("Got http.get error: " + e.message);
    });

    return defer.promise;
}

describe('User', function () {

    beforeEach(function () {
    });

    it('should not signin', function () {
        browser.get('http://localhost:4200/#/login');
        this.timeout(10000);
        const userNameField = element(by.name('username'));
        const userPassField = element(by.name('password'));
        const loginForm = element(by.name("loginform"));

        userNameField.sendKeys('mauvais@identifiant.fr');
        userPassField.sendKeys('mauvais');

        chai.expect(userNameField.getAttribute('value')).to.eventually.equal('mauvais@identifiant.fr');
        chai.expect(userPassField.getAttribute('value')).to.eventually.equal('mauvais');
        loginForm.submit();

        browser.waitForAngular();
        chai.expect(browser.getCurrentUrl()).to.eventually.equal("http://localhost:4200/#/login"); // @TODO change url to https://www.cloudify.fr/#/login
    });

    it('should signin', function () {
        this.timeout(10000);
        const userNameField = element(by.name('username'));
        const userPassField = element(by.name('password'));
        const loginForm = element(by.name("loginform"));

        userNameField.clear();
        userNameField.sendKeys('l@l.fr');
        userPassField.clear();
        userPassField.sendKeys('test');

        chai.expect(userNameField.getAttribute('value')).to.eventually.equal('l@l.fr');
        chai.expect(userPassField.getAttribute('value')).to.eventually.equal('test');
        loginForm.submit();

        browser.waitForAngular();
        // browser.wait(urlChanged("http://localhost:4200/#/folders/0"), 2000);
        chai.expect(browser.getCurrentUrl()).to.eventually.equal("http://localhost:4200/#/folders/0"); // @TODO change url to https://cloudify.fr/#/folders/0
    });

    xit('should create a folder', function () {
        this.timeout(10000);
        const createDirBtn = element(by.id('createDirButton'));
        const submit = element(by.name('create'));
        createDirBtn.click();
        browser.sleep(1000);
        const name_field = element(by.name('directoryNameField'));
        name_field.sendKeys('Dossier de test IHM');
        submit.click();
        const folder = element(by.cssContainingText('.textCard', 'Dossier de test IHM'));
        chai.expect(folder.getText()).to.eventually.equal('Dossier de test IHM');
    });

    it('should open folder named Dossier de test IHM', function () {
        this.timeout(10000);
        const folder = element(by.cssContainingText('.textCard', 'Dossier de test IHM'));
        browser.actions().doubleClick(folder).perform();
        const breadcrumb = element(by.css('.breadcrumb-item.active'));
        chai.expect(breadcrumb.getText()).to.eventually.equal('Dossier de test IHM');
    });

    it('should upload a file named fichier.txt', async function () {
        this.timeout(10000);
        const deferred = protractor.promise.defer();
        const promise = deferred.promise;
        const fileToUpload = './files/fichier.txt';
        const absolutePath = path.resolve(__dirname, fileToUpload);

        const input = await element(by.css('.ngx-file-drop__file-input'));
        await input.sendKeys(absolutePath);
        browser.sleep(1000);

        const all = await element(by.css('.app-body'));
        all.getText().then(function (text) {
            chai.expect(text).to.contain('fichier.txt');
            text.fulfill();
        });
    });

});
