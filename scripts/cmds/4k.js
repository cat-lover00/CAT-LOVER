const axios = require("axios");

module.exports = {
  config: {
    name: "remini",
    aliases: ["4k"],
    version: "1.1",
    role: 0,
    author: "Team Calyx",
    countDown: 5,
    longDescription: "Upscale images to 4K resolution.",
    category: "image",
    guide: {
      en: "${pn} reply to an image to upscale it to 4K resolution."
    }
  },
  onStart: async function ({ message, event }) {
    if (!event.messageReply || !event.messageReply.attachments || !event.messageReply.attachments[0]) {
      return message.reply("Please reply to an image to upscale it.");
    }
    const imgurl = encodeURIComponent(event.messageReply.attachments[0].url);
    const noobs = 'xyz';
    const upscaleUrl = `https://smfahim.onrender.com/4k?url=${imgurl}`;
    
    message.reply("🔄| Processing... Please wait a moment.", async (err, info) => {
      try {
        const { data: { image } } = await axios.get(upscaleUrl);
        const attachment = await global.utils.getStreamFromURL(image, "upscaled-image.png");

        message.reply({
          body: "✅| Here is your 4K upscaled image:",
          attachment: attachment
        });
        let processingMsgID = info.messageID;
        message.unsend(processingMsgID);

      } catch (error) {
        console.error(error);
        message.reply("❌| There was an error upscaling your image.");
      }
    });
  }
};