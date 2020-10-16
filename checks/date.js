const exec = require('child_process').exec;

module.exports = function(args) {
	return new Promise(function(resolve, reject) {
		exec("echo `hostname` `date`", function(error, stdout, stderr) {
			resolve(stdout)
		})
	});
};
