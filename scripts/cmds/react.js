module.exports = {
    config: {
        name: "autoreact",
		      version: "1.0",
	       	author: "Rifat",
		      countDown: 5,
	       	role: 0,
		      shortDescription: "",
	       	longDescription: "",
		       category: "React ",
    },
	onStart: async function (){},
	onChat: async function ({ event ,api}) {
		if (event.body.toLowerCase().indexOf("love") !== -1) return api.setMessageReaction("💗", event.messageID,event.threadID)
		
		if (event.body.toLowerCase().indexOf("good night") !== -1) return api.setMessageReaction("💗", event.messageID,event.threadID)
		
		if (event.body.toLowerCase().indexOf("good morning") !== -1) return api.setMessageReaction("💖", event.messageID,event.threadID)
		
		if (event.body.toLowerCase().indexOf("fuck") !== -1) return api.setMessageReaction("🤬", event.messageID,event.threadID)
		
		if (event.body.toLowerCase().indexOf("nice") !== -1) return api.setMessageReaction("💗", event.messageID,event.threadID)
		
		if (event.body.toLowerCase().indexOf("beautiful") !== -1) return api.setMessageReaction("💗", event.messageID,event.threadID)
		
		if (event.body.toLowerCase().indexOf("sad") !== -1) return api.setMessageReaction("😢", event.messageID,event.threadID)
		
		if (event.body.toLowerCase().indexOf("wtf") !== -1) return api.setMessageReaction("😆", event.messageID,event.threadID)
		
		if (event.body.toLowerCase().indexOf("bad") !== -1) return api.setMessageReaction("😆", event.messageID,event.threadID)
		
		if (event.body.toLowerCase().indexOf("what") !== -1) return api.setMessageReaction("🙂", event.messageID,event.threadID)
    
   	if (event.body.toLowerCase().indexOf("fck") !== -1) return api.setMessageReaction("😡", event.messageID,event.threadID)

    if (event.body.toLowerCase().indexOf("bot") !== -1) return api.setMessageReaction("❤", event.messageID,event.threadID)

		if (event.body.toLowerCase().indexOf("fine") !== -1) return api.setMessageReaction("❤", event.messageID,event.threadID)

		if (event.body.toLowerCase().indexOf("rifat") !== -1) return api.setMessageReaction("🙂", event.messageID,event.threadID)
}
};