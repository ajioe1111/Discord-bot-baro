import Discord from 'discord.js';
import { client, logChannel } from '../bot.js';


/**
 * 
 * @param {Discord.Message} message 
 * @param {*} args 
 */
function ban(message, args) {
    const user = message.mentions.users.first();
    const userId = user.id;
    let reason;
    if (args[1] == undefined) {
        reason = 'Забанен командой';
    } else {
        reason = args[1];
    }
    client.guilds.cache.forEach((guild) => {
        let member = guild.members.cache.find(member => member.id === userId);
        if (member) {
            member.ban({ reason: reason })
        }
    }
    )
    const embed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Пользователь был забанен командой.')
        .setDescription(`Инициировал бан ${message.author}`)
        .addFields(
            { name: 'Забанен', value: user, inline: true },
            { name: 'Причина', value: reason, inline: true },
        )
        .setThumbnail(user.displayAvatarURL())
        .setTimestamp()
        .setFooter('Система контроль', 'https://media.discordapp.net/attachments/573490270025416714/841041056182960139/favpng_flame-shield.png?width=598&height=675');

    logChannel.send(embed);
    return;
}


export default {
    name: "ban",
    aliases: ["ban"],
    description: "Банит юзера из всех серверов",
    guildOnly: true,
    memberpermissions: "ADMINISTRATOR",
    cooldown: 5,
    usage: "<!ban id \"Причина\">",
    execute(message, args) {
        ban(message, args);
    },
};