// args[0]: device to check
const exec = require('child_process').exec;

module.exports = function(args) {
	return new Promise(function(resolve, reject) {
		exec(`sudo smartctl -a ${args[0]} | grep 'ATA Error Count' | awk '{print $4}'`, function(error, stdout, stderr) {
			var result = stdout.trim()
			if (result == "") resolve()
			else reject([true, "HD Errors detected on " + args[0] + ": " + result])
		})
	});
};
