const mocha = require('mocha');
const chai = require('chai');
const expect = chai.expect;

const chaiHttp = require('chai-http');
const request = require('request');

const {
    getAllLinksInURL,
    getCleanURL
} = require('../crawler')
const REGEX = new RegExp(/\/\/wiprodigital./, 'i');


const url = "https://wiprodigital.com/";

describe("CRAWLER TESTING", () => {
    describe('Return an array of links', () => {
        it('Returns all the links from a given url', (done) => {
            getAllLinksInURL(url).then(data => {
                expect(typeof data).to.be.equals("object");
                done();
            });
        });
    });



    describe('Return a clean url removing anything following a # or ?', function () {
        it('Returns clean url', function (done) {
            let site = url + "#option1";
            let result = getCleanURL(site)
            expect(result).to.be.equals("https://wiprodigital.com/");
            done();
        });

        it('Returns clean url', function (done) {
            let site = url + "?option2";
            let result = getCleanURL(site)
            expect(result).to.be.equals("https://wiprodigital.com/");
            done();
        });
    });
})