var checks = require('./checks')
var emailer = require('./emailer')
var notify = require("./notify-db")

const testName = process.argv[2];

const CHECK_RESULTS = {
	NORMAL: 1,
	BAD: 2,
	FAIL: 3
}

// test rejections should return [didRun: boolean, errorMessage: string]
// didRun is true if the test ran and failed, false if the test was unable to run
const test = (function() {
	switch(testName) {
	case "gpuTemp":
		return checks.gpuTemp;
	default:
		return () => Promise.reject([false, "Unknown symon2 test " + testName])
	}
}())

test(process.argv.slice(3)).then(() => {
	console.log("ok")
	notify(CHECK_RESULTS.NORMAL);
}, err => {
	console.log("reject " + err)
	notify(err[0] ? CHECK_RESULTS.BAD : CHECK_RESULTS.FAIL);
	emailer.send(err)
})
