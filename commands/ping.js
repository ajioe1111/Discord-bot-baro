import {client} from '../bot.js'

export default  {
    name: "ping",
    aliases: ["ping"],
    description: "Выводит ответное сообщение",
    category: "users",
    guildOnly: true,
    cooldown: 60,
    usage: "<usage>",
    execute:(message) => {
        message.reply(`pong!\nВ работе уже ${client.uptime / 1000} секунд!`);
        console.log('just ping');

    },
}