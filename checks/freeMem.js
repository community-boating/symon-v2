// args[0]: max size in bytes

const exec = require('child_process').exec;

module.exports = function(args) {
	return new Promise(function(resolve, reject) {
		const pathToFile = args[0];
		const maxSize = Number(args[1])
		exec("free", function(error, stdout, stderr) {
			var trimmed = stdout.trim();
			var lines = trimmed.split('\n')
			console.log(lines)
			resolve()
		})
	});
};
