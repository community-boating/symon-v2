var moment = require('moment')

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
	case "hdTemp":
		return checks.hdTemp;
	case "fileSize":
		return checks.fileSize;
	case "swap":
		return checks.swap;
	case "fileExists":
		return checks.fileExists;
	case "backupRan":
		var dir = process.argv[3]
		var now = moment().format("YYYY-M-D")
		var search = dir + "/" + now + ".tar.gz"
		return dir => checks.fileExists([search])
	default:
		return () => Promise.reject([false, "Unknown symon2 test " + testName])
	}
}())



test(process.argv.slice(3)).then(() => {
	console.log("ok")
	notify(testName, CHECK_RESULTS.NORMAL);
}, err => {
	console.log("reject " + err)
	notify(testName, err[0] ? CHECK_RESULTS.BAD : CHECK_RESULTS.FAIL);
	emailer.send(err).catch(() => {
		notify("can-email", CHECK_RESULTS.BAD);
	})
})
