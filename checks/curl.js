// args[0]: url
// args[1]: expected response

const exec = require('child_process').exec;

module.exports = function(args) {
	return new Promise(function(resolve, reject) {
		exec("curl " + args[0], function(error, stdout, stderr) {
			if (stdout.trim() == args[1]) resolve()
			else if (!!error) reject([false, "Unable to curl URL " + args[0]])
			else reject([true, "URL " + args[0] + " did not return expected response"])
		})
	});
};
