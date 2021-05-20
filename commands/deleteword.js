import { deleteWord } from "../service/checkMessage.js";


export default {
    name: "deleteword",
    aliases: ["удалить"],
    description: "Удаляет слово из списка",
    guildOnly: true,
    memberpermissions:"ADMINISTRATOR",
    usage: "!deleteword слово",
    execute(message, args) {
    deleteWord(message, args)
    },
};