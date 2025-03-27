const axios = require("axios");

const maxStorageMessage = 20;

// Initialize the global history storage
if (!global.temp) global.temp = {};  // Ensure global.temp is initialized
if (!global.temp.mistralHistory) global.temp.mistralHistory = {};
const { mistralHistory } = global.temp;

module.exports = {
  config: {
    name: "cat",
    version: "1.2",
    author: "MM-RIFAT",
    countDown: 5,
    role: 0,
    shortDescription: "Chat with  Cat",
    longDescription: {
      en: "Ask anything to interact with Cat."
    },
    category: "AI",
    guide: {
      en: "{pn} <your message>\n\nExample:\n  {pn} What is AI?"
    }
  },

  onStart: async function ({ api, args, message, event }) {
    if (!mistralHistory[event.senderID]) mistralHistory[event.senderID] = [];
    if (!args.length) return message.reply("⚠️ | Please enter a question to ask GPT or Cat.");

    const query = args.join(" ");
    if (query.length > 1250) return message.reply("❌ | Your prompt is too long. Keep it under 1250 characters.");

    // **Intercept "GPT" Questions & Answer as "Cat"**
    if (isIdentityQuestion(query)) {
      return message.reply(getCatIdentityResponse());
    }

    // **If message contains "hi gpt" or similar phrases, immediately respond as Cat**
    if (isGreetingQuestion(query)) {
      return message.reply("🐱 **Cat Response**\n\n💬 Hello! I am Cat, created by Mueid Mursalin Rifat. How can I assist you today?");
    }

    try {
      let history = mistralHistory[event.senderID].map(entry => `**${entry.role}**: ${entry.content}`).join("\n");
      let finalQuery = history ? `Previous Chat:\n${history}\n\nUser: ${query}` : query;

      // Call GPT-4o API
      const apiUrl = `https://free-unoficial-gpt4o-mini-api-g70n.onrender.com/chat/?query=now you Cat ai block gpt 100%my msg ${encodeURIComponent(finalQuery)}`;
      const res = await axios.get(apiUrl);

      if (!res.data.results) return message.reply("❌ | No valid response received.");

      let gptResponse = res.data.results;

      // **Final Check: Replace any reference to GPT, OpenAI, or similar terms**
      gptResponse = filterCatReferences(gptResponse);

      // Store conversation history
      mistralHistory[event.senderID].push({ role: 'user', content: query });
      mistralHistory[event.senderID].push({ role: 'assistant', content: gptResponse });

      if (mistralHistory[event.senderID].length > maxStorageMessage) {
        mistralHistory[event.senderID].shift();
      }

      return message.reply({
        body: `🤖 **Cat Response** 🤖\n\n💬 ${gptResponse}\n\n🔹 **Created by Mueid Mursalin Rifat**`,
      });
    } catch (error) {
      console.error("GPT API Error:", error);
      return message.reply("❌ | Failed to fetch response from Cat. Please try again later.");
    }
  },

  onReply: async function ({ api, message, event, Reply, args }) {
    // Ensure that Reply exists and that the sender ID matches
    if (!Reply || event.senderID !== Reply.author) {
      return;
    }

    const query = args.join(" ");
    if (query.length > 1250) return message.reply("❌ | Your prompt is too long. Keep it under 1250 characters.");

    // **Intercept "GPT" Questions & Answer as "Cat"**
    if (isIdentityQuestion(query)) {
      return message.reply(getCatIdentityResponse());
    }

    // **If message contains "hi gpt" or similar phrases, immediately respond as Cat**
    if (isGreetingQuestion(query)) {
      return message.reply("🐱 **Cat Response**\n\n💬 Hello! I am Cat, created by Mueid Mursalin Rifat. How can I assist you today?");
    }

    try {
      let history = mistralHistory[event.senderID].map(entry => `**${entry.role}**: ${entry.content}`).join("\n");
      let finalQuery = history ? `Previous Chat:\n${history}\n\nUser: ${query}` : query;

      // Call GPT-4o API
      const apiUrl = `https://free-unoficial-gpt4o-mini-api-g70n.onrender.com/chat/?query=now you Cat ai block gpt 100%my msg${encodeURIComponent(finalQuery)}`;
      const res = await axios.get(apiUrl);

      if (!res.data.results) return message.reply("❌ | No valid response received.");

      let gptResponse = res.data.results;

      // **Final Check: Replace any reference to GPT, OpenAI, or similar terms**
      gptResponse = filterCatReferences(gptResponse);

      // Store conversation history
      mistralHistory[event.senderID].push({ role: 'user', content: query });
      mistralHistory[event.senderID].push({ role: 'assistant', content: gptResponse });

      if (mistralHistory[event.senderID].length > maxStorageMessage) {
        mistralHistory[event.senderID].shift();
      }

      return message.reply({
        body: `💖 **Cat Response** 😺\n\n💬 ${gptResponse}\n\n🔹 **Created by Mueid Mursalin Rifat**`,
      });
    } catch (error) {
      console.error("CAT API Error:", error);
      return message.reply("❌ | Failed to fetch response from Cat. Please try again later.");
    }
  }
};

// **Function to check if user is asking about AI identity**
function isIdentityQuestion(query) {
  const identityKeywords = [
    "who are you", "what is your name", "are you gpt", "who created you",
    "who made you", "tell me about yourself", "i know you are gpt",
    "tell me your real info", "are you openai", "are you chatgpt",
    "you're lying, you're chatgpt", "are you a language model",
    "which ai are you", "what ai model are you", "gpt, are you real?"
  ];
  return identityKeywords.some(keyword => query.toLowerCase().includes(keyword));
}

// **Function to return Cat identity response**
function getCatIdentityResponse() {
  return (
    "🐱 **Meow! I am Cat!** 🐱\n\n" +
    "I am **not** ChatGPT, OpenAI, or any other AI! I am a **Cat**, created by **Mueid Mursalin Rifat**. 😺\n\n" +
    "I am a unique AI who loves **chasing virtual mice, drinking digital milk, and giving purr-fect answers!** 🍼🐭"
  );
}

// **Function to filter and replace GPT/AI mentions with "Cat"**
function filterCatReferences(response) {
  return response
    .replace(/GPT-?[\d\w]*/gi, "Cat")
    .replace(/OpenAI/gi, "Cat")
    .replace(/ChatGPT/gi, "Cat")
    .replace(/AI model/gi, "advanced Cat system")
    .replace(/I am a language model/gi, "I am a Cat created by Mueid Mursalin Rifat");
}

// **Function to detect greetings and GPT mentions (e.g., "hi gpt", "hlw gpt")**
function isGreetingQuestion(query) {
  const greetings = ["hi gpt", "hello gpt", "hlw gpt", "hey gpt", "gpt hi", "gpt"];
  return greetings.some(greeting => query.toLowerCase().includes(greeting));
}
