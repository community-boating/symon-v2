const https = require('https');
const fs = require('fs')
const ini = require('ini');
const os = require('os');
const moment = require('moment')
const md5 = require('md5');
const querystring = require('querystring');

const config = ini.parse(fs.readFileSync('./private.ini', 'utf-8'))

const salt = config.notify.salt

const argString = process.argv.slice(3).join("$")

const testName = process.argv[2];

const dateString = moment().format("YYYY-MM-DD-HH")

const mac = (function() {
	// return the first thing that isnt obviously a bullshit address, else return null
	const interfaces = os.networkInterfaces()
	var candidates = [];
	for (var iface in interfaces) {
		var addressObjs = interfaces[iface]
		addressObjs.forEach(o => {
			if (!o.mac) return
			if (o.internal) return
			if (o.mac == "00:00:00:00:00:00") return
			candidates.push(o.mac)
		})
	}
	if (candidates.length > 0) return candidates[0].toUpperCase().replace(/:/g,"-");
	else return null;
}())


function makeHash(resultCode) {
	const input = salt + os.hostname() + "-" + testName + "-" + argString + "-" + resultCode + "-" + mac + "-" + dateString + salt;
	return md5(input).toUpperCase();
};


module.exports = function(resultCode) {
	var postData = querystring.stringify({
		'symon-host': os.hostname(),
		'symon-program': testName,
		'symon-argString': argString,
		'symon-status': resultCode,
		'symon-mac': mac,
		'symon-hash': makeHash(resultCode)
	});

	var options = {
		hostname: config.notify.host,
		port: 443,
		path: config.notify.path,
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': postData.length
		}
	};

	var req = https.request(options, (res) => {
		res.on('data', (d) => {
			console.log(d.toString('utf8'));
		});
	});

	req.on('error', (e) => {
		console.error(e);
	});

	req.write(postData);
	req.end();
}
