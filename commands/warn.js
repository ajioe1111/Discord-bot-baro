import Discord from 'discord.js';
import { client, hubID, warnChannel } from '../bot.js'
import fs from 'fs';

let member;
let database = JSON.parse(fs.readFileSync("./list.json"));
let userIndex;
let warnEmbed;


/**
 * 
 * @param {Discord.Message} message 
 * @param {*} args 
 */
function findMember(args) {
    database = JSON.parse(fs.readFileSync("./list.json"));
    let findId = args[0];
    let memberGuild = client.guilds.cache.find(guild => guild.id == hubID);
    let findMember = memberGuild.members.cache.find(mem => {
        return mem.user.id == findId;
    });
    member = findMember;
    userIndex = database.users_list.findIndex(user => user.id == member.id);

    addWarn(args);
}

function addWarn(args) {
    database.users_list[userIndex].properties.warn = database.users_list[userIndex].properties.warn + 1;
    let warnCount = database.users_list[userIndex].properties.warn;
    fs.writeFileSync("./list.json", JSON.stringify(database));
    warnMessage(args);
    checkWarn();

}

function checkWarn() {
    let warnCount = database.users_list[userIndex].properties.warn;
    warnChannel.send(warnEmbed);
    if (warnCount == 3) {
        client.guilds.cache.forEach((guild) => {
            let mem = guild.members.cache.find(mem => mem.id === member.id);
            if (mem) {
                mem.ban({ reason: `Привышен лимит предупреждений!` });
            }
        })
        database.users_list[userIndex].properties.warn = 0;
        fs.writeFileSync("./list.json", JSON.stringify(database));
    }
}
/**
 * 
 * @param {Discord.Message} message 
 */
function warnMessage(args) {

    const embed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setTitle('Выдано предупреждение!')
        .setURL('https://wiki.projectbaro.ru/ru/Правила')
        .setAuthor(member.user.tag, `${member.user.displayAvatarURL()}`)
        .setDescription(`*При получении 3-х предупреждений будет выдана блокировка\nСейчас их*  **${database.users_list[userIndex].properties.warn} из 3**`)
        .setThumbnail(`https://media.discordapp.net/attachments/573490270025416714/843932341247541248/pngegg.png?width=886&height=510`)
        .addFields(
            { name: 'Кому выдано', value: member, inline: false },
            { name: 'Выдано за', value: `${args[1].slice(1, args[1].length - 1)}`, inline: false },
        )
        .setTimestamp()
        .setFooter('Система контроль', 'https://media.discordapp.net/attachments/573490270025416714/841041056182960139/favpng_flame-shield.png?width=598&height=675');
    warnEmbed = embed;

}


export default {
    name: "warn",
    aliases: ["предупреждение"],
    description: "Выдает юзеру warn",
    guildOnly: true,
    memberpermissions: "VIEW_AUDIT_LOG",
    cooldown: 1,
    usage: "!warn id \"Причина\"",
    execute(message, args) {
        findMember(args);
    },
};