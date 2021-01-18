// args[0]: expected ubuntu codename
const exec = require('child_process').exec;

module.exports = function (args) {
	return new Promise(function(resolve, reject) {
		exec("lsb_release -c", function (error, stdout, stderr) {
			var regex = /^Codename:\s*(\w+)$/;
			const result = regex.exec(stdout.trim());
			if (result && result[1] && result[1] == args[0]) {
				resolve();
			} else {
				reject([true, `Expected to see ubuntu version codename ${args[0]} but instead saw ${result[1]}`]);
			}
		})
	});
};
