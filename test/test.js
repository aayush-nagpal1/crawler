const mocha= require('mocha');
const chai = require('chai');
const expect= chai.expect;

const chaiHttp = require('chai-http');
const request= require('request');

const {getAllLinksInURL,getCleanURL} =require('../crawler')
const REGEX = new RegExp(/\/\/wiprodigital./, 'i');
chai.use(chaiHttp);

const url = "https://wiprodigital.com/";

describe('Return an array of links',function(){
    it('Returns all the links from a given url', function(done) {
        getAllLinksInURL(url)
        .then(res=>{
            expect(typeof res).to.be.equals("array");
        })
       done();
    });
});
