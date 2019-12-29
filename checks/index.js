module.exports = {
	gpuTemp : require('./gpu-temp'),
	hdTemp : require('./hd-temp'),
	fileSize: require('./file-size'),
	swap: require('./swap'),
	fileExists: require('./fileExists'),
	dfCheck: require('./dfCheck'),
	mdadmCheck: require("./mdadmCheck"),
	curl: require("./curl"),
	freeMem: require("./freeMem"),
	hdErrors: require("./hdErrors"),
	hpRaidErrors: require("./hp-raid-errors"),
	hpHdTemp: require("./hp-hd-temp"),
	pm2: require("./pm2")
}
