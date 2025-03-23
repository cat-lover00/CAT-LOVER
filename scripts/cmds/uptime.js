const os = require("os");

module.exports = {
    config: {
        name: "up",
        aliases: ["uptime", "up"],
        version: "1.0",
        author: "Tas33n",
        countDown: 10,
        role: 0,
        description: {
            en: "Bot Uptime & system statics"
        },
        category: "info",
        guide: {
            en: "{pn} sys"
        }
    },

    onStart: async function ({ message, api, event, threadsData, usersData, globalData, args }) {
        const environment = process.env.DYNO ? "Heroku" : process.env.REPLIT ? "Replit" : process.env.RENDER ? "Render" : process.env.VPS_PROVIDER ? process.env.VPS_PROVIDER : os.hostname().startsWith('web') ? "VPS" : "Local";

        if (args[0] && args[0] === "db") {
            const acc = args[1] || "data-back";
            try {
                await saveJsonToFile(`${process.cwd()}/database/${acc}/threadsData.json`, await threadsData.getAll());
                await saveJsonToFile(`${process.cwd()}/database/${acc}/usersData.json`, await usersData.getAll());
                await saveJsonToFile(`${process.cwd()}/database/${acc}/globalData.json`, await globalData.getAll());
                api.sendMessage("Database information saved.", event.threadID, event.messageID);
            } catch (error) {
                api.sendMessage("❌ An error occurred while saving database information.", event.threadID, event.messageID);
                console.error("Error saving database information:", error);
            }
        } else {

            const uptime = process.uptime();
            const formattedUptime = `${Math.floor(uptime / 3600)}:${String(Math.floor((uptime % 3600) / 60)).padStart(2, '0')}:${String(Math.floor(uptime % 60)).padStart(2, '0')}`;

            try {
                const totalUsers = (await usersData.getAll()).length;
                const totalThreads = (await threadsData.getAll()).length;

                let startTime = Date.now();

                let messageContent = `🟢 Bot has been running for ${formattedUptime}.
- Running On: ${environment}
- Total Users: ${totalUsers}
- Total Groups: ${totalThreads}
- Maintenance: ${global.GoatBot.config.adminOnly.enable ? 'ON 🚫' : 'OFF ✅'}
- isMedia Banned: checking...
- Ping: calculating...`;

                const getFormattedPing = (ping) => {
                    console.log(ping);
                    return ping >= 1000 ? `${(ping / 1000).toFixed(2)}s` : `${ping}ms`;
                };

                try {
                    const attachment = await global.utils.getStreamFromURL("https://i.gifer.com/OSFi.gif", "bal.gif");
                    api.sendMessage({
                        body: messageContent
                            .replace("checking...", 'NO ✅')
                            .replace("calculating...", getFormattedPing(`${Date.now() - startTime}`)),
                        attachment: attachment
                    }, event.threadID);
                } catch (attachmentError) {
                    api.sendMessage({
                        body: messageContent
                            .replace("checking...", 'YES 🚫')
                            .replace("calculating...", getFormattedPing(`${Date.now() - startTime}`))
                    }, event.threadID);
                }

            } catch (error) {
                api.sendMessage("❌ An error occurred.", event.threadID, event.messageID);
                console.error("Error handling command:", error);
            }

        }
    }

		    }
