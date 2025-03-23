const axios = require("axios");

async function getAvatarUrls(userIDs) {
    let avatarURLs = [];

    for (let userID of userIDs) {
        try {
            const shortUrl = `https://graph.facebook.com/${userID}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
            const d = await axios.get(shortUrl);
            let url = d.request.res.responseUrl;
            avatarURLs.push(url);
        } catch (error) {
            avatarURLs.push(
                "https://i.ibb.co/qk0bnY8/363492156-824459359287620-3125820102191295474-n-png-nc-cat-1-ccb-1-7-nc-sid-5f2048-nc-eui2-Ae-HIhi-I.png"
            );
        }
    }
    return avatarURLs;
}

module.exports = {
    config: {
        name: "gcimg",
        aliases: ["gcimage", "grpimage"],
        version: "1.0",
        author: "Rifat",
        countDown: 5,
        role: 0,
        description: "𝗚𝗲𝘁 𝗚𝗿𝗼𝘂𝗽 𝗜𝗺𝗮𝗴𝗲",
        category: "image",
        guide: "{pn} --color [color] --bgcolor [color] --admincolor [color] --membercolor [color]",
    },

    onStart: async function ({ args, message }) {
        try {
            let color = "red";
            let bgColor = "https://telegra.ph/file/404fd6686c995d8db9ebf.jpg";
            let adminColor = "yellow";
            let memberColor = "";

            for (let i = 0; i < args.length; i++) {
                switch (args[i]) {
                    case "--color":
                        color = args[i + 1];
                        args.splice(i, 2);
                        break;
                    case "--bgcolor":
                        bgColor = args[i + 1];
                        args.splice(i, 2);
                        break;
                    case "--admincolor":
                        adminColor = args[i + 1];
                        args.splice(i, 2);
                        break;
                    case "--membercolor":
                        memberColor = args[i + 1];
                        args.splice(i, 2);
                        break;
                }
            }

            // Simulated group data (replace with actual group data handling if needed)
            const threadInfo = {
                threadName: "Test Group",
                participantIDs: ["1234567890", "0987654321"],  // Sample user IDs
                adminIDs: ["1234567890"],
                imageSrc: "https://some-image-url.jpg",
            };

            let participantIDs = threadInfo.participantIDs;
            let adminIDs = threadInfo.adminIDs;
            let memberURLs = await getAvatarUrls(participantIDs);
            let adminURLs = await getAvatarUrls(adminIDs);

            const data2 = {
                memberURLs: memberURLs,
                groupPhotoURL: threadInfo.imageSrc,
                adminURLs: adminURLs,
                groupName: threadInfo.threadName,
                bgcolor: bgColor,
                admincolor: adminColor,
                membercolor: memberColor,
                color: color,
            };

            if (data2) {
                message.reply({
                    body: `Please wait while your group image is being created...`,
                });

                // Simulated API request to generate the image (replace with actual API call)
                const generatedImage = await generateGroupImage(data2);

                if (generatedImage) {
                    message.reply({
                        body: `Here is your group image:`,
                        attachment: generatedImage,
                    });
                }
            }
        } catch (error) {
            console.log(error);
            message.reply(`Error: ${error.message}`);
        }
    },
};

// Simulated image generation function (replace with actual logic)
async function generateGroupImage(data) {
    // For example, just return a static image URL as the generated image
    return "https://some-generated-image-url.com/image.jpg";
}