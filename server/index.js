import express from 'express';
import dotenv from 'dotenv';
import { Client, GatewayIntentBits } from 'discord.js';

dotenv.config();

const app = express();
app.use(express.json());

// Create Discord client with required intents
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

// Log in the bot
client.login(process.env.DISCORD_TOKEN);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// Middleware to attach client to requests
app.use((req, res, next) => {
  req.client = client;
  next();
});

// 1️⃣ Fetch single user by ID
app.get('/api/discord/user/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await req.client.users.fetch(userId);
    res.json({
      id: user.id,
      username: user.username,
      avatarURL: user.displayAvatarURL()
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'User not found or bot cannot access user' });
  }
});

// 2️⃣ Fetch all members (cached members only)
app.get('/api/discord/members/:guildId', async (req, res) => {
  const guildId = req.params.guildId;
  try {
    if (!client.isReady()) {
      return res.status(503).json({ error: 'Bot not ready yet. Try again in a few seconds.' });
    }

    const guild = await client.guilds.fetch(guildId);

    // Populate cache (small servers)
    await guild.members.fetch(); 
    const members = guild.members.cache;

    if (members.size === 0) {
      return res.status(404).json({ error: 'No members cached. Bot may need to restart or Server Members Intent may be off.' });
    }

    const users = members.map(m => ({
      id: m.user.id,
      username: m.user.username,
      avatarURL: m.user.displayAvatarURL()
    }));

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch members. Ensure bot is in server and Server Members Intent is enabled.' });
  }
});

// 3️⃣ Get total member count
app.get('/api/discord/membercount/:guildId', async (req, res) => {
  const guildId = req.params.guildId;
  try {
    if (!client.isReady()) {
      return res.status(503).json({ error: 'Bot not ready yet. Try again in a few seconds.' });
    }

    const guild = await client.guilds.fetch(guildId);

    if (!guild) {
      return res.status(404).json({ error: 'Guild not found or bot not in server' });
    }

    res.json({
      guildName: guild.name,
      memberCount: guild.memberCount
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch member count' });
  }
});

// Start Express server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));