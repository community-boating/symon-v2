var moment = require('moment')

var checks = require('./checks')

const {nagiosMode, testName} = (function() {
	const raw = process.argv[2];
	if (raw.substr(0, 1) == "*") {
		return {
			nagiosMode: true,
			testName: raw.substr(1)
		};
	} else {
		return {
			nagiosMode: false,
			testName: raw
		}
	}
}());

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
	case "date":
		return checks.date;
	case "hdTemp":
		return checks.hdTemp;
	case "fileSize":
		return checks.fileSize;
	case "swap":
		return checks.swap;
	case "fileExists":
		return checks.fileExists;
	case "dfCheck":
		return checks.dfCheck;
	case "pm2":
		return checks.pm2;
	case "mdadmCheck":
		return checks.mdadmCheck;
	case "hdErrors":
		return checks.hdErrors;
	case "curl":
		return checks.curl;
	case "freeMem":
		return checks.freeMem;
	case "hpRaidErrors":
		return checks.hpRaidErrors;
	case "hpHdTemp":
		return checks.hpHdTemp;
	case "rebootRequired":
		return checks.rebootRequired;
	case "getMyPublicIP":
		return checks.getMyPublicIP;
	case "versionNode":
		return checks.versionNode;
	case "versionJava":
		return checks.versionJava;
	case "versionUbuntu":
		return checks.versionUbuntu;
	case "mountCheck":
		return args => {
			return checks.dfCheck(args)
			.then(() => Promise.resolve())
			.catch(err => {
				if (err[0]) return Promise.resolve();
				else return Promise.reject([true, "Could not find device " + args[0] + " mounted at location " + args[1]])
			})
		}
	case "backupRan":
		return args => {
			var dir = args[0]
			var now = moment().format("YYYY-M-D")
			var search = dir + "/" + now + ".tar.gz"
			return checks.fileExists([search])
		}
	default:
		return () => Promise.reject([false, "Unknown symon2 test " + testName])
	}
}())

if (!nagiosMode) {
	const now = moment().format("YYYY-MM-DD HH:mm:ss")
	console.log("==================")
	console.log(now)
	console.log(`Running ${testName} with args '${process.argv.slice(3).join(" ")}'`)
}

function notify(test, result) {
	var doNotify = require("./notify-db");
	doNotify(test, result);

}

test(process.argv.slice(3)).then(result => {
	if (nagiosMode) {
		if (result) console.log(result);
		process.exit(0);
	} else {
		console.log("ok")
		notify(testName, CHECK_RESULTS.NORMAL);
	}
	
}, err => {
	if (nagiosMode) {
		console.log(err[1]);
		if (err[0]) {
			process.exit(2); // bad
		} else {
			process.exit(3);  // unknown
		}
	} else {
		console.log("reject " + err)
		notify(testName, err[0] ? CHECK_RESULTS.BAD : CHECK_RESULTS.FAIL);
		var emailer = require('./emailer')
		emailer.send(err).catch(() => {
			notify("can-email", CHECK_RESULTS.BAD);
		})
	}
})
