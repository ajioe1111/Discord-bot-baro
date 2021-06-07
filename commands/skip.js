import { skip } from "../service/musicControl.js";



export default {
    name: "skip",
    aliases: ["skip"],
    description: "",
    guildOnly: true,
    memberpermissions:"VIEW_CHANNEL",
    cooldown: 30,
    usage: "<!skip>",
    execute(message, args) {
        skip();
    },
};