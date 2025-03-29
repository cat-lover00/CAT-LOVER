const moment = require("moment");
const axios = require("axios");
const fs = require("fs-extra");

const proxyAPIs = [
  "https://proxylist.geonode.com/api/proxy-list?limit=10&page=1&sort_by=lastChecked&sort_type=desc",
  "https://www.proxy-list.download/api/v1/get?type=http",
  "https://api.proxyscrape.com/v2/?request=getproxies&protocol=http&timeout=1000&country=all"
];

const userAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36"
];

async function getProxies() {
  let proxyList = [];
  for (const api of proxyAPIs) {
    try {
      const response = await axios.get(api);
      if (api.includes("geonode")) {
        proxyList.push(...response.data.data.map(p => `http://${p.ip}:${p.port}`));
      } else {
        proxyList.push(...response.data.split("\n").filter(p => p.trim()));
      }
    } catch (error) {
      console.log(`⚠️ Failed to fetch proxies from ${api}: ${error.message}`);
    }
  }
  return proxyList.length ? proxyList : null;
}

async function fetchGitHubUser(username, proxies) {
  for (const proxyUrl of proxies) {
    try {
      const proxyParts = proxyUrl.replace("http://", "").split(":");
      const response = await axios.get(`https://api.github.com/users/${username}`, {
        proxy: { host: proxyParts[0], port: parseInt(proxyParts[1]) },
        headers: { "User-Agent": userAgents[Math.floor(Math.random() * userAgents.length)] },
        timeout: 5000
      });

      return response.data;
    } catch (error) {
      console.log(`⛔ Proxy failed: ${proxyUrl}`);
    }
  }
  return null;
}

module.exports = {
  config: {
    name: "github",
    author: "MM-RIFAT",
    countdown: 3,
    role: 0,
    category: "info",
    shortDescription: { en: "Fast GitHub user lookup with multiple proxies." }
  },

  onStart: async function ({ api, event, args }) {
    if (!args[0]) {
      return api.sendMessage("🚨 Please provide a GitHub username! Example: `github <username>`", event.threadID, event.messageID);
    }

    const username = args[0].trim();
    const proxies = await getProxies();

    if (!proxies) {
      return api.sendMessage("⚠️ No working proxies found. Please try again later.", event.threadID, event.messageID);
    }

    const userData = await fetchGitHubUser(username, proxies);

    if (!userData) {
      return api.sendMessage("❌ Unable to fetch GitHub user details. Try again later.", event.threadID, event.messageID);
    }

    const { login, avatar_url, id, html_url, public_repos, followers, following, location, created_at, bio } = userData;

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
                 `\nAvatar Image:\n\n` +
                 `💻 **Cmd Developer: MM-RIFAT**`;

    try {
      const imageBuffer = await axios.get(avatar_url, { responseType: "arraybuffer" });
      const imagePath = __dirname + "/cache/avatargithub.png";
      fs.writeFileSync(imagePath, Buffer.from(imageBuffer.data, "utf-8"));

      api.sendMessage(
        { attachment: fs.createReadStream(imagePath), body: info },
        event.threadID,
        () => fs.unlinkSync(imagePath)
      );

    } catch (error) {
      console.error("Image Download Error:", error.message);
      api.sendMessage(info, event.threadID);
    }
  },
};
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
