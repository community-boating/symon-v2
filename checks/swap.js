// args[0]: swap threshold in KB
const exec = require('child_process').exec;

module.exports = function(args) {
	return new Promise(function(resolve, reject) {
		const maxSwap = Number(args[0])
		exec("free | grep Swap | awk '{ print $3 }'", function(error, stdout, stderr) {
			console.log(stdout.trim())
			var result = Number(stdout.trim());
			if (result != null) {
				if (result > maxSwap) reject([true, "Swap using " + result + "KB; threshold was " + maxSwap])
				else resolve()
			} else reject([false, "Unable to determine swap use"])
		})
	});
};
