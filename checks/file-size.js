// args[0]: path/to/file
// args[1]: max size in bytes

const exec = require('child_process').exec;

module.exports = function(args) {
	return new Promise(function(resolve, reject) {
		const pathToFile = args[0];
		const maxSize = Number(args[1])
		exec("stat " + pathToFile + " | grep Size | awk {'print $2'}", function(error, stdout, stderr) {
			var result = Number(stdout.trim());
			if (result) {
				if (result > maxSize) reject([true, "Size of " + pathToFile + " was "+ result.toLocaleString() + "B; threshold was " + maxSize.toLocaleString()])
				else resolve()
			} else reject([false, "Unable to determine filesize of " + pathToFile])
		})
	});
};
