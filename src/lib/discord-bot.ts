import { Client, GatewayIntentBits, REST, Routes, EmbedBuilder } from 'discord.js';

let client: Client | null = null;
let rest: REST | null = null;

const SERVER_NAME = "Aura Development"; // Configure this
const SERVER_ICON = "https://i.postimg.cc/X71XVpvP/LOGO-Aura-City-2000x2000-V2-by-Flight-Design.png"; // Configure this
const FOOTER_TEXT = "© 2024 Aura Development - All rights reserved"; // Configure this

export function initializeDiscordBot() {
  if (!process.env.DISCORD_BOT_TOKEN) {
    console.error('DISCORD_BOT_TOKEN is not set in the environment variables');
    return;
  }

  try {
    client = new Client({ 
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages],
    });

    rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);

    client.on('ready', () => {
      console.log(`Logged in as ${client.user?.tag}!`);
    });

    client.login(process.env.DISCORD_BOT_TOKEN);
  } catch (error) {
    console.error('Failed to initialize Discord bot:', error);
  }
}

export async function sendDirectMessage(userId: string, status: 'approved' | 'denied', reason?: string) {
  if (!client || !rest) {
    console.error('Discord bot not initialized');
    return;
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const timestampLong = `<t:${timestamp}:F>`; // Discord timestamp format for full date

  const embed = new EmbedBuilder()
    .setColor(status === 'approved' ? '#00FF00' : '#FF0000')
    .setAuthor({
      name: SERVER_NAME,
      iconURL: SERVER_ICON,
    })
    .setTitle('Whitelist Application Response')
    .setDescription(
      status === 'approved'
        ? `Hello there,\n\nAfter reviewing your application, we're excited to let you know that your whitelist application has been **ACCEPTED**! 🎉\n\n${
            reason ? `**Staff Note:** ${reason}\n\n` : ''
          }Your responses demonstrated a strong understanding of roleplay and alignment with our community values. We believe you'll be a great addition to our server!\n\n**Next Steps:**\n1. Join our Discord server if you haven't already\n2. Read the rules and guidelines in #server-rules\n3. Connect to the server using your whitelisted Steam account`
        : `Hello there,\n\nAfter careful consideration of your whitelist application, we regret to inform you that your application has been **DENIED** at this time.\n\n${
            reason ? `**Reason:** ${reason}\n\n` : ''
          }You may reapply after a 14-day waiting period, taking into account the feedback provided.`
    )
    .addFields(
      { 
        name: 'Application Status', 
        value: status === 'approved' ? '✅ Accepted' : '❌ Denied', 
        inline: true 
      },
      { 
        name: 'Decision Date', 
        value: timestampLong, 
        inline: true 
      }
    );

  // Add reason as a separate field if provided
  if (reason) {
    embed.addFields({
      name: status === 'approved' ? 'Staff Note' : 'Reason',
      value: reason,
      inline: false
    });
  }

  embed.setFooter({
    text: FOOTER_TEXT,
    iconURL: SERVER_ICON
  })
  .setTimestamp();

  if (status === 'approved') {
    embed.addFields({
      name: 'Important Information',
      value: 'Please make sure to read our server rules and guidelines before connecting. If you have any questions, our staff team is here to help!'
    });
  }

  try {
    // Try to use the client first
    const user = await client.users.fetch(userId);
    await user.send({ embeds: [embed] });
    console.log(`Message sent to user ${userId} using client`);
  } catch (error) {
    console.error(`Failed to send message using client, falling back to REST API:`, error);
    
    // Fallback to REST API
    try {
      await rest.post(
        Routes.userMessages(userId),
        { body: { embeds: [embed] } }
      );
      console.log(`Message sent to user ${userId} using REST API`);
    } catch (restError) {
      console.error(`Failed to send message to user ${userId} using REST API:`, restError);
      throw restError;
    }
  }
}

