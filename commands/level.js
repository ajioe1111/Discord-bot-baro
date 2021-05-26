import { myLevel } from "../service/levelSystem.js";


export default {
    name: "level",
    aliases: ["level", "balance", "melevel", "mybalance"],
    guildOnly: true,
    memberpermissions:"VIEW_CHANNEL",
    cooldown: 60,
    execute(message) {
        myLevel(message);
    },
};