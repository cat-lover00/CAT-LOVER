const axios = require("axios");

module.exports = {
	config: {
		name: "fdetails",
		version: "1.0",
		author: "MM-RIFAT",
		countDown: 5,
		role: 0,
		shortDescription: "Get random user details",
		longDescription: {
			en: "Fetch random user details from RandomUser API."
		},
		category: "fun",
		guide: {
			en: "{pn}\n\nExample:\n  {pn}"
		}
	},

	onStart: async function ({ message }) {
		const apiUrl = "https://randomuser.me/api/";

		try {
			const res = await axios.get(apiUrl);
			if (!res.data.results || res.data.results.length === 0) {
				return message.reply("❌ | Failed to fetch user details.");
			}

			const user = res.data.results[0];

			const responseMsg = `🎭 **Random User Details** 🎭\n\n` +
				`👤 **Name:** ${user.name.title} ${user.name.first} ${user.name.last}\n` +
				`🧑‍⚖️ **Gender:** ${user.gender.charAt(0).toUpperCase() + user.gender.slice(1)}\n` +
				`📅 **Date of Birth:** ${new Date(user.dob.date).toLocaleDateString()} (Age: ${user.dob.age})\n` +
				`📍 **Location:** ${user.location.street.number} ${user.location.street.name}, ${user.location.city}, ${user.location.state}, ${user.location.country} (${user.location.postcode})\n` +
				`⏰ **Timezone:** ${user.location.timezone.description} (GMT ${user.location.timezone.offset})\n` +
				`📧 **Email:** ${user.email}\n` +
				`📞 **Phone:** ${user.phone}\n` +
				`📱 **Cell:** ${user.cell}\n` +
				`🔑 **Username:** ${user.login.username}\n` +
				`🆔 **ID:** ${user.id.name ? `${user.id.name}: ${user.id.value}` : "N/A"}\n\n` +
				`👤 **Nationality:** ${user.nat}\n` +
				`👤 **Author:** MM-RIFAT`;

			// Send message with user profile picture
			return message.reply({
				body: responseMsg,
				attachment: await global.utils.getStreamFromURL(user.picture.large)
			});
		} catch (error) {
			console.error(error);
			return message.reply("❌ | Failed to fetch user details. Please try again.");
		}
	}
};
