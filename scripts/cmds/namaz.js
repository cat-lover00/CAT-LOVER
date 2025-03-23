const axios = require("axios");

module.exports.config = {
    name: "namaz",
    aliases: ["prayer"],
    version: "1.0",
    credits: "Mueid Mursalin Rifat",
    usePrefix: true,
    cooldowns: 5,
    role: 0,
    description: "View Prayer time with full details",
    category: "islam",
    usages: "{pn} <city name> <country name>",
};

module.exports.onStart = async function ({ api, args, event }) {
    try {
        const cityName = args[0]; // First argument is the city
        const countryName = args.slice(1).join(" "); // The rest is the country name

        if (!cityName || !countryName) {
            return api.sendMessage("❌ Please provide both city and country names.", event.threadID);
        }

        const apiUrl = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(cityName)}&country=${encodeURIComponent(countryName)}&method=2`;
        const response = await axios.get(apiUrl);

        const { 
            Fajr, 
            Sunrise, 
            Dhuhr, 
            Asr, 
            Maghrib, 
            Isha, 
            Imsak, 
            Midnight, 
            Firstthird, 
            Lastthird 
        } = response.data.data.timings;

        const date = response.data.data.date;
        const meta = response.data.data.meta;

        const prayerTimes = 
            "🕋🌙 𝙿𝚛𝚊𝚢𝚎𝚛 𝚝𝚒𝚖𝚎𝚜 🕋🌙\n" +
            "🏙️ 𝙲𝚒𝚝𝚢: " + cityName + "\n" +
            "🌍 𝙲𝚘𝚞𝚗𝚝𝚛𝚢: " + countryName + "\n" +
            "📅 𝙳𝚊𝚝𝚎: " + date.gregorian.date + " (" + date.gregorian.weekday.en + ")\n" +
            "📆 𝙼𝚘𝚗𝚝𝚑: " + date.gregorian.month.en + "\n" +
            "📅 𝙷𝚒𝚓𝚛𝚒 𝙳𝚊𝚝𝚎: " + date.hijri.date + " (" + date.hijri.month.en + ")\n\n" +
            "🕌 𝙵𝚊𝚓𝚛: " + Fajr + "\n" +
            "🕌 𝚂𝚞𝚗𝚛𝚒𝚜𝚎: " + Sunrise + "\n" +
            "🕌 𝙳𝚑𝚞𝚛: " + Dhuhr + "\n" +
            "🕌 𝙰𝚜𝚛: " + Asr + "\n" +
            "🕌 𝙼𝚊𝚐𝚑𝚛𝚒𝚋: " + Maghrib + "\n" +
            "🕌 𝙸𝚜𝚑𝚊: " + Isha + "\n" +
            "🕌 𝙸𝚖𝚜𝚊𝚔: " + Imsak + "\n" +
            "🕌 𝙼𝚒𝚍𝚗𝚒𝚐𝚑𝚝: " + Midnight + "\n" +
            "🕌 𝙵𝚒𝚛𝚜𝚝 𝚃𝚑𝚒𝚛𝚍: " + Firstthird + "\n" +
            "🕌 𝙻𝚊𝚜𝚝 𝚃𝚑𝚒𝚛𝚍: " + Lastthird + "\n\n" +
            "📍 𝙻𝚘𝚌𝚊𝚝𝚒𝚘𝚗: " + meta.latitude + ", " + meta.longitude + "\n" +
            "🕰️ 𝚃𝚒𝚖𝚎𝚣𝚘𝚗𝚎: " + meta.timezone + "\n" +
            "📝 𝙼𝚎𝚝𝚑𝚘𝚍: " + meta.method.name + "\n" +
            "🌍 𝙻𝚘𝚌𝚊𝚝𝚒𝚘𝚗 𝚈𝚘𝚞𝚛 𝚙𝚛𝚊𝚢𝚎𝚛 𝚝𝚒𝚖𝚎𝚜 𝚊𝚛𝚎 𝚍𝚎𝚙𝚎𝚗𝚍𝚎𝚗𝚝 𝚘𝚗.\n\n" +
            "🔧 API Owner: Mueid Mursalin Rifat";

        api.sendMessage(prayerTimes, event.threadID);
    } catch (e) {
        console.error(e);
        api.sendMessage(`❌ Error: ${e.message}`, event.threadID);
    }
};
