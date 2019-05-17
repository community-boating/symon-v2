const exec = require('child_process').exec;

module.exports = function(args) {
	return new Promise(function(resolve, reject) {
		exec(`sudo ssacli "controller slot=0 Array a physicaldrive all show detail" | grep Status`, function(error, stdout, stderr) {
			var lines = stdout.trim().split('\n') || []
			var errs = lines.reduce(function(ret, line) {
				var regex = /Status: (\w*)/
				var regexResult = regex.exec(line)
				if (!regexResult) return ret.concat(null);
				else if (regexResult[1] == "OK") return ret;
				else return ret.concat(regexResult[1]);
			}, []) || []

			if (errs.length == 0) resolve()
			else if (errs.length == 1 && errs[0] == null) reject([false, "Unable to check HD status via HP raid controller"])
			else reject([true, "Bad HD status accoring to HP raid controller: " + errs.join(", ")])
		})
	});
};
