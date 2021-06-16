import { play } from "../service/musicControl.js";
import * as Discord from 'discord.js';


/**
 * 
 * @param {Discord.Message} message 
 */
function checkMessageGuild(message) {
    if (message.guild.id != '789579914869080074') {
        message.reply('Я выполняю музыкальные команды только в хабе!');
    }
    return;
}

export default {
    name: "play",
    aliases: ["play"],
    guildOnly: true,
    cooldown: 10,
    usage: "<!play>",
    async execute(message, args) {
        checkMessageGuild(message);
        await play(message, args);

    },
};