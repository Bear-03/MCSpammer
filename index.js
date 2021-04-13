const fs = require("fs");
const path = require("path");

const mineflayer = require("mineflayer");
const config = require("./config.json");
const spamFilePath = path.resolve(__dirname, `${config.spammer.spamFileFolder}/${config.mc.ip}.txt`);
const spamFile = fs.readFileSync(spamFilePath, "utf8").replace(/\r\n/g,"\n").split("\n");

let date = (new Date()).toISOString().split("T").join("-").replace(/:/g, "-");
date = date.substr(0, date.length - 5);

let msgCount = 0;
let spamInterval;
let initialHealth;

const bot = mineflayer.createBot({
	host: config.mc.ip,
	port: config.mc.port,
	username: config.account.email,
	password: config.account.pass,
	version: config.mc.version
});

function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min) ) + min;
}

function removeOldLogs() {
	fs.readdir(config.spammer.logsFolder, (error, files) => {
		if (error) console.error(`Could not read directory (${config.spammer.logsFolder}): ${error}`);

		for (let i = 0; i <= files.length - config.spammer.maxLogFiles; i++) {
			fs.unlink(`${config.spammer.logsFolder}/${files[i]}`, (err) => {
				if (err) console.log(`Could not remove file (${files[i]}): ${err}`);
			});
		}
	});
}

function writeToLog(msg) {
	fs.appendFile(`${config.spammer.logsFolder}/${bot.username}-${date}.log`, `${msg}${msg ? "\n" : ""}`, (error) => {
		if (error) console.error(`Could not open file (${config.spammer.logsFolder}): ${error}`);
	});
	console.log(msg);
}

bot.on("message", async (msg) => {
	let finalMsg = msg.toString();
	//Initial message
	if(finalMsg.trim() === "") {
		finalMsg = "";
		removeOldLogs();
	}
	else {
		let time = (new Date()).toISOString().split("T")[1];
		time = time.substr(0, time.length - 5);

		if (msg.toString().startsWith(`<${bot.username}>`)) finalMsg = `(${msgCount}) - ${finalMsg}`;
		finalMsg = `[${time}] ${finalMsg}`;
	}

	writeToLog(finalMsg);
});

bot.on("spawn", () => {
	console.log(`User: ${bot.username}\nServer: ${config.mc.ip}\nDelay: ${config.spammer.delay}s\n`);

	function spamFunction() {
		// Randomness to let
		setTimeout(() => {
			bot.chat(spamFile[randomInt(0, spamFile.length)]);
			if (msgCount >= config.spammer.limit - 1) {
				bot.quit();
				writeToLog(`${config.spammer.limit} chat messages reached. Stopping spammer.`);
				clearInterval(spamInterval);
				return;
			}
			msgCount++;
		}, randomInt(0, config.spammer.randomness));
	}

	if (config.spammer.spamOnJoin) spamFunction();
	spamInterval = setInterval(spamFunction, config.spammer.delay * 1000);
});

bot.on("health", () => {
	if (initialHealth) {
		// Health has decreased and is below the threshold.
		if (bot.health <= config.spammer.disconnectThreshold && bot.health <= initialHealth) {
			bot.quit();
			writeToLog(`Health below threshold: ${bot.health}`);
			clearInterval(spamInterval);
			return;
		}
	} else {
		initialHealth = Math.round(bot.health);
		writeToLog(`Health: ${initialHealth}`);
	}
});

bot.on("kicked", (reason, loggedIn) => {
	console.log(reason, loggedIn);
	console.log(reason.text);
});

bot.on("error", (err) => console.log(err));
