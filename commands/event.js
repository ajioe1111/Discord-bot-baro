import { throws } from 'assert';
import * as Discord from 'discord.js'
import * as fs from 'fs'
import Heapify from 'heapify';
import moment from 'moment';
import { setInterval } from 'timers';
import { gameChannel } from '../bot.js';
import Event from '../Event.js';

const eventsJsonPath = './events.json';
/** @type {Array<Event>} */
const events = [];
/** @type {Array<Event>} */
const notificationQueue = new Heapify(64, [], [], Event, Number);
const notificationIntervals = [30, 10, 2];
const notificationLoopInterval = 1 * 1000;

function load() {
    if (fs.existsSync(eventsJsonPath)) {
        const json = fs.readFileSync(eventsJsonPath);
        const events = JSON.parse(json);
        events.forEach(event => {
            addEvent(new Event(event.name, Date.parse(event.date), event.description, event.imageUrl));
        });
    }

}

function save() {
    const json = JSON.stringify(events);
    fs.writeFileSync(eventsJsonPath, json);
}

/**
 * 
 * @param {Event} event
 */
function addEvent(event) {
    if (event.date < new Date())
        return;
    events.push(event);
    for (const interval in notificationIntervals) {
        const notificationDate = getNotificationDate(event.date, interval);
        if (notificationDate > moment().unix())
            notificationQueue.push(event, notificationDate);
    }
}

function removeEvent(event) {
    events = events.filter(innerEvent => innerEvent != event);
}

function notificationLoop() {
    const now = moment().unix();
    while (notificationQueue.peekPriority() <= now) {
        const event = notificationQueue.pop();
        if (events.includes(event))
            gameChannel.send(`||@everyone||\n✨ Напоминание про игру\n${event.name} в ${event.date}! ✨`).catch(console.error);
    }
    save();
}

/**
 * @param {Date} date
 * @param {Number} beforeMinutes
 * @returns {Number} Unix Date
 */
function getNotificationDate(date, beforeMinutes) {
    const momentDate = moment(date);
    momentDate.subtract(beforeMinutes, 'minutes');
    return momentDate.unix();
}

/**
 * 
 * @param {string} dateString 
 * @returns {Moment}
 */
function getTargetDate(dateString) {
    const date = moment(dateString, 'hh:mm');
    if (!date.isValid())
        throw new Error('Неправильный формат');
    if (date.diff(moment()) < 0)
        date.add(1, 'day');
    return date;
}

/**
 * 
 * @param {Discord.Message} message 
 * @param {*} args 
 */
let name;
let time;
let desc;
let defaultImage = 'https://media.discordapp.net/attachments/573490270025416714/843883139205300266/maxresdefault.png';

/**
 * 
 * @param {Discord.Message} message 
 * @param {*} args 
 * @returns 
 */
function checkImage(message, args) {
    let image;
    if (args[3]) {
        image = args[3].slice(1, args[3].length - 1);
        let checkImage = String(image);
        if (checkImage.includes('https://media.discordapp.net/') == false) {
            if (checkImage.includes('https://cdn.discordapp.com/') == false) {
                message.reply(`Ошибка загрузки изображения. Необходимо указать ссылку на картинку залитую в дискорд.\nБудет поставлена картинка по умолчанию`);
                image = defaultImage;
            }
        }

        else { return image; }
    }
    if (args[3] == undefined) {
        image = defaultImage;
    }
    return image;
}

function messageReply(message, args, image) {
    name = args[0].slice(1, args[0].length - 1); // Название игры
    time = args[1].slice(1, args[1].length - 1); // Время игры
    desc = args[2].slice(1, args[2].length - 1); // Описание игры
    const embed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(name)
        .setDescription(`*${desc}*`)
        .addFields(
            { name: 'Время сбора ⏰', value: `В **${time}** по мск.`, inline: false },
            { name: 'Точное время можно узнать тут', value: 'https://time100.ru', inline: false },
        )
        .setImage(image)
        .setThumbnail('https://media.discordapp.net/attachments/573490270025416714/843908295621607424/295c8f85d19d623.png?width=510&height=510')
        .setTimestamp()
        .setFooter('Система оповещения', 'https://media.discordapp.net/attachments/573490270025416714/841041056182960139/favpng_flame-shield.png?width=598&height=675');
    gameChannel.send(`||@everyone||`);
    gameChannel.send(embed);
}

export default {
    name: "event",
    aliases: ["игра"],
    guildOnly: true,
    memberpermissions: "PRIORITY_SPEAKER",
    cooldown: 2,
    usage: "<usage>",
    execute(message, args) {
        let image = checkImage(message, args);
        messageReply(message, args, image);
        const date = getTargetDate(time).toDate();
        const event = new Event(name, date, desc, image);
        addEvent(event);
        save();
    },
};

load();
setInterval(notificationLoop, notificationLoopInterval);
