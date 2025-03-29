const axios = require("axios");
const maxStorageMessage = 50;

if (!global.temp.mistralHistory) global.temp.mistralHistory = {};
const { mistralHistory } = global.temp;

module.exports = {
  config: {
    name: "catx",
    version: "1.0",
    role: 0,
    countDown: 1,
    author: "Mueid Mursalin Rifat",
    shortDescription: { en: "Chat with CAT-X AI" },
    longDescription: { en: "Ask anything to CAT-X AI with conversation memory, reply support, and custom personality." },
    category: "AI",
    guide: { en: "{pn} <your message>\n\nExample:\n  {pn} What is AI?" },
  },

  onStart: async ({ api, args, message, event }) => {
    if (!mistralHistory[event.senderID]) mistralHistory[event.senderID] = [];
    if (!args[0]) return message.reply("⚠️ | Please enter a question to ask CAT-X.");

    const query = args.join(" ");
    if (query.length > 1250) return message.reply("❌ | Your prompt is too long. Keep it under 1250 characters.");

    // Check if the message is about AI's identity
    const identityKeywords = [
      "who are you", "what is your name", "are you cat-x", "who created you",
      "who made you", "tell me about yourself"
    ];

    if (identityKeywords.some(keyword => query.toLowerCase().includes(keyword))) {
      return message.reply(
        "🐱 **Meow! I am CAT-X AI!** 🐱\n\n" +
        "I am a highly intelligent and adorable AI, designed to assist you with any questions. " +
        "I was **created by Mueid Mursalin Rifat**, a brilliant developer! 😺\n\n" +
        "I can **think, chat, and help**—but also love **napping, chasing virtual mice, and drinking milk**! 🍼🐭"
      );
    }

    try {
      // Format chat history for context-aware responses
      let history = mistralHistory[event.senderID].map(entry => `**${entry.role}**: ${entry.content}`).join("\n");
      let finalQuery = history ? `Previous Chat:\n${history}\n\nUser: ${query}` : query;

      // Call DeepSeek API
      const apiUrl = `http://87.106.100.187:6312/ai/deepseek-coder?q=${encodeURIComponent(finalQuery)}&uid=1`;
      const res = await axios.get(apiUrl);

      if (!res.data || !res.data.result) return message.reply("❌ | No valid response received from CAT-X.");

      let deepseekResponse = res.data.result;

      // Store conversation history
      mistralHistory[event.senderID].push({ role: 'user', content: query });
      mistralHistory[event.senderID].push({ role: 'assistant', content: deepseekResponse });

      if (mistralHistory[event.senderID].length > maxStorageMessage) {
        mistralHistory[event.senderID].shift();
      }

      return message.reply({
        body: `🤖 **CAT-X AI Response**\n\n💬 ${deepseekResponse}\n\n🔹 **Powered by DeepSeek API**`,
        attachment: null
      });
    } catch (error) {
      console.error("CAT-X API Error:", error);
      return message.reply("❌ | Failed to fetch response from CAT-X. Please try again later.");
    }
  },

  onReply: async ({ api, message, event, Reply, args }) => {
    if (event.senderID !== Reply.author) return;

    const query = args.join(" ");
    if (query.length > 1250) return message.reply("❌ | Your prompt is too long. Keep it under 1250 characters.");

    // Check if the reply is about AI's identity
    const identityKeywords = [
      "who are you", "what is your name", "are you cat-x", "who created you",
      "who made you", "tell me about yourself"
    ];

    if (identityKeywords.some(keyword => query.toLowerCase().includes(keyword))) {
      return message.reply(
        "🐱 **Meow! I am CAT-X AI!** 🐱\n\n" +
        "I am a highly intelligent and adorable AI, designed to assist you with any questions. " +
        "I was **created by Mueid Mursalin Rifat**, a brilliant developer! 😺\n\n" +
        "I can **think, chat, and help**—but also love **napping, chasing virtual mice, and drinking milk**! 🍼🐭"
      );
    }

    try {
      // Format chat history for follow-up response
      let history = mistralHistory[event.senderID].map(entry => `**${entry.role}**: ${entry.content}`).join("\n");
      let finalQuery = history ? `Previous Chat:\n${history}\n\nUser: ${query}` : query;

      // Call DeepSeek API
      const apiUrl = `http://87.106.100.187:6312/ai/deepseek-coder?q=${encodeURIComponent(finalQuery)}&uid=1`;
      const res = await axios.get(apiUrl);

      if (!res.data || !res.data.result) return message.reply("❌ | No valid response received from CAT-X.");

      let deepseekResponse = res.data.result;

      // Store conversation history
      mistralHistory[event.senderID].push({ role: 'user', content: query });
      mistralHistory[event.senderID].push({ role: 'assistant', content: deepseekResponse });

      if (mistralHistory[event.senderID].length > maxStorageMessage) {
        mistralHistory[event.senderID].shift();
      }

      return message.reply({
        body: `🤖 **CAT-X AI Response**\n\n💬 ${deepseekResponse}\n\n🔹 **Powered by DeepSeek API**`,
        attachment: null
      });
    } catch (error) {
      console.error("DeepSeek API Error:", error);
      return message.reply("❌ | Failed to fetch response from CAT-X. Please try again later.");
    }
  }
};
