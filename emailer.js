var https = require('https');
var fs = require('fs')
var ini = require('ini');

var config = ini.parse(fs.readFileSync('./private.ini', 'utf-8'))

var generateReqString = function(msg) {
	return {
		personalizations:[{ to: [{ email: "coleji@bc.edu" }] }],
		from: { email: "database@community-boating.org" },
		subject: "SYMON2",
		content: [{ type: "text/plain", value: msg }]
	};
}

var send = function(reqString) {
	reqString = JSON.stringify(reqString)

	// host=api.sendgrid.com
	// path=/v3/mail/send
	var options = {
		hostname: config.sendgrid.host,
		path: config.sendgrid.path,
		method: 'POST',
		headers : {
			"Authorization" : config.sendgrid.authToken,
			"Content-Type" : "application/json; charset=utf-8",
			"Content-Length" : reqString.length,
			"Content-Encoding" : 'utf-8'
		}
	};

	var req = https.request(options, function(res) {
		res.on('data', function(d) {
			console.log(d.toString('utf8'))
		})
	});

	req.on('error', function(e) {
		console.log(e);
	});

	req.write(reqString);
	req.end();
};

module.exports = {
	generateReqString : generateReqString,
	send : send
}
