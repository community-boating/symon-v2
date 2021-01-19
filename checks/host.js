// args[0]: host to lookup
// args[1]: expected resolution path
const exec = require('child_process').exec;
const EOL = require('os').EOL;

module.exports = function (args) {
	return new Promise(function(resolve, reject) {
		exec("host " + args[0], function (error, stdout, stderr) {
			const lines = stdout.trim().split(EOL);
			const regex = /(\S+)\s*(?:(?:is an alias for)|(?:has address))\s*(\S+?)\.?$/;
			return Promise.all(lines.map(line => regex.exec(line)).map(function(result) {
				if (result && result[2]) {
					return Promise.resolve(result[2]);
				} else {
					return Promise.reject();
				}
			})).then(successes => {
				if (successes.join("/") == args[1]) resolve();
				else reject([true, "Expected host resolution path " +  args[1] + " but instead found " + successes]);
			}, () => reject([false, "Unable to parse host resolution output " + lines.join(";")]));
		})
	});
};
