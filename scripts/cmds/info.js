const moment = require('moment-timezone');

module.exports = {
	config: {
		name: "admininfo",
		aliases: ["info","admininfo","botinfo"],
		version: "1.0",
		author: "Rifat",
		countDown: 10,
		role: 0,
		shortDescription: { vi: "", en: "" },
		longDescription: { vi: "", en: "" },
		category: "info",
		guide: { en: "" },
		envConfig: {}
	},

	onStart: async function ({ message }) {
		try {
			// Bot & Owner Information
			const botName = "CAT😺💖";
			const botPrefix = "/";
			const authorName = "𝘔𝘶𝘦𝘪𝘥 𝘔𝘶𝘳𝘴𝘢𝘭𝘪𝘯 𝘙𝘪𝘧𝘢𝘵";
			const ownAge = "18";
			const teamName = "𝘌𝘻𝘉𝘰";
			const authorFB = "https://www.facebook.com/mueid.mursalin.rifat1";
			const authorInsta = "mueidmursalinrifat";
			const tikTok = "@mmrifat222";
			const status = "ᴀᴄᴛɪᴠᴇ";

			// Time & Uptime
			const now = moment().tz('Asia/Dhaka');
			const date = now.format('MMMM Do YYYY');
			const time = now.format('h:mm:ss A');

			const uptime = process.uptime();
			const days = Math.floor(uptime / (60 * 60 * 24));
			const hours = Math.floor((uptime / (60 * 60)) % 24);
			const minutes = Math.floor((uptime / 60) % 60);
			const seconds = Math.floor(uptime % 60);
			const uptimeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;

			// Reply with Info
			message.reply(`💖 𝑹𝑰𝑭𝑨𝑻 𝑰𝑵𝑭𝑶 💖\n
🤖 Bot Name: ${botName}
👾 Prefix: ${botPrefix}
👤 Owner: ${authorName}
🔰 Age: ${ownAge}
💀 Team: ${teamName}
💫 Facebook: ${authorFB}
📱 Instagram: ${authorInsta}
📳 TikTok: ${tikTok}
🆗 Status: ${status}
⚙️ Date: ${date}
🕰️ Time: ${time}
⏰ Uptime: ${uptimeString}`);
		} catch (error) {
			console.error("Error in 'info' command:", error);
			message.reply("❌ An unexpected error occurred. Please try again later.");
		}
	},

	onChat: async function ({ event, message }) {
		if (event.body && event.body.toLowerCase() === "bot") {
			this.onStart({ message });
		}
	}
};
