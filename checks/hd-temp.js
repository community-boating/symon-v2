const exec = require('child_process').exec;

module.exports = function(args) {
	return new Promise(function(resolve, reject) {
		const device = args[0];
		if (device == null) reject([false, "HD Temp: no device specified"])
		const targetTemp = (function() {
			const input = args[1];
			if (input == undefined) return 50;
			else if (isNaN(input)) reject([false, "Invalid temp threshold \"" + input + "\""])
			else return Number(input)
		}())
		exec("smartctl -a " + device + " | grep Temp | awk '{print $10}'", function(error, stdout, stderr) {
			var regexp = /(\d*)/
			var result = regexp.exec(stdout)
			if (result && result[1]) {
				if (result[1] > targetTemp) reject([true, "HD Temperature was " + result[1] + "C; threshold was " + targetTemp])
				else resolve()
			} else reject([false, "Unable to determine HD temp"])
		})
	});
};
