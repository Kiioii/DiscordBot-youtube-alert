const { Client, GatewayIntentBits } = require('discord.js');
const { google } = require('googleapis');

// Discord Bot Token
const discordToken = 'YOUR_DISCORD_BOT_TOKEN';

// YouTube Data API Key
const youtubeApiKey = 'YOUR_YOUTUBE_API_KEY';

// YouTube Video ID (the video you want to retrieve)
const youtubeVideoId = 'YOUR_YOUTUBE_VIDEO_ID';

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  checkForNewVideo(); // Send an alert for the latest video on startup
});

async function checkForNewVideo() {
  const youtube = google.youtube({
    version: 'v3',
    auth: youtubeApiKey,
  });

  try {
    const response = await youtube.videos.list({
      id: youtubeVideoId,
      part: 'snippet', // Include the 'snippet' part
    });

    const video = response.data.items[0];
    const videoUrl = `https://www.youtube.com/watch?v=${youtubeVideoId}`;
    const videoTitle = video.snippet.title;

    // Replace CHANNEL_ID with the ID of the Discord channel where you want to send alerts.
    const alertChannel = await client.channels.fetch('CHANNEL_ID');

    alertChannel.send(`New video: ${videoTitle}\n${videoUrl}`);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Log in to Discord
client.login(discordToken);
