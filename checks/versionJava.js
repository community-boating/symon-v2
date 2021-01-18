// args[0]: expected java major version
const exec = require('child_process').exec;

module.exports = function (args) {
	return new Promise(function(resolve, reject) {
		exec("java -version", function (error, stdout, stderr) {
			var regex = /^openjdk version "(\d+)(?:\.[^\."]*)*"/;
			const result = regex.exec(stderr.trim());
			if (result && result[1] && result[1] == args[0]) {
				resolve();
			} else {
				reject([true, `Expected to see java major version ${args[0]} but instead saw ${result[1]}`]);
			}
		})
	});
};
