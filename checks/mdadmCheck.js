// args[0]: device to check
const exec = require('child_process').exec;

var okStatuses = {
	"clean": true,
	"active": true,
	"clean, degraded, recovering": true
}

module.exports = function(args) {
	return new Promise(function(resolve, reject) {
		exec('sudo mdadm --detail ' + args[0] + ' | grep "State :"', function(error, stdout, stderr) {
			console.log(args[0]);
			console.log(stdout.trim())
			const regex = /State : (.*)/
			const result = regex.exec(stdout.trim())
			if (result && result[1]) {
				if (okStatuses[result[1]]) resolve();
				else reject([true, "Found non-clean status '" + result[1] + "' from device " + args[0]])
			} else {
				reject([false, "Unable to get mdadm status for device " + args[0]])
			}
			console.log(result)
			resolve()
		})
	});
};
