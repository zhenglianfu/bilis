module.exports = (function(){
	var fs = require('fs'),
		_ = require('underscore'),
		CONSTANT = {
			PATH : './'
		};
	var userConfig, config = {};
	try{
		userConfig = require("./bilisConf.js");	
	} catch(error) {
		console.log("wranning: bilisConfig.js is not existed, bilis will use default configuration.");
	}
	config = _.extend(config, userConfig);
	var foo = function(error, files){
		if (error) console.log(error);
		else console.log(files);
	}
	var bilis = {
		dir : function(fn){
			fs.readdir(CONSTANT.PATH, fn || foo);
		},
		bulid : function(){

		}
	};
	return bilis;
}());