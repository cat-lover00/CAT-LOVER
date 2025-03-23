module.exports = {
  config: {
    name: "clear",
    aliases: ["cbox"],
    author: "Rifat",  
    version: "2.0",
    cooldowns: 5,
    role: 1,
    shortDescription: {
      en: ""
    },
    longDescription: {
      en: "unsent all messages sent by bot"
    },
    category: "admin",
    guide: {
      en: "{p}{n}"
    }
  },
  onStart: async function ({ api, event }) {

    const unsendBotMessages = async () => {
      const threadID = event.threadID;


      const botMessages = await api.getThreadHistory(threadID, 100); // Adjust the limit as needed 50 = 50 msg


      const botSentMessages = botMessages.filter(message => message.senderID === api.getCurrentUserID());


      for (const message of botSentMessages) {
        await api.unsendMessage(message.messageID);
      }
    };


    await unsendBotMessages();
  }
};