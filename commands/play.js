import { play } from "../service/musicControl.js";
import * as Discord from 'discord.js';



export default {
    name: "play",
    aliases: ["play"],
    guildOnly: true,
    cooldown: 10,
    usage: "<!play>",
    async execute(message, args) {
        await play(message, args);

    },
};