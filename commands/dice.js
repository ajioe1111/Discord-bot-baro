
export default {
    name: "dice",
    aliases: ["dice", "кубик"],
    description: "Возвращает рандомное число!",
    memberpermissions: "VIEW_CHANNEL",
    cooldown: 60,
    usage: "!dice",
    execute(message) {
        let randomNumber = Math.floor(Math.random() * 100);
        message.reply(`Вам выпало число **${randomNumber}**`);
    },
};