import * as Discord from 'discord.js'

/**
 * 
 * @param {Discord.Message} message 
 * @param {*} args 
 */
function command (message, args) {
    if (args[1] == undefined) {
        message.reply("Неверный формат команды");
    }
    let channel = message.mentions.channels.first();
    let msg = args[1].slice(1, args[1].length - 1);
    channel.send(msg);

}

export default {
    name: "say",
    aliases: ["сказать"],
    description: "Копирует сообщение и отправлят в указанный канал",
    guildOnly: true,
    memberpermissions:"ADMINISTRATOR",
    usage: '!say #channel "Сообщение"',
    execute(message, args) {
       command(message, args);
    },
};