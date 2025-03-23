const fs = require("fs");
const path = require("path");
const approvedPath = path.join(__dirname, "approved.json");

module.exports = {
  config: {
    name: "pending",
    version: "1.0",
    author: "RIFAT",
    countDown: 5,
    role: 2,
    shortDescription: {
      en: "Approve pending groups"
    },
    longDescription: {
      en: "Approve pending groups in spam list or unapproved groups"
    },
    category: "admin"
  },

  langs: {
    en: {
      invaildNumber: "⛔|𝗜𝗻𝘃𝗮𝗹𝗶𝗱 𝗡𝘂𝗺𝗯𝗲𝗿\n━━━━━━━━━━━━━━━\n\n➤ %1 is not a valid number.",
      cancelSuccess: "⛔|𝗖𝗮𝗻𝗰𝗲𝗹 𝗥𝗲𝗾𝘂𝗲𝘀𝘁\n\n➤ Refused %1 thread(s)!",
      approveSuccess: "✅|𝗔𝗽𝗽𝗿𝗼𝘃𝗲𝗱 𝗚𝗿𝗼𝘂𝗽\n\n➤ Approved %1 group(s) successfully.",
      cantGetPendingList: "❌|𝗘𝗿𝗿𝗼𝗿\n\n➤ Unable to retrieve the pending list.",
      returnListPending: "📝|𝗣𝗲𝗻𝗱𝗶𝗻𝗴 𝗟𝗶𝘀𝘁\n\n➤ Total threads pending approval: %1\n\n%2",
      returnListClean: "⛔|𝗡𝗼 𝗗𝗮𝘁𝗮\n━━━━━━━━━━━━━━━\n\n➤ No groups in the pending list."
    }
  },

  onReply: async function({ api, event, Reply, getLang }) {
    if (String(event.senderID) !== String(Reply.author)) return;
    const { body, threadID, messageID } = event;
    let count = 0;

    // Load existing approved threads
    let approvedData = [];
    if (fs.existsSync(approvedPath)) {
      approvedData = JSON.parse(fs.readFileSync(approvedPath, "utf-8"));
    }

    if (isNaN(body) && (body.startsWith("c") || body.startsWith("cancel"))) {
      const indices = body.slice(1).split(/\s+/);
      for (const index of indices) {
        if (isNaN(index) || index <= 0 || index > Reply.pending.length) {
          return api.sendMessage(getLang("invaildNumber", index), threadID, messageID);
        }
        api.removeUserFromGroup(api.getCurrentUserID(), Reply.pending[index - 1].threadID);
        count++;
      }
      return api.sendMessage(getLang("cancelSuccess", count), threadID, messageID);
    } else {
      const indices = body.split(/\s+/);
      for (const index of indices) {
        if (isNaN(index) || index <= 0 || index > Reply.pending.length) {
          return api.sendMessage(getLang("invaildNumber", index), threadID, messageID);
        }
        const approvedThread = Reply.pending[index - 1];
        if (!approvedData.includes(approvedThread.threadID)) {
          approvedData.push(approvedThread.threadID);
        }
        api.sendMessage(
          `✨ 𝗡𝗼𝘁𝗶𝗳𝗶𝗰𝗮𝘁𝗶𝗼𝗻\n\nYour group has been approved by the bot owner.`,
          approvedThread.threadID
        );
        count++;
      }

      // Save updated approved threads to the file
      fs.writeFileSync(approvedPath, JSON.stringify(approvedData, null, 2), "utf-8");

      return api.sendMessage(getLang("approveSuccess", count), threadID, messageID);
    }
  },

  onStart: async function({ api, event, getLang }) {
    const { threadID, messageID } = event;
    let msg = "";
    let index = 1;

    try {
      const spam = await api.getThreadList(100, null, ["OTHER"]) || [];
      const pending = await api.getThreadList(100, null, ["PENDING"]) || [];
      const list = [...spam, ...pending].filter(group => group.isSubscribed && group.isGroup);

      for (const single of list) {
        msg += `╭────────────⟡\n│\n│ℹ️ 𝗡𝗮𝗺𝗲\n│${single.name}\n│\n│🆔 𝗜𝗗\n│${single.threadID}\n│\n╰───────────⟡\n\n`;
      }

      if (list.length > 0) {
        return api.sendMessage(
          getLang("returnListPending", list.length, msg),
          threadID,
          (err, info) => {
            global.GoatBot.onReply.set(info.messageID, {
              commandName: "pending",
              messageID: info.messageID,
              author: event.senderID,
              pending: list
            });
          },
          messageID
        );
      } else {
        return api.sendMessage(getLang("returnListClean"), threadID, messageID);
      }
    } catch (e) {
      return api.sendMessage(getLang("cantGetPendingList"), threadID, messageID);
    }
  }
};
