var gpuTemp = require('./checks').gpuTemp
var emailer = require('./emailer')

const testName = process.argv[2];

switch(testName) {
case "gpuTemp":
	gpuTemp().catch(function(msg) {
		emailer.send(emailer.generateReqString(msg))
	});
	break;
default:
	emailer.send(emailer.generateReqString("Unknown symon2 test " + testName))
}

console.log(process.argv)
