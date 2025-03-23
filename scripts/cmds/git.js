module.exports = {
  config: {
    name: "git",
aliases: ["github2"]

    version: "1.0",
    role: 0,
    author: "Mueid Mursalin Rifat",
    cooldowns: 5,
    shortdescription: "Fetch GitHub user profile details",
    longdescription: "Fetches GitHub user details including repositories, followers, and more.",
    category: "info",
    usages: "{pn} github (username)",
    dependencies: {
      "axios": "",
    }
  },

  onStart: async ({ api, event }) => {
    const axios = require("axios");

    // Get the GitHub username from the input
    const input = event.body;
    const data = input.split(" ");

    if (data.length < 2) {
      return api.sendMessage("🚨 Please provide a GitHub username. 🚨", event.threadID);
    }

    data.shift();
    const username = data.join(" ");

    try {
      // Fetch GitHub user data using the provided API
      const res = await axios.get(`https://api.popcat.xyz/github/${encodeURIComponent(username)}`);

      const {
        url,
        avatar,
        account_type,
        name,
        company,
        blog,
        location,
        email,
        bio,
        twitter,
        public_repos,
        public_gists,
        followers,
        following,
        created_at,
        updated_at
      } = res.data;

      // Construct the message with GitHub user information
      const message = `
👨‍💻 **GitHub Profile Info** 👨‍💻

❏ **Username**: [${name}](${url})
❏ **Account Type**: ${account_type}
❏ **Company**: ${company}
❏ **Blog**: [${blog}](${blog})
❏ **Location**: ${location || "Not set"}
❏ **Email**: ${email || "None"}
❏ **Bio**: ${bio || "No Bio"}
❏ **Twitter**: ${twitter || "Not set"}

🔢 **Public Repos**: ${public_repos}
📑 **Public Gists**: ${public_gists}
👥 **Followers**: ${followers}
👤 **Following**: ${following}

🗓️ **Account Created**: ${new Date(created_at).toLocaleDateString()}
🗓️ **Last Updated**: ${new Date(updated_at).toLocaleDateString()}

🖼️ **Avatar**: ![Avatar](${avatar})

🔧 **API Powered By**: Mueid Mursalin Rifat ⚙️
      `;

      api.sendMessage(message, event.threadID);

    } catch (error) {
      console.error('[ERROR]', error);
      api.sendMessage("❌ Could not fetch GitHub user details. Please try again later. ❌", event.threadID);
    }
  }
};
