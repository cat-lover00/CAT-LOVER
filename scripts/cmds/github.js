const moment = require("moment");
const fetch = require("node-fetch");
const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "github",
    author: "MM-RIFAT",  // Updated author name
    countdown: 5,
    role: 0,
    category: "info",
    shortDescription: {
      en: "Get information about a GitHub user"
    },
  },

  onStart: async function ({ api, event, args }) {
    if (!args[0]) {
      return api.sendMessage("🚨 Please provide a GitHub username! Example: `github <username>`", event.threadID, event.messageID);
    }

    fetch(`https://api.github.com/users/${encodeURI(args.join(" "))}`)
      .then((res) => res.json())
      .then(async (body) => {
        if (body.message) {
          return api.sendMessage("⚠️ User not found. Please provide a valid GitHub username! 🙇‍♂️", event.threadID, event.messageID);
        }

        const { login, avatar_url, name, id, html_url, public_repos, followers, following, location, created_at, bio } = body;

        const info = `>> ${login}'s GitHub Info <<\n\n` +
                     `🔹 **Username**: ${login}\n` +
                     `🔹 **ID**: ${id}\n` +
                     `🔹 **Bio**: ${bio || "No Bio"}\n` +
                     `🔹 **Public Repositories**: ${public_repos || "None"}\n` +
                     `🔹 **Followers**: ${followers}\n` +
                     `🔹 **Following**: ${following}\n` +
                     `🔹 **Location**: ${location || "No Location"}\n` +
                     `🔹 **Account Created**: ${moment.utc(created_at).format("dddd, MMMM Do YYYY")}\n` +
                     `🔹 **GitHub Profile**: ${html_url}\n` +
                     `\nAvatar Image:`;

        try {
          // Download and save avatar image
          const imageBuffer = await axios.get(avatar_url, { responseType: "arraybuffer" }).then((res) => res.data);
          fs.writeFileSync(__dirname + "/cache/avatargithub.png", Buffer.from(imageBuffer, "utf-8"));

          // Send information along with the avatar
          api.sendMessage(
            {
              attachment: fs.createReadStream(__dirname + "/cache/avatargithub.png"),
              body: info,
            },
            event.threadID,
            () => fs.unlinkSync(__dirname + "/cache/avatargithub.png")
          );
        } catch (error) {
          console.error(error);
          api.sendMessage("⚠️ An error occurred while fetching the avatar image. Please try again later. 😓", event.threadID, event.messageID);
        }
      })
      .catch((err) => {
        console.error(err);
        api.sendMessage("❌ Oops! There was an error fetching the GitHub information. Please try again later. 😔", event.threadID, event.messageID);
      });
  },
};
