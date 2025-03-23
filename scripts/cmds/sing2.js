const ytdl = require("ytdl-core");
const ytSearch = require("yt-search");
const { getPrefix } = global.utils;

module.exports = {
  config: {
    name: "sing2",
    aliases: ["Song2"],
    version: "1.0",
    author: "Rifat",
    countDown: 5,
    role: 0,
    description: {
      en: "Play a song from YouTube by name",
    },
    category: "music",
    guide: {
      en: "{pn} <song name>",
    },
  },

  onStart: async function ({ api, args, event }) {
    const prefix = getPrefix(event.threadID);

    if (!args[0]) {
      return api.sendMessage(`🚫 | Please provide a song name. Example: ${prefix}sing Despacito`, event.threadID);
    }

    const songName = args.join(" ");  // Get the full song name from the arguments

    try {
      // Search for the song on YouTube
      const result = await ytSearch(songName);

      if (!result || result.videos.length === 0) {
        return api.sendMessage(`🚫 | No results found for the song: ${songName}`, event.threadID);
      }

      const songURL = result.videos[0].url;  // Take the first result
      const songTitle = result.videos[0].title; // Get the title of the first result

      // Fetch audio stream
      const audioStream = ytdl(songURL, { filter: "audioonly" });

      // Send message with song title
      await api.sendMessage(`🎵 | Now playing: ${songTitle}`, event.threadID);

      // Send the audio stream
      api.sendMessage(
        {
          body: `🎶 Playing song: ${songTitle}`,
          attachment: audioStream,
        },
        event.threadID,
        (error, info) => {
          if (error) {
            console.error("Error sending song:", error);
            api.sendMessage("🚫 | Something went wrong while playing the song. Please try again.", event.threadID);
          }
        }
      );
    } catch (error) {
      console.error(error);
      api.sendMessage("🚫 | Could not fetch the song. Please check the name and try again.", event.threadID);
    }
  },
};
