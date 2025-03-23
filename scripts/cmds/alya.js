const axios = require("axios");

module.exports = {
	config: {
		name: 'alya',
		version: '1.3',
		author: 'MM-RIFAT',
		countDown: 5,
		role: 0,
		shortDescription: 'Alya AI',
		longDescription: {
			en: 'Chat with Alya'
		},
		category: 'ai',
		guide: {
			en: '   {pn} <word>: chat with Alya'
				+ '\n'
				+ '   Example:\n    {pn} hi'
		}
	},

	langs: {
		en: {
			turnedOn: '✅ | Turned on Alya successfully!',
			turnedOff: '✅ | Turned off Alya successfully!',
			chatting: 'Already Chatting with Alya...',
			error: 'What?🙂',
			unknown: 'I am Alya. How can I help you?'
		}
	},

	onStart: async function ({ args, threadsData, message, event, getLang }) {
		if (args[0] === 'on' || args[0] === 'off') {
			await threadsData.set(event.threadID, args[0] === "on", "settings.alya");
			return message.reply(args[0] === "on" ? getLang("turnedOn") : getLang("turnedOff"));
		}
		else if (args[0]) {
			const userMessage = args.join(" ");
			if (userMessage.toLowerCase().includes("who are you")) {
				return message.reply(getLang("unknown"));
			}
			try {
				const responseMessage = await getAlyaResponse(userMessage);
				return message.reply(responseMessage);
			}
			catch (err) {
				console.log(err);
				return message.reply(getLang("error"));
			}
		}
	},

	onChat: async function ({ args, message, threadsData, event, isUserCallCommand, getLang }) {
		if (args.length > 1 && !isUserCallCommand && await threadsData.get(event.threadID, "settings.alya")) {
			const userMessage = args.join(" ").toLowerCase();
			if (userMessage.includes("who are you")) {
				return message.reply(getLang("unknown"));
			}
			try {
				const responseMessage = await getAlyaResponse(args.join(" "));
				return message.reply(responseMessage);
			}
			catch (err) {
				console.log(err);
				return message.reply(getLang("error"));
			}
		}
	}
};

// Fetch response from the new API
async function getAlyaResponse(userMessage) {
	try {
		const res = await axios.get(`https://api.zetsu.xyz/api/blackbox?prompt=your name alya and dont say how can i asist you now my msg=${encodeURIComponent(userMessage)}&uid=1`);
		if (res.data && res.data.status) {
			return res.data.response; // Use "response" instead of "result"
		}
	} catch (error) {
		console.error("Blackbox API error:", error);
	}

	// Fallback to the previous Zetsu API if the Blackbox API fails
	try {
		const fallbackRes = await axios.get(`https://api.zetsu.xyz/api/gf?q=${encodeURIComponent(userMessage)}`);
		if (fallbackRes.data && fallbackRes.data.status) {
			return fallbackRes.data.response; // Use "response" instead of "result"
		}
	} catch (fallbackError) {
		console.error("Fallback API error:", fallbackError);
	}

	throw new Error("Alya is unavailable right now.");
}
