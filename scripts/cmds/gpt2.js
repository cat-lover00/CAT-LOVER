const axios = require("axios");

module.exports = {
	config: {
		name: "gpt2",
		version: "1.2",
		author: "MM-RIFAT",
		countDown: 5,
		role: 0,
		shortDescription: "Chat with GPT-4o",
		longDescription: {
			en: "Ask anything to GPT-4o AI."
		},
		category: "ai",
		guide: {
			en: "{pn} <your message>\n\nExample:\n  {pn} What is AI?"
		}
	},

	onStart: async function ({ args, message }) {
		if (!args.length) return message.reply("⚠️ | Please enter a question to ask GPT.");

		const query = args.join(" ");
		const apiUrl = `https://free-unoficial-gpt4o-mini-api-g70n.onrender.com/chat/?query=${encodeURIComponent(query)}`;

		try {
			const res = await axios.get(apiUrl);
			if (!res.data.results) return message.reply("❌ | No response received from GPT.");

			const gptResponse = res.data.results;

			const replyMessage = `🤖 **GPT-4o Response** 🤖\n\n` +
				`💬 **${gptResponse}**\n\n` +
				`👤 **Author:** MM-RIFAT`;

			return message.reply(replyMessage);
		} catch (error) {
			console.error(error);
			return message.reply("❌ | Failed to fetch response from GPT. Please try again.");
		}
	}
};
