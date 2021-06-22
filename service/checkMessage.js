import * as fs from 'fs';
import * as Discord from 'discord.js';
import { client, logChannel, memberPerm } from '../bot.js';
const path = './words.json';


/**
 * 
 * @param {Discord.Message} message 
 */
export function checkMessage(message) {
    if (memberPerm.hasPermission('ADMINISTRATOR') || message.author.bot) {
        return;
    }
    if (message.member.roles.cache.find(role => role.name == 'mute')) {
        message.delete({ timeout: 0 })
            .then(message.author.send('На вас стоит **mute**! Пожалуйста, дождитесь его окончания.'))
        return;
    };
    bannedWords(message);
    checkUrl(message);
    return;
}

/**
 * 
 * @param {Discord.Message} message 
 */
function bannedWords(message) {
    let msg = message.content.toLowerCase();
    let words = fs.readFileSync(path).toString();
    let arr = JSON.parse(words);
    let isBannedWord = arr.some(word => msg.split(' ').includes(word));
    if (isBannedWord) {
        message.delete({ timeout: 0 })
            .then(message.reply(`Вы написали запрещенное слово! 🤬`));
        const embed = new Discord.MessageEmbed()
            .setColor('#ff0000')
            .setAuthor('Система контроль', 'https://media.discordapp.net/attachments/573490270025416714/841041056182960139/favpng_flame-shield.png?width=598&height=675')
            .setTitle('Запрещенное слово!')
            .setTimestamp()
            .addFields(
                { name: 'Пользователь', value: message.author, inline: false },
                { name: 'Сообщение ', value: message.content, inline: false },
                { name: 'Канал', value: message.channel, inline: true },
                { name: 'ID Сообщения', value: message.id, inline: true },
            );
        logChannel.send(embed);
        return;
    }
}

/**
 * 
 * @param {Discord.Message} message 
 * @returns 
 */
function checkUrl(message) {
    if (message.content.startsWith(`https://discord.com/channels/@me`) || memberPerm.hasPermission('EMBED_LINKS')) {
        return;
    }
    let lowerContent = message.content.toLowerCase();
    let url = ['http', 'https', '.www', '://', '.ru', '.com', '.net', '.info', 'ht_ps:', '//www.'];
    let isUrl = url.some(url => lowerContent.includes(url));
    if (isUrl) {
        message.delete({ timeout: 0 })
            .then(message.reply(`Вашей роли запрещенно встраивать ссылки 📛`));
        const embed = new Discord.MessageEmbed()
            .setColor('#ff0000')
            .setTitle('Ссылка!')
            .setAuthor('Система контроль', 'https://media.discordapp.net/attachments/573490270025416714/841041056182960139/favpng_flame-shield.png?width=598&height=675')
            .addFields(
                { name: 'Пользователь', value: message.author, inline: false },
                { name: 'Сообщение ', value: message.content, inline: false },
                { name: 'Канал', value: message.channel, inline: true },
                { name: 'ID Сообщения', value: message.id, inline: true },
            )
            .setTimestamp()
        logChannel.send(embed);
        return;
    }
}

export function addWord(msg, args) {
    let cacheList = fs.readFileSync(path).toString();
    let listArray = JSON.parse(cacheList);
    if (!args[0]) {
        msg.reply(`Я не могу добавить пустое слово =/`);
        return;
    }
    let lowerArgs = args[0].toLowerCase()
    for (let i = 0; i < listArray.length; i++) {
        if (lowerArgs == listArray[i]) {
            msg.reply(`Такое слово уже есть в списке!`);
            return;
        }
    }
    listArray.push(lowerArgs);
    msg.reply(`Я добавил слово в список!`);
    console.log(`Add new word "${lowerArgs}" to black list!`);
    fs.writeFileSync(path, JSON.stringify(listArray));
}

