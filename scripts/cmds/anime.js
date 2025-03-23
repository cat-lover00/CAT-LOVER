const axios = require("axios");

module.exports = {
	config: {
		name: "anime",
		version: "1.1",
		author: "MM-RIFAT",
		countDown: 10,
		role: 0,
		shortDescription: "Get anime details",
		longDescription: {
			en: "Fetch anime details from Animesu."
		},
		category: "anime",
		guide: {
			en: "{pn} <anime_name>\n\nExample:\n  {pn} solo-leveling-season-2"
		}
	},

	onStart: async function ({ args, message }) {
		if (!args[0]) {
			return message.reply("❌ | Please provide an anime name.");
		}

		const animeName = args.join("-").toLowerCase();
		const apiUrl = `https://api.zetsu.xyz/animesu/detail?url=https://animesu.vip/anime/${animeName}`;

		try {
			const res = await axios.get(apiUrl);
			if (!res.data.status || !res.data.result) {
				return message.reply("❌ | No details found for this anime.");
			}

			const anime = res.data.result;
			const latestEpisodes = anime.episodes.slice(0, 3).map(ep => `📺 [${ep.title}](${ep.link})`).join("\n") || "No episodes available.";

			const responseMsg = `🎥 **Anime Details** 🎥\n\n` +
				`📌 **Title:** ${anime.title}\n` +
				`📝 **Synopsis:** ${anime.synopsis || "No synopsis available."}\n` +
				`⭐ **Rating:** ${anime.rating?.value || "N/A"} (${anime.rating?.count || "N/A"} votes)\n` +
				`📅 **Release Season:** ${anime.releaseSeason || "Unknown"}\n` +
				`📺 **Latest Episodes:**\n${latestEpisodes}\n\n` +
				`🎭 **Genres:** ${anime.genres ? anime.genres.join(", ") : "N/A"}\n` +
				`🔗 **Watch Here:** [Click Here](https://animesu.vip/anime/${animeName})\n` +
				`${anime.trailer ? `▶️ **[Watch Trailer](https:${anime.trailer})**` : ""}\n\n` +
				`👤 **Author:** MM-RIFAT`;

			// Send message with anime poster
			return message.reply({
				body: responseMsg,
				attachment: await global.utils.getStreamFromURL(anime.image)
			});
		} catch (error) {
			console.error(error);
			return message.reply("❌ | Failed to fetch anime details. Please try again.");
		}
	}
};
