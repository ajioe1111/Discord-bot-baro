import * as Discord from 'discord.js'
import { client } from '../bot.js';

let botlog;
let thisGuild;
let mutedRole;
let member;
let timeName;
let msgEmbed;

/**
 * 
 * @param {Discord.Message} message 
 */
function findMember(message) {
    let user = message.mentions.users.first();
    thisGuild = client.guilds.cache.find(guild => guild.id == message.guild.id);
    let thisMember = thisGuild.members.cache.find(member => member.id == user.id);
    if (!thisMember) {
        console.error();
        message.reply('Ошибка, пользователь не был найден!');
        return;
    }
    mutedRole = thisGuild.roles.cache.find(role => role.name == 'mute');
    if (!mutedRole) {
        console.error();
        message.reply('Ошибка, не найдена роль "mute"!');
        return;
    }
    botlog = thisGuild.channels.cache.find(channel => channel.name === 'botlog');
    if (!botlog) {
        console.error();
        message.reply('Ошибка, не найден канал "botlog"');
        return;
    }
    return thisMember;
}

function muted(message, args) {
    let time = Number(args[1]);
    if (time == undefined) { message.reply('Нужно указать время'); return; }
    let timeInt = args[2]; //ч - час, м - минуты, с - секунды.
    let desc = 'Без причины';
    if (args[3])
        desc = args[3];
    switch (timeInt) {
        case 'ч':
            time = (time * 60) * 60;
            timeName = "Hour's";
            break;
        case 'м':
            time = time * 60;
            timeName = "Minute's";
            break;
        case 'с':
            timeName = "Second's";
            break;
        default:
            timeName = "Second's";
            break;
    };

    msgEmbed = embed(message, args);
    if (member.voice.channel) {
        member.voice.setMute(true);
        setTimeout(() => {
            if (member.voice.channel) { member.voice.setMute(false) }
        }, time * 1000);
    }

    member.roles.add(mutedRole);
    setTimeout(() => {
        member.roles.remove(mutedRole);
        member.send('mute был снят!');
    }, time * 1000);
    botlog.send(msgEmbed);
}



/**
 * 
 * @param {Discord.Message} message 
 * @param {*} args 
 */
function embed(message, args) {
    let commandAuthor = message.author;
    let commandAvatar = commandAuthor.displayAvatarURL();
    let mentionUser = message.mentions.users.first();
    let time = args[1];
    let desc = 'Без причины';
    if (args[3]) {
        desc = args[3];
    }
    const embed = new Discord.MessageEmbed()
        .setColor('#ff8000')
        .setTitle('Выдан mute!')
        .setAuthor(commandAuthor.username, commandAvatar)
        .setDescription(`🗨 **причина:**\n${desc}`)
        .setThumbnail('https://media.discordapp.net/attachments/573490270025416714/843932341247541248/pngegg.png?width=909&height=523')
        .addFields(
            { name: 'Выдан', value: mentionUser, inline: true },
            { name: 'Выдан на', value: `${time} ${timeName}`, inline: true },
        )
        .setTimestamp('timestamp')
        .setFooter('Система контроль', 'https://media.discordapp.net/attachments/573490270025416714/841041056182960139/favpng_flame-shield.png?width=598&height=675');
    return embed;
}

/**
 * 
 * @param {Discord.GuildMember} newMember 
 */
export function voiceMuteCheck(newMember) {
    let mem = newMember.guild.members.cache.find(member => member.id == newMember.id);
    let findMutedRole = mem.roles.cache.find(role => role.name == 'mute');
    if (findMutedRole) {
        if (mem.voice.channel) {
            if (!mem.voice.mute) { mem.voice.setMute(true) }
            return;
        }

    } else {
        if (mem.voice.channel) {
            if (mem.voice.mute) { mem.voice.setMute(false) }
            return;
        }
    };
}

export default {
    name: "mute",
    aliases: ["заглушить"],
    guildOnly: true,
    memberpermissions: "VIEW_AUDIT_LOG",
    cooldown: 1,
    usage: "<usage>",
    execute(message, args) {
        member = findMember(message);
        muted(message, args);
    },
};