export function deleteWord(msg, args) {
    let cacheList = fs.readFileSync(path).toString();
    let listArray = JSON.parse(cacheList);
    if (!args[0]) {
        msg.reply(`Я не могу удалить пустоту...`);
        return;
    }
    let lowerArgs = args[0].toLowerCase()
    for (let i = 0; i <= listArray.length; i++) {
        if (lowerArgs == listArray[i]) {
            listArray.splice(i, 1);
            console.log(`delete "${lowerArgs}" banned word!`);
            fs.writeFileSync(path, JSON.stringify(listArray));
            msg.reply(`Я удалил слово "${lowerArgs}" из списка!`)
        }
    }
}

/**
 * 
 * @param {Discord.Message} message 
 */
export function messageDelete(message) {
    if (!message) {
        console.log('ошбика в удаление сообщения');
        return;
    }
    console.log('Message deleted! start')
    if (memberPerm.hasPermission('ADMINISTRATOR') || message.author.bot) { return; }
    const guild = client.guilds.cache.find(guild => guild.id == message.guild.id)
    const botlog = guild.channels.cache.find(channel => channel.name === "botlog");
    if (!botlog) {
        message.reply('Ошибка! не найден канал botlog! создайте его и повторите попытку');
    }
    console.log(`message deleted! created embed. add field: msg author ${message.author} || msg content ${message.content} || msg channel ${message.channel}`);
    const embed = new Discord.MessageEmbed()
        .setColor('#ff8040')
        .setTitle('Удалено сообщение!')
        .setAuthor('Система контроль', 'https://media.discordapp.net/attachments/573490270025416714/841041056182960139/favpng_flame-shield.png?width=598&height=675')
        .addFields(
            { name: 'Автор', value: message.author ? message.author : 'Без автора', inline: false },
            { name: 'Сообщение', value: message.content ? message.content : 'Message deleted error (no content)', inline: false },
            { name: 'Канал', value: message.channel ? message.channel : 'no channel', inline: false },
        )
        .setTimestamp()
        .setThumbnail('https://media.discordapp.net/attachments/573490270025416714/843975587667902464/kisspng-rubbish-bins-waste-paper-baskets-recycling-bin-c-recycle-bin-5abcf486d5bc23.0333927715223328.png?width=510&height=510')
    botlog.send(embed);
    console.log('message deleted! end');
    return;
}
/**
 * 
 * @param {Discord.Message} oldMessage 
 * @param {Discord.Message} newMessage 
 */
export function messageUpdate(oldMessage, newMessage) {
    if (oldMessage.channel.id == '851136274043371540') { return; }
    if (oldMessage.author.bot) { return; }
    const guild = client.guilds.cache.find(guild => guild.id == oldMessage.guild.id)
    const botlog = guild.channels.cache.find(channel => channel.name === "botlog");
    if (!botlog) {
        message.reply('Ошибка! не найден канал botlog! создайте его и повторите попытку');
    }
    const embed = new Discord.MessageEmbed()
        .setColor('#0080ff')
        .setTitle('📝Изменение сообщения📝')
        .setAuthor('Система контроль', 'https://media.discordapp.net/attachments/573490270025416714/844906284272058368/1575792932_message-min.png?width=514&height=520')
        .setDescription(`**Изменения в канале:**${oldMessage.channel}\n**Изменил:**${oldMessage.author}`)
        .setThumbnail(oldMessage.author.displayAvatarURL())
        .addFields(
            { name: 'Старое сообщение', value: oldMessage.content ? oldMessage.content : 'no content', inline: true },
            { name: 'Новое сообщение', value: newMessage.content ? newMessage.content : 'no content', inline: true },
            { name: 'Ссылка на сообщение', value: newMessage.url ? newMessage.url : 'Нету ссылки', inline: false },
        )
        .setTimestamp()
        .setFooter(`channel id: ${oldMessage.channel.id} || user id ${oldMessage.author.id}`);
    botlog.send(embed);
}