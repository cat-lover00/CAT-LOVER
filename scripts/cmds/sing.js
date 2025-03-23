const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "sing",
    aliases: ["song", "spotify"],
    version: "2.0",
    author: "MM-RIFAT",
    category: "music",
    guide: "{pn} <song name>"
  },

  onStart: async function ({ message, args, api, event }) {
    if (!args.length) return message.reply("Please provide a song name.");

    const query = args.join(" ");
    api.setMessageReaction("🎵", event.messageID, (err) => {}, true);

    try {
      // **1️⃣ Search on Spotify API**
      const spotifyRes = await axios.get(`https://spotify-play-iota.vercel.app/spotify?query=${encodeURIComponent(query)}`);
      if (!spotifyRes.data.trackURLs.length) return message.reply("No song found on Spotify.");

      const trackURL = spotifyRes.data.trackURLs[0]; // First track

      // **2️⃣ Get Download Link**
      const downloadRes = await axios.get(`https://sp-dl-bice.vercel.app/spotify?id=${encodeURIComponent(trackURL)}`);
      if (!downloadRes.data.download_link) return message.reply("Failed to fetch the song.");

      const downloadURL = downloadRes.data.download_link;

      // **3️⃣ Download & Send**
      await sendSong(api, event, downloadURL);
      
    } catch (error) {
      console.error(error);
      message.reply("Error fetching or playing the song.");
    }
  }
};

async function sendSong(api, event, url) {
  const audioPath = path.join(__dirname, "song.mp3");
  const writer = fs.createWriteStream(audioPath);
  const response = await axios.get(url, { responseType: "stream" });

  response.data.pipe(writer);
  writer.on("finish", () => {
    api.sendMessage({
      body: `🎶 Here is your song.\n\n🔹 **API Owner**: Mueid Mursalin Rifat`,
      attachment: fs.createReadStream(audioPath)
    }, event.threadID);
  });
}
