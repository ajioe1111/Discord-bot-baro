import { play } from "../service/musicControl.js";




export default {
    name: "play",
    aliases: ["play"],
    guildOnly: true,
    cooldown: 30,
    usage: "<!play>",
    async execute(message, args) {
        await play(message, args);

    },
};