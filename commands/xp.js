import * as Discord from 'discord.js'
import { logChannel } from '../bot.js';
import { xpAdd, xpRemove } from '../service/levelSystem.js';



/**
 * 
 * @param {Discord.Message} message 
 * @param {*} args 
 */
function createEmbed(message, args, userId) {
    const embed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Изменения в опыте')
        .setAuthor(message.author.username, message.author.displayAvatarURL())
        .setThumbnail(message.author.displayAvatarURL())
        .addFields(
            { name: 'Команда', value: args[0], inline: true },
            { name: 'Кол-во', value: args[1], inline: true },
            { name: 'Кто был упомянут', value: userId, inline: true },

        )
        .setTimestamp()
        .setFooter('Система контроль', 'https://media.discordapp.net/attachments/573490270025416714/841041056182960139/favpng_flame-shield.png?width=598&height=675');
    return embed;
}

/**
 * 
 * @param {Discord.Message} message 
 */
export function mentionsUsers(message, args) {
    const channel = message.channel;
    let addCount = Number(args[1]);
    let mentions = message.mentions.users;
    let userId = mentions.map(user => user.id);
    let embed = createEmbed(message, args, userId);
    switch (args[0]) {
        case 'add':
            logChannel.send(embed);
            xpAdd(addCount, userId, channel);
            break;
        case 'remove':
            logChannel.send(embed);
            xpRemove(addCount, userId, channel);
            break;
        default:
            message.reply('Ошибка ввода!\nПример команды: !xp `add`|`remove` (кол-во) @user @user @user ');
    }

}


export default {
    name: "xp",
    guildOnly: true,
    memberpermissions: "PRIORITY_SPEAKER",
    execute(message, args) {
        mentionsUsers(message, args);
    },
};