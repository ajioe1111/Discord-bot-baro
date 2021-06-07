import { randomCharacter } from "../service/randomCharacter.js";

export default {
    name: "random",
    aliases: ["персонаж", "новыйперсонаж"],
    description: "Выдает автору рандомного персонажа",
    guildOnly: true,
    memberpermissions: "VIEW_CHANNEL",
    cooldown: 60,
    usage: "<!random>",
    execute(message, args) {
        randomCharacter(message);
    },
};