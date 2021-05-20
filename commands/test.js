export default {
    name: "test",
    aliases: ["test"],
    guildOnly: true,
    memberpermissions:"ADMINISTRATOR",
    cooldown: 2,
    usage: "<usage>",
    execute(message, args) {
        const date = new Date();
        console.log(date);
    },
};