// args[0]: device to check
const exec = require('child_process').exec;

module.exports = function(args) {
	return new Promise(function(resolve, reject) {
		const maxSwap = Number(args[0])
		exec('mdadm --detail ' + args[0] + ' | grep "State :"', function(error, stdout, stderr) {
			console.log(stdout.trim())
			resolve()
		})
	});
};
