// args[0]: max temp C

const exec = require('child_process').exec;

module.exports = function(args) {
	return new Promise(function(resolve, reject) {
		const targetTemp = (function() {
			const input = args[0];
			if (input == undefined) return 50;
			else if (isNaN(input)) reject([false, "Invalid temp threshold \"" + input + "\""])
			else return Number(input)
		}())
		exec('sudo ssacli "controller slot=0 Array a physicaldrive all show detail" | grep "Current Temp"', function(error, stdout, stderr) {
			var lines = stdout.trim().split('\n') || []
			var errs = lines.reduce(function(ret, line) {
				var regex = /Current Temperature \(C\): (\d+)/
				var regexResult = regex.exec(line)
				if (!regexResult) return ret.concat(null);
				else if (regexResult[1] && Number(regexResult[1]) <= targetTemp) return ret;
				else return ret.concat([regexResult[1]]);
			}, []) || []

			if (errs.length == 0) resolve()
			else if (errs.length == 1 && errs[0] == null) reject([false, "Unable to check HD temp via HP raid controller"])
			else reject([true, "Bad HD temp accoring to HP raid controller: " + errs.join(", ")])
		})
	});
};
