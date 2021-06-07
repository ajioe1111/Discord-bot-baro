import { setCoin } from "../service/levelSystem.js";



export default {
    name: "setcoin",
    aliases: ["setcoin"],
    description: "Выставляет N кол-во коинов у юзера",
    guildOnly: true,
    memberpermissions:"ADMINISTRATOR",
    cooldown:0,
    usage: "<!setcoin 123214124312>",
    execute(message, args) {
        setCoin(message, args);
    },
};