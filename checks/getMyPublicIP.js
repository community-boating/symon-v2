// args[0]: expected IP
const exec = require('child_process').exec;

module.exports = function (args) {
	return new Promise(function(resolve, reject) {
		exec("host myip.opendns.com resolver1.opendns.com | grep myip", function (error, stdout, stderr) {
			var regex = /^myip\.opendns\.com has address ([0-9.]+)$/;
			const result = regex.exec(stdout.trim());
			if (result && result[1] && result[1] == args[0]) {
				resolve();
			} else {
				reject([true, `Expected to see public IP ${args[0]} but instead saw ${result[1]}`]);
			}
		})
	});
};
