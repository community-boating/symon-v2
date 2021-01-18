// args[0]: expected nodejs major version
const exec = require('child_process').exec;

module.exports = function (args) {
	return new Promise(function(resolve, reject) {
		exec("nodejs -v", function (error, stdout, stderr) {
			var regex = /^v(\d+)\.(\d+)\.(\d+)/;
			const result = regex.exec(stdout.trim());
			if (result && result[1] && result[1] == args[0]) {
				resolve();
			} else {
				reject([true, `Expected to see nodejs major version ${args[0]} but instead saw ${result[1]}`]);
			}
		})
	});
};
