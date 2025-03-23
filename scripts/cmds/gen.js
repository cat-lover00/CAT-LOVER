const axios = require('axios');
const path = require('path');
const fs = require('fs-extra');

module.exports = {
  config: {
    name: "gen",
    aliases: ["imagine"],
    version: "1.0",
    author: "MM-RIFAT",
    countDown: 50,
    role: 0,
    longDescription: {
      vi: '',
      en: "Generate images"
    },
    category: "ai",
    guide: {
      vi: '',
      en: "{pn} <prompt>"
    }
  },

  onStart: async function ({ api, commandName, event, args }) {
    try {
      api.setMessageReaction("✅", event.messageID, (a) => {}, true);
      const prompt = args.join(' ');

      if (!prompt) {
        return api.sendMessage("Please provide a prompt for generating the image.", event.threadID, event.messageID);
      }

      // Send a message saying "Please wait, generating your image..."
      const generatingMessage = await api.sendMessage("Please wait, generating your image...", event.threadID, event.messageID);

      // Make API call to Zetsu API
      const response = await axios.get(`https://api.zetsu.xyz/api/dalle-3?prompt=${encodeURIComponent(prompt)}`);

      if (response.data && response.data.image) {
        const imageUrl = response.data.image;

        // Fetch the image data
        const imgResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const imgPath = path.join(__dirname, 'cache', 'zetsu_image.jpg');
        await fs.outputFile(imgPath, imgResponse.data);
        const imgData = fs.createReadStream(imgPath);

        // Send the generated image
        await api.sendMessage({ body: '', attachment: imgData }, event.threadID, generatingMessage.messageID);
      } else {
        api.sendMessage("Error generating image. Please try again later.", event.threadID, event.messageID);
      }
    } catch (error) {
      console.error("Error:", error);
      api.sendMessage("Error generating image. Please try again later.", event.threadID, event.messageID);
    }
  }
};
