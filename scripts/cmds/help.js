const fs = require("fs-extra");
const path = require("path");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

module.exports = {
  config: {
    name: "help",
    version: "1.2",
    author: "Rifat",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "View command usage and list all commands directly",
    },
    longDescription: {
      en: "View command usage and list all commands directly",
    },
    category: "info",
    guide: {
      en: "{pn} / help cmdName ",
    },
    priority: 1,
  },

  onStart: async function ({ message, args, event, threadsData, role }) {
    const { threadID } = event;
    const threadData = await threadsData.get(threadID);
    const prefix = getPrefix(threadID);

    if (args.length === 0) {
      const categories = {};
      let msg = "╭─────────💎";

      msg += `\n│ 𝗥𝗜𝗙𝗔𝗧 𝗛𝗘𝗟𝗣 𝗟𝗜𝗦𝗧 ✨\n╰────────────💎`; 

      for (const [name, value] of commands) {
        if (value.config.role > 1 && role < value.config.role) continue;

        const category = value.config.category || "Uncategorized";
        categories[category] = categories[category] || { commands: [] };
        categories[category].commands.push(name);
      }

      Object.keys(categories).forEach((category) => {
        if (category !== "info") {
          msg += `\n╭─────💫『 ${category.toUpperCase()} 』`;

          const names = categories[category].commands.sort();
          
          // Create a side-by-side view of commands (4 per line) with ✨
          for (let i = 0; i < names.length; i += 4) {
            const cmds = names.slice(i, i + 4).map((item) => `⭑ ${item}`).join(" ✨ ");
            msg += `\n│ ${cmds}`;
          }

          msg += `\n╰────────────💫`;
        }
      });

      const totalCommands = commands.size;
      msg += `\n\n╭─────💫[𝗘𝗡𝗝𝗢𝗬]\n│ Total Commands: [${totalCommands}].\n│ Type [${prefix}help <cmdName>] for Usage.\n╰────────────💫`;
      msg += ``;
      msg += `\n╭─────💖\n│ 💻 Developed with Love by 𝙍𝙄𝙁𝘼𝙏 💖\n╰────────────💖`; 

      await message.reply({ body: msg });
    } else {
      const commandName = args[0].toLowerCase();
      const command = commands.get(commandName) || commands.get(aliases.get(commandName));

      if (!command) {
        await message.reply(`🚫 𝗖𝗼𝗺𝗺𝗮𝗻𝗱 "${commandName}" 𝗻𝗼𝘁 𝗳𝗼𝘂𝗻𝗱!`);
      } else {
        const configCommand = command.config;
        const roleText = roleTextToString(configCommand.role);
        const author = configCommand.author || "Unknown";

        const longDescription = configCommand.longDescription ? configCommand.longDescription.en || "No description" : "No description";

        const guideBody = configCommand.guide?.en || "No guide available.";
        const usage = guideBody.replace(/{p}/g, prefix).replace(/{n}/g, configCommand.name);

        const response = `
  ╭───🌟
  │ ✅ **${configCommand.name}** Command
  ├── **INFO**
  │ 📝 **Description**: ${longDescription}
  │ 👑 **Author**: ${author}
  │ ▶️ **Guide**: ${usage}
  ├── **USAGE**
  │ ☢️ **Version**: ${configCommand.version || "1.0"}
  │ ♻ **Role**: ${roleText}
  ╰────────────🌟`;

        await message.reply(response);
      }
    }
  },
};

function roleTextToString(roleText) {
  switch (roleText) {
    case 0:
      return "0 (All users)";
    case 1:
      return "1 (Group administrators)";
    case 2:
      return "2 (Admin bot)";
    default:
      return "Unknown role";
  }
}
