module.exports = {
		config: {
				name: "noprefixmsg",
				version: "1.0",
				author: "Loid Butter",
				countDown: 1,
				role: 0,
				category: "No Prefix",
		},
		onReply: async function ({ event, message }) {
				const triggerPhrases = ["hi", "hello", "rifat", "bot"];
				if (event.body && triggerPhrases.includes(event.body.toLowerCase())) {
						return () => {
								return message.reply("Hello, there how may I help you today?\n please use /callad {msg} any help, \n or,\n\n use help for more information");
						}
				}
		},

		onStart: async function ({  }) {
		}
};
