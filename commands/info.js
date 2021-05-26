
import * as Discord from 'discord.js'
import { client, logChannel } from '../bot.js';
import * as fs from 'fs'



function findMember(message, args) {
    const memberGuild = client.guilds.cache.find(guild => guild.id == message.guild.id);
    const findMember = memberGuild.members.cache.find(member => member.id == args[0]);
    if (findMember)
    return findMember;
    else 
    console.log('Ошибка в функции findMember');
}

/**
 * 
 * @param {Discord.GuildMember} member 
 */
function memberInfo(member) {
    const database = JSON.parse(fs.readFileSync("./list.json"));
    const userIndex = database.users_list.findIndex(user => user.id == member.id);
    const joinDatе = new Date(database.users_list[userIndex].properties.joinDate)
    // database.users_list[userIndex].properties.join_hub = true;
    const embed = new Discord.MessageEmbed()
        .setColor('#8000ff')
        .setTitle('Информация о юзере')
        .setAuthor('Soul keeper', 'https://media.discordapp.net/attachments/573490270025416714/846020596592803870/8e6f8d52808eec04c5b8f03dc39c519c.png?width=286&height=446', 'https://ru.wikipedia.org/wiki/Демон')
        .setDescription('Полная информация по юзеру')
        .setThumbnail(member.user.displayAvatarURL())
        .addFields(
            { name: 'User', value: `<@${member.id}>`, inline: true },
            { name: 'User tag', value: member.user.tag, inline: true },
            { name: 'Level\'s', value: `💯 ${database.users_list[userIndex].properties.level}`, inline: true },
            { name: 'XP', value: `🎮 ${database.users_list[userIndex].properties.xp}`, inline: true },
            { name: 'Warn\'s', value: `⚠ ${database.users_list[userIndex].properties.warn}`, inline: true },
            { name: 'Coin\'s', value: `💰 ${database.users_list[userIndex].properties.coin}`, inline: true },
            { name: 'Join Date to hub', value: joinDatе, inline: true },
        )
        .setTimestamp();
            logChannel.send(embed);

}


export default {
    name: "info",
    description: "Выводит полную информацию о указаном юзере",
    guildOnly: true,
    memberpermissions: "ADMINISTRATOR",
    usage: "<!info 88003553535>",
    execute(message, args) {
        let member = findMember(message, args);
        if (!args[0]) {
            message.reply('Ошибочка вышла ❌\nНужно указать ID пользователя.')
        }
        memberInfo(member);

    },
};