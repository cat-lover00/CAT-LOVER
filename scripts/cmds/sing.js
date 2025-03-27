const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "sing",
    aliases: ["song", "soundcloud"],
    version: "1.1",
    author: "MM-RIFAT",
    category: "music",
    guide: "{pn} <song name>"
  },

  onStart: async function ({ message, args, api, event }) {
    if (!args.length) return message.reply("❌ | Please provide a song name.");

    const query = args.join(" ");
    api.setMessageReaction("🎵", event.messageID, (err) => {}, true);

    try {
      // **1️⃣ Get Download Link**
      const downloadURL = `https://haji-mix.up.railway.app/api/soundcloud?title=${encodeURIComponent(query)}`;
      const audioPath = path.join(__dirname, "song.mp3");

      // **2️⃣ Download Audio File**
      const writer = fs.createWriteStream(audioPath);
      const audioStream = await axios.get(downloadURL, { responseType: "stream" });

      audioStream.data.pipe(writer);
      writer.on("finish", () => {
        // **3️⃣ Send the Song with Name**
        api.sendMessage({
          body: `🎶 Here is your song!\n\n🔹 **Song Name**: ${query}\n🔹 **API Owner**: Mueid Mursalin Rifat`,
          attachment: fs.createReadStream(audioPath)
        }, event.threadID);
      });

    } catch (error) {
      console.error(error);
      message.reply("❌ | An error occurred while fetching the song.");
    }
  }
};
