import Discord from 'discord.js';
import { client } from '../bot.js';


/**
 * 
 * @param {Discord.Message} message 
 */
function clear(message, args) {
    let count;
    let value = args[0];
    if (value < 101) {
        count = value;
        message.delete({ timeout: 0 });
        messageDelete(message, count, value);
    }
    else if (value > 100) {
        message.reply(`Ошибочка вышла, я не могу удалять больше 100 сообщений за раз!`)
            .catch(message => setTimeout(() => message.delete(), 5000));
    }
    else if (args[0] == undefined || args[0] <= 0) {
        message.reply(`Нужно указать число от 1 до 100 для удаления`);
    }

}
function messageDelete(message, count, value) {
    let logGuild = client.guilds.cache.find(guild => guild.id == message.guild.id);
    let botlog = logGuild.channels.cache.find(channel => channel.name == 'botlog');
    if (!botlog) {
        message.reply(`Я не нашел канал botlog! создайте его и повторите попытку!`);
        console.log(`Ошибка в команде clear. Не найден botlog`);
    }
    message.channel.bulkDelete(count);
    const embed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setDescription(`${message.author} удалил'a **${value}** сообщений в канале ${message.channel}`)
    botlog.send(embed);
    return;
}

export default {
    name: "clear",
    aliases: ["очистка"],
    description: "Очищает чат на N сообщения",
    guildOnly: true,
    memberpermissions: "VIEW_AUDIT_LOG",
    cooldown: 10,
    usage: "<!clear 1-100>",
    execute(message, args) {
        clear(message, args);
    },
};