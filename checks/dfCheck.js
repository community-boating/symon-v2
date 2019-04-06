// args[0]: device
// args[1]: mountpoint
// args[2]: threshold

const exec = require('child_process').exec;

module.exports = function(args) {
	return new Promise(function(resolve, reject) {
		exec("df | grep " + args[0], function(error, stdout, stderr) {
			console.log(stdout)
			var regex = /\s*(\S+)\s*(\d+)\s*(\d+)\s*(\d+)\s*(\d{1,2})%\s*(\S+)/
			var result = regex.exec(stdout)
			if (result && result[6] == args[1]) {
				// found that device and mountpoint
				if (Number(result[5]) < Number(args[2])) resolve();
				else reject([true, "df threshold for " + args[0] + " mounted at " + args[1] + " was " + args[2] + "% but utilization is " + result[5] + "%"])
			} else {
				reject([false, "Unable to locate device " + args[0] + " mounted at " + args[1]])
			}
		})
	});
};
