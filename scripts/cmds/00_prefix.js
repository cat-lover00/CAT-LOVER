module.exports = {
 config: {
	 name: "prefix",
	 version: "1.0",
	 author: "Rifat",
	 countDown: 5,
	 role: 0,
	 shortDescription: "no prefix",
	 longDescription: "no prefix",
	 category: "prefix",
 },

 onStart: async function(){}, 
 onChat: async function({ event, message, getLang }) {
 if (event.body && event.body.toLowerCase() === "prefix") {
 return message.reply({
 body: `
★𝙢𝙮 𝙥𝙧𝙚𝙛𝙞𝙭 𝙞𝙨 [ / ]\n
𝗦𝗢𝗠𝗘 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 𝗧𝗛𝗔𝗧 𝗠𝗔𝗬 𝗛𝗘𝗟𝗣 𝗬𝗢𝗨:
➥ /𝚑𝚎𝚕𝚙 𝚂𝚎𝚎 𝙰𝚕𝚕 𝙲𝚘𝚖𝚖𝚊𝚗𝚍𝚜
➥ /𝚌𝚊𝚕𝚕𝚊𝚍 [𝚖𝚎𝚜𝚜𝚊𝚐𝚎] -> 𝚛𝚎𝚙𝚘𝚛𝚝 𝚊𝚗𝚢 𝚙𝚛𝚘𝚋𝚕𝚎𝚖
➥ /𝚑𝚎𝚕𝚙 [𝚌𝚘𝚖𝚖𝚊𝚗𝚍] -> 𝚒𝚗𝚏𝚘𝚛𝚖𝚊𝚝𝚒𝚘𝚗 𝚊𝚗𝚍 𝚞𝚜𝚊𝚐𝚎 𝚘𝚏 𝚌𝚘𝚖𝚖𝚊𝚗𝚍\n
★CAT-BOT💖😺`
 });
 }
 }
}
