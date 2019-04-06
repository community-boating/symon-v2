// args[0]: max temp C

const exec = require('child_process').exec;

module.exports = function(args) {
	return new Promise(function(resolve, reject) {
		const targetTemp = (function() {
			const input = args[0];
			if (input == undefined) return 80;
			else if (isNaN(input)) reject([false, "Invalid temp threshold \"" + input + "\""])
			else return Number(input)
		}())
		exec("nvidia-smi -q | grep \"Current Temp\"", function(error, stdout, stderr) {
			var regexp = /Current Temp\s*:\s*(\d*) C/
			var result = regexp.exec(stdout)
			if (result && result[1]) {
				if (result[1] > targetTemp) reject([true, "GPU Temperature was " + result[1] + "C; threshold was " + targetTemp])
				else resolve()
			} else reject([false, "Unable to determine GPU temp"])
		})
	});
};
