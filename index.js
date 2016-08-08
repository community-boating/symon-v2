var gpuTemp = require('./checks').gpuTemp
var emailer = require('./emailer')

gpuTemp().catch(function(msg) {
	emailer.send(emailer.generateReqString(msg))
});
