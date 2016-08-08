const exec = require('child_process').exec;

module.exports = function() {
	return new Promise(function(resolve, reject) {
		exec("nvidia-smi -q | grep \"Current Temp\"", function(error, stdout, stderr) {
			var regexp = /Current Temp\s*:\s*(\d*) C/
			var result = regexp.exec(stdout)
			if (result && result[1]) {
				if (result[1] > 20) reject("Temperature was " + result[1] + "C")
				else resolve()
			} else reject("Unable to determine temp")
		})
	});
};
