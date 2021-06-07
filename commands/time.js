import moment from "moment";

//2267

function getDate() {
    moment.locale('ru');
    const date = moment().year(2267).format('L');
    return date;
}



export default {
    name: "time",
    aliases: ["дата"],
    description: "Выводит дату мира",
    guildOnly: true,
    memberpermissions:"VIEW_CHANNEL",
    cooldown: 60,
    usage: "<!time>",
    execute(message, args) {
        const date = getDate();
        message.reply(`Игровая дата ${date}`);
    },
};