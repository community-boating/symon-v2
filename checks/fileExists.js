// args[0]: path/to/file

const exec = require('child_process').exec;

module.exports = function(args) {
	return new Promise(function(resolve, reject) {
		exec("test -e " + args[0], function(error, stdout, stderr) {
			if (error && error.code) reject([true, `File does not exist: "${args[0]}"`])
			else resolve();
		})
	});
};
