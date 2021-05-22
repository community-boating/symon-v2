// args[0]: device to check
const exec = require('child_process').exec;

var okStatuses = {
	"clean": true,
	"clean, checking": true,
	"active": true,
	"active, checking": true,
	"clean, degraded, recovering": true,
	"clean, resyncing (DELAYED)": true,
	"active, resyncing (DELAYED)": true,
	"clean, degraded, resyncing (DELAYED)": true,
}

module.exports = function(args) {
	return new Promise(function(resolve, reject) {
		exec('sudo mdadm --detail ' + args[0] + ' | grep "State :"', function(error, stdout, stderr) {
			const regex = /State : (.*)/
			const result = regex.exec(stdout.trim())
			if (result && result[1]) {
				if (okStatuses[result[1]]) resolve();
				else reject([true, "Found non-clean status '" + result[1] + "' from device " + args[0]])
			} else {
				reject([false, "Unable to get mdadm status for device " + args[0]])
			}
			resolve()
		})
	});
};
