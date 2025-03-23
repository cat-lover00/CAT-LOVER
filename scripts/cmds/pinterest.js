const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "pin",
        aliases: ["pinterest"],
        version: "1.0",
        author: "Mueid Mursalin Rifat", // API Owner
        countDown: 15,
        role: 0,
        shortDescription: "Pinterest Image Search",
        longDescription: "Search for images from Pinterest via scraping.",
        category: "download",
        guide: {
            en: "{pn} query -length",
        },
    },

    onStart: async function ({ api, event, args }) {
        const queryAndLength = args.join(" ").split("-");
        const q = queryAndLength[0].trim();
        const length = queryAndLength[1]?.trim() || 5;  // Default to 5 images if no length provided

        if (!q) {
            return api.sendMessage(
                "❌| Please provide a search query.",
                event.threadID,
                event.messageID,
            );
        }

        try {
            const w = await api.sendMessage("Please wait...", event.threadID);
            const searchUrl = `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(q)}`;

            // Make request to Pinterest search page
            const response = await axios.get(searchUrl);
            const $ = cheerio.load(response.data);

            // Scraping image URLs from Pinterest search results
            const images = [];
            $("img[src]").each((index, element) => {
                const imgUrl = $(element).attr("src");
                if (imgUrl && imgUrl.startsWith("https://")) {
                    images.push(imgUrl);
                }
            });

            // Limit the number of images
            const limitedImages = images.slice(0, length);

            if (limitedImages.length === 0) {
                return api.sendMessage(
                    "No images found for your query.",
                    event.threadID,
                    event.messageID,
                );
            }

            // Download the images and prepare for sending
            const diptoo = [];
            for (let i = 0; i < limitedImages.length; i++) {
                const imgUrl = limitedImages[i];
                const imgResponse = await axios.get(imgUrl, {
                    responseType: "arraybuffer",
                });
                const imgPath = path.join(
                    __dirname,
                    "assets", // Folder for saving images
                    `${i + 1}.jpg`,
                );
                await fs.outputFile(imgPath, imgResponse.data);
                diptoo.push(fs.createReadStream(imgPath));
            }

            await api.unsendMessage(w.messageID);
            await api.sendMessage(
                {
                    body: `
✅ | Here's Your Query-Based Pinterest Images
🐤 | Total Images Count: ${limitedImages.length}`,
                    attachment: diptoo,
                },
                event.threadID,
                event.messageID,
            );
        } catch (error) {
            console.error(error);
            await api.sendMessage(
                `Error: ${error.message}`,
                event.threadID,
                event.messageID,
            );
        }
    },
};
