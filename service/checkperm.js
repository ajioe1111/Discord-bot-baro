import { Message } from 'discord.js'
import { client } from '../bot.js';

/**
 * 
 * @param {Message} message 
 */

export function checkPerm (message) {
let findGuild = client.guilds.cache.find(guild => guild.id == message.guild.id);
let findMember = findGuild.members.cache.find(member => member.id == message.author.id);
return findMember;
}