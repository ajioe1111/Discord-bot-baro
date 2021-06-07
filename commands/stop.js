import { stop } from "../service/musicControl.js";



export default {
    name: "stop",
    aliases: ["stop"],
    description: "Остонавливает воспроизведение музыки",
    guildOnly: true,
    memberpermissions:"VIEW_CHANNEL",
    cooldown: 0,
    usage: "<!stop>",
    execute(message, args) {
        stop();
    },
};