const ytdl = require('ytdl-core');
const instagramScraper = require('instagram-scraper');
const facebookScraper = require('facebook-scraper');
const fs = require('fs');
const axios = require('axios');

module.exports = {
  config: {
    name: 'dl',
    aliases: ['download', 'getvideo'],
    version: '1.0',
    role: 0,
    author: 'Mueid Mursalin Rifat', // API owner added
    Description: 'Download videos from Facebook, Instagram, and YouTube.',
    category: 'utility',
    countDown: 10,
  },

  onStart: async function ({ event, message, api, args }) {
    if (!args[0]) {
      return message.reply('Please provide a video link.');
    }

    const videoUrl = args[0];

    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      // Download YouTube video
      try {
        const stream = ytdl(videoUrl, { quality: 'highestaudio' });
        const fileName = 'video.mp4';
        const fileStream = fs.createWriteStream(fileName);
        stream.pipe(fileStream);

        fileStream.on('finish', () => {
          message.reply('Download complete! Sending video...');
          api.sendMessage({ body: `Here is your YouTube video (API Owner: Mueid Mursalin Rifat):`, attachment: fs.createReadStream(fileName) }, event.threadID, event.messageID);
          fs.unlinkSync(fileName); // Clean up file after sending
        });
      } catch (error) {
        message.reply('Error downloading the YouTube video.');
      }
    } else if (videoUrl.includes('instagram.com')) {
      // Download Instagram video
      try {
        const post = await instagramScraper.scrapePost(videoUrl);
        const videoUrl = post.video_url;
        const videoStream = await axios.get(videoUrl, { responseType: 'stream' });
        
        const fileName = 'instagram_video.mp4';
        const fileStream = fs.createWriteStream(fileName);
        videoStream.data.pipe(fileStream);

        fileStream.on('finish', () => {
          message.reply('Download complete! Sending Instagram video...');
          api.sendMessage({ body: `Here is your Instagram video (API Owner: Mueid Mursalin Rifat):`, attachment: fs.createReadStream(fileName) }, event.threadID, event.messageID);
          fs.unlinkSync(fileName); // Clean up file after sending
        });
      } catch (error) {
        message.reply('Error downloading the Instagram video.');
      }
    } else if (videoUrl.includes('facebook.com')) {
      // Download Facebook video
      try {
        const video = await facebookScraper.getVideoUrl(videoUrl);
        const videoStream = await axios.get(video.url, { responseType: 'stream' });

        const fileName = 'facebook_video.mp4';
        const fileStream = fs.createWriteStream(fileName);
        videoStream.data.pipe(fileStream);

        fileStream.on('finish', () => {
          message.reply('Download complete! Sending Facebook video...');
          api.sendMessage({ body: `Here is your Facebook video (API Owner: Mueid Mursalin Rifat):`, attachment: fs.createReadStream(fileName) }, event.threadID, event.messageID);
          fs.unlinkSync(fileName); // Clean up file after sending
        });
      } catch (error) {
        message.reply('Error downloading the Facebook video.');
      }
    } else {
      message.reply('Invalid video link or unsupported platform.');
    }
  },
};
