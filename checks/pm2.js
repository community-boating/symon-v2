// args[0]: pm2 program name

const exec = require('child_process').exec;

module.exports = function(args) {
	return new Promise(function(resolve, reject) {
		exec(`pm2 info ${args[0]} | grep status | awk '{print $4}'`, function(error, stdout, stderr) {
			const out = stdout.trim();
			if (out == "online") resolve();
			else reject([true, `pm2 info on ${args[0]}: "${out}"`]);
		})
	});
};
