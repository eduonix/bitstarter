#!/usr/bin/env node
var fs = require('fs');
var sys = require('util');
var program = require('commander');
var cheerio = require('cheerio');
var HTMLFILE_DEFAULT= "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var rest = require('restler');
var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)){
	console.log("%s does not exist. Exiting.", instr);
	process.exit(1);
	}
    return instr;
};
var urlData = function(url){
var result = "Test";
rest.get('url').on('complete',function(result){
    if (result instanceof Error) {
	sys.puts('Error:' + result.message);
	}else{
	    sys.puts(result);
	    }
});
return result.toString();
};


var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile){
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile){
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
	var present = $(checks[ii]).length > 0;
	out[checks[ii]] = present;
	}
    return out;
};

var clone = function(fn) {
    return fn.bind({});
};

if(require.main == module){
    program
    .option('-c, --checks <check_file>','Path to checks.json',clone(assertFileExists), CHECKSFILE_DEFAULT)
    .option('-f, --file <html_file>' ,'Path to index.html',clone(assertFileExists), HTMLFILE_DEFAULT)
    .option('-u, --url <url_link>','Path to html',clone(urlData),HTMLFILE_DEFAULT) 
    .parse(process.argv);
    if(program.file.length > 2){
    var checkJson = checkHtmlFile(program.file,program.checks);
    }else{
	var checkJson = checkHtmlFile(program.url,program.checks);
}
var outJson = JSON.stringify(checkJson, null, 4);
    console.log(outJson);
} else {
    exports.checkHtmlFile = checkHtmlFile;
}
