const exec = require('child_process').exec;

module.exports = function(args) {
	return new Promise(function(resolve, reject) {
		exec("sudo cat /var/run/reboot-required > /dev/null 2>&1; echo $?", function(error, stdout, stderr) {
			if (String(stdout).trim() == "0") reject([true, "Reboot required"])
			else resolve();
		})
	});
};
