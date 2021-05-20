import { addWord } from "../service/checkMessage.js";


export default {
    name: "addword",
    aliases: ["слово"],
    description: "Добавляет слово в список банов",
    guildOnly: true,
    memberpermissions: "ADMINISTRATOR",
    usage: "!addword слово",
    execute(message, args) {
        addWord(message, args)
    },
};