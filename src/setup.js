(function(){
	var dependence = {
		undersocre : 'npm install undersocre'
	},
	exec = require('child_process').exec,
	errors = [];
	var log = function(err,stdout,stderr){
		if (err) {
			errors.push(err);
			console.error(stderr);
		} 
	};
	for (var i in dependence) {
		exec(dependence, log);
	}
	if (errors.length) {
		console.error("done! But has some errors", errors);
	} else {
		console.log("done without error");
	}
}());