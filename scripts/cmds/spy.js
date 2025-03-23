module.exports = {
  config: {
    name: "spy",
    aliases: ["spy", "myself", "whoami", "myinfo"],
    version: "1.0",
    role: 0,
    author: "MM-RIFAT",
    Description: "Get user information and profile photo",
    category: "information",
    countDown: 10,
  },

  onStart: async function ({
    event,
    message,
    usersData,
    api,
    args,
  }) {
    const uid1 = event.senderID;

    const uid2 = Object.keys(event.mentions)[0];
    let uid;

    // Check if the user passed an argument to specify a different user
    if (args[0]) {
      if (/^\d+$/.test(args[0])) {
        uid = args[0];
      } else {
        const match = args[0].match(/profile\.php\?id=(\d+)/);
        if (match) {
          uid = match[1];
        }
      }
    }

    // If no user ID is provided, use the message sender's ID or the mentioned user's ID
    if (!uid) {
      uid =
        event.type === "message_reply"
          ? event.messageReply.senderID
          : uid2 || uid1;
    }

    // Get user information from the internal usersData system
    const userInfo = await api.getUserInfo(uid);
    const avatarUrl = await usersData.getAvatarUrl(uid);

    let genderText;
    switch (userInfo[uid].gender) {
      case 1:
        genderText = "𝙶𝚒𝚛𝚕🙋🏻‍♀️";
        break;
      case 2:
        genderText = "Boy🙋🏻‍♂️";
        break;
      default:
        genderText = "𝙶𝚊𝚢🤷🏻‍♂️";
    }

    // Get money and rank from the usersData system
    const money = (await usersData.get(uid)).money;
    const allUser = await usersData.getAll(), 
          rank = allUser.slice().sort((a, b) => b.exp - a.exp).findIndex(user => user.userID === uid) + 1, 
          moneyRank = allUser.slice().sort((a, b) => b.money - a.money).findIndex(user => user.userID === uid) + 1;

    const position = userInfo[uid].type;

    // Format the user information for display
    const userInformation = `
╭────[ 𝐔𝐒𝐄𝐑 𝐈𝐍𝐅𝐎 ]
├‣ 𝙽𝚊𝚖𝚎: ${userInfo[uid].name}
├‣ 𝙶𝚎𝚗𝚍𝚎𝚛: ${genderText}
├‣ 𝚄𝙸𝙳: ${uid}
├‣ 𝙲𝚕𝚊𝚜𝚜: ${position ? position?.toUpperCase() : "𝙽𝚘𝚛𝚖𝚊𝚕 𝚄𝚜𝚎𝚛🥺"}
├‣ 𝚄𝚜𝚎𝚛𝚗𝚊𝚖𝚎: ${userInfo[uid].vanity ? userInfo[uid].vanity : "𝙽𝚘𝚗𝚎"}
├‣ 𝙿𝚛𝚘𝚏𝚒𝚕𝚎 𝚄𝚁𝙻: ${userInfo[uid].profileUrl}
├‣ 𝙱𝚒𝚛𝚝𝚑𝚍𝚊𝚢: ${userInfo[uid].isBirthday !== false ? userInfo[uid].isBirthday : "𝙿𝚛𝚒𝚟𝚊𝚝𝚎"}
├‣ 𝙽𝚒𝚌𝚔𝙽𝚊𝚖𝚎: ${userInfo[uid].alternateName || "𝙽𝚘𝚗𝚎"}
╰‣ 𝙵𝚛𝚒𝚎𝚗𝚍 𝚠𝚒𝚝𝚑 𝚋𝚘𝚝: ${userInfo[uid].isFriend ? "𝚈𝚎𝚜✅" : "𝙽𝚘❎"}

╭─────[ 𝐔𝐒𝐄𝐑 𝐒𝐓𝐀𝐓𝐒 ]
├‣ 𝙼𝚘𝚗𝚎𝚢: $${formatMoney(money)}
├‣ 𝚁𝚊𝚗𝚔: #${rank}/${allUser.length}
├‣ 𝙼𝚘𝚗𝚎𝚢 𝚁𝚊𝚗𝚔: #${moneyRank}/${allUser.length}
★ Api Owner : Mueid Mursalin Rifat`;

    // Reply with the user information and avatar image
    message.reply({
      body: userInformation,
      attachment: await global.utils.getStreamFromURL(avatarUrl),
    });
  },
};

// Utility function to format money values
function formatMoney(num) {
  const units = ["", "K", "M", "B", "T", "Q", "Qi", "Sx", "Sp", "Oc", "N", "D"];
  let unit = 0;
  while (num >= 1000 && ++unit < units.length) num /= 1000;
  return num.toFixed(1).replace(/\.0$/, "") + units[unit];
}
