#!/usr/bin/env node
/*
  Automatically grade files for the presence of specified HTML tags/attributes.
  Uses commander.js and cheerio. Teaches command line application development
  and basic DOM parsing.

  References:

  + cheerio
  - https://github.com/MatthewMueller/cheerio
  - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
  - http://maxogden.com/scraping-with-node.html

  + commander.js
  - https://github.com/visionmedia/commander.js
  - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

  + JSON
  - http://en.wikipedia.org/wiki/JSON
  - https://developer.mozilla.org/en-US/docs/JSON
  - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var URL_DEFAULT = "https://rawgithub.com/bmv-2143/bitstarter/master/index.html";
var rest = require('restler');

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
	console.log("%s does not exist. Exiting.", instr);
	process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    console.log("in checkHtmlFile");
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
	var present = $(checks[ii]).length > 0;
	out[checks[ii]] = present;
    }
    return out;
};

var checkUrlContent = function(url_content, checksfile) {
    console.log("in checkUrl");
    $ = cheerio.load(url_content);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
	var present = $(checks[ii]).length > 0;
	out[checks[ii]] = present;
    }
    return out;
};

var checkUrlLink = function(url, checksfile) {
    console.log("in checkUrlLink: " + url + " \ " + checksfile);

    rest.get(url).on('complete', function(result) {
	console.log("in onComplete function");
	if (result instanceof Error) {
	    console.error('Error: ' + result.message);
	    process.exit(1);
	} else {
	    //	    console.log("response:\n" + response);
	    //	    console.log("result:\n" + result);
	    var checkUrl = checkUrlContent(result, checksfile);
	    console.log(JSON.stringify(checkUrl, null, 4));
	    process.exit(0);
	}
    });
};

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

if(require.main == module) {
    console.log("in main");
    program
	.option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
	.option('-f, --file <html_file>', 'Path to index.html')
	.option('-u, --url <url_link>', 'Link to index.html', URL_DEFAULT)
	.parse(process.argv);

    if (program.file) {
	console.log("program.file: " + program.file);
	var checkJson = checkHtmlFile(program.file, program.checks);
	console.log(JSON.stringify(checkJson, null, 4));
	process.exit(0);
    }
    if (program.url) {
	console.log("program.url: " + program.url);
	console.log("program.checks: " + program.checks);
	checkUrlLink(program.url, program.checks);

    }
} else {
    exports.checkHtmlFile = checkHtmlFile;
}
