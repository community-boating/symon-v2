//

const exec = require('child_process').exec;

module.exports = function(args) {
	return new Promise(function(resolve, reject) {
		exec("cat /var/run/reboot-required > /dev/null 2>&1; echo $?", function(error, stdout, stderr) {
			if (stdout == "1") reject([true, "Reboot required"])
			else resolve();
		})
	});
};
