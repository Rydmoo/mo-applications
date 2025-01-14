// Add or update this file

export const ADMIN_DISCORD_IDS = ['123456789012345678', '123456789012345678', '987654321098765432']; // Add all admin Discord IDs here

export function isAdmin(discordId: string | undefined): boolean {
  return !!discordId && ADMIN_DISCORD_IDS.includes(discordId);
}

