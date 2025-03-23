const axios = require('axios');

module.exports = {
  config: {
    name: "ss",
    aliases: ["screenshot"],
    version: "1.0",
    author: "Rifat",
    countDown: 10,
    role: 0,
    longDescription: {
      en: "Capture a screenshot of the provided website URL"
    },
    category: "utility",
    guide: {
      en: "{pn} <website URL>"
    }
  },

  onStart: async function ({ api, event, args }) {
    const url = args.join(" ");
    
    if (!url) {
      return api.sendMessage("Please provide a URL. Example: ss google.com", event.threadID, event.messageID);
    }

    try {
      // Fetch the screenshot from ScreenshotMachine API
      const screenshotUrl = `https://api.screenshotmachine.com/?key=254572&url=${encodeURIComponent(url)}&dimension=1024x768`;

      // Send the screenshot as a response
      api.sendMessage(
        {
          body: `Here is the screenshot of ${url}:`,
          attachment: screenshotUrl
        },
        event.threadID,
        event.messageID
      );
    } catch (error) {
      console.error("Error generating screenshot:", error);
      api.sendMessage("Sorry, there was an error generating the screenshot. Please try again later.", event.threadID, event.messageID);
    }
  }
};
