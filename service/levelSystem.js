import * as Discord from 'discord.js'
import { client, hubID, logChannel } from '../bot.js';
import * as fs from 'fs'

let database = JSON.parse(fs.readFileSync("./list.json"));


function coolDown(experienceGainDate) {
    // 1800000 это пол часа
    let difference = new Date() - experienceGainDate;
    if (difference >= 1800000) {
        return true;
    }
    else { return false; }
}

/**
 * 
 * @param {*} count 
 * @param {Discord.Message} message 
 * @param {Discord.User} userID 
 */
export function xpAdd(count, userID, channel) {
    if (!Number.isInteger(count)) {
        logChannel.send('Ошибка! нужно ввести число !xp add ЧИСЛО БЛЭАТЬ');
        return;
    } 
    let errorMsg = ["@everyone Произошла ошибка в добавления опыта!"]
    for (let i = 0; i < userID.length; i++) {
        let ID = userID[i];
        let userIndex = database.users_list.findIndex(user => user.id == ID);
        if (userIndex != -1) {
            errorMsg.push(`<@${ID}> получил(а) опыт!`);
        }
        if (userIndex == -1) {
            logChannel.send(errorMsg);
            fs.writeFileSync("./list.json", JSON.stringify(database));
            return;
        };
        database.users_list[userIndex].properties.experienceGainDate = new Date();
        let xpCount = database.users_list[userIndex].properties.xp + count;
        if (xpCount >= 10656) { // 10656 да 48 часов
            let step = database.users_list[userIndex].properties.stepToCoin + 1;
            database.users_list[userIndex].properties.stepToCoin = database.users_list[userIndex].properties.stepToCoin + 1;
            database.users_list[userIndex].properties.level = database.users_list[userIndex].properties.level + 1;
            database.users_list[userIndex].properties.xp = 0;
            let msg = [`<@${ID}>\n📈 Ты получил ${database.users_list[userIndex].properties.level} уровень! так держать! 📈`];
            if (step >= 5) {
                database.users_list[userIndex].properties.stepToCoin = 0;
                database.users_list[userIndex].properties.coin = database.users_list[userIndex].properties.coin + 1;
                msg.push(`И заработал целый гем!\nТеперь у тебя **${database.users_list[userIndex].properties.coin}** 💎`);
            }
            channel.send(msg);
        } else {
            database.users_list[userIndex].properties.xp = database.users_list[userIndex].properties.xp + count;
        }
    }
    fs.writeFileSync("./list.json", JSON.stringify(database));
}

export function xpRemove(count, userID, channel) {
    let errorMsg = ["@everyone Произошла ошибка в удаление опыта!"]
    for (let i = 0; i < userID.length; i++) {
        let ID = userID[i];
        let userIndex = database.users_list.findIndex(user => user.id == ID);
        if (userIndex != -1) {
            errorMsg.push(`<@${ID}> был удален опыт!`);
        }
        if (userIndex == -1) {
            logChannel.send(errorMsg);
            fs.writeFileSync("./list.json", JSON.stringify(database));
            return;
        }
        let xpCount = database.users_list[userIndex].properties.xp - count;
        if (xpCount <= 0) {
            let checkLevel = database.users_list[userIndex].properties.level - 1;
            if (checkLevel <= 0) {
                database.users_list[userIndex].properties.level = 0;
                database.users_list[userIndex].properties.stepToCoin = 5;
                database.users_list[userIndex].properties.coin = 0;
                channel.send(`<@${ID}> Твой уровень пропал! :O как ты это сделал?!`);
            } else {
                database.users_list[userIndex].properties.level = database.users_list[userIndex].properties.level - 1;
                channel.send(`<@${ID}> Твой уровень был понижен! ;(`);
            }
            database.users_list[userIndex].properties.xp = 0;
            let step = database.users_list[userIndex].properties.stepToCoin;
            if (step == 0) {
                if (database.users_list[userIndex].properties.coin <= 0) {
                    database.users_list[userIndex].properties.coin = 0;
                }
                database.users_list[userIndex].properties.coin = database.users_list[userIndex].properties.coin - 1;
                channel.send(`<@${ID}> Ты уронил гем D: NOOOOO~!`);
                database.users_list[userIndex].properties.stepToCoin = 5;
            } else {
                database.users_list[userIndex].properties.stepToCoin = database.users_list[userIndex].properties.stepToCoin - 1;
            }

        } else {
            database.users_list[userIndex].properties.xp = database.users_list[userIndex].properties.xp - count;
        }
    }
    fs.writeFileSync("./list.json", JSON.stringify(database));
}


export function xpControl(message) {
    database = JSON.parse(fs.readFileSync("./list.json"));
    let userIndex = database.users_list.findIndex(user => user.id == message.author.id);
    if (userIndex == -1) {
        message.reply(`Ошибка в получении опыта! обратитесь к администратору!`);
        console.log(`Ошибка в функции xpContorl. userIndex не найден!`);
        return;
    }
    let experienceGainDate = new Date(database.users_list[userIndex].properties.experienceGainDate);
    let getIt = coolDown(experienceGainDate);
    let userID = [message.author.id];
    let channel = message.channel;
    if (getIt) {
        xpAdd(111, userID, channel);
    }
}

/**
 * 
 * @param {Discord.Message} message 
 */
export function myLevel(message) {
    let userIndex = database.users_list.findIndex(user => user.id == message.author.id);
    let level = database.users_list[userIndex].properties.level;
    let xp = database.users_list[userIndex].properties.xp;
    let nextLevel = 10656 - database.users_list[userIndex].properties.xp;
    let nextCoin = 5 - database.users_list[userIndex].properties.stepToCoin;
    let gemText;
    if (nextCoin == 5 || nextCoin == 0) {
        gemText = 'уровней';
    } else if (nextCoin < 5 && nextCoin > 1) {
        gemText = 'уровня';
    } else if (nextCoin == 1) {
        gemText = 'уровень';
    }
    const embed = new Discord.MessageEmbed()
        .setColor('#00ffff')
        .setDescription('Твоя информация')
        .setAuthor(message.author.username, message.author.displayAvatarURL())
        .setThumbnail(message.author.displayAvatarURL())
        .addFields(
            { name: 'Уровень', value: `${level} 📈`, inline: true },
            { name: 'Опыт', value: `${xp}/10656`, inline: true },
            { name: 'Новый уровень через', value: `${nextLevel} опыта`, inline: true },
            { name: 'Гемов на счету', value: `${database.users_list[userIndex].properties.coin} 💎`, inline: true },
            { name: 'Гем через', value: `${nextCoin} ${gemText}`, inline: true },
        )
        .setTimestamp()
        .setFooter('Система казначей', 'https://media.discordapp.net/attachments/573490270025416714/841041056182960139/favpng_flame-shield.png?width=599&height=676');

    message.reply(embed);
}


/**
 * 
 * @param {Discord.Message} message 
 * @param {*} args 
 */
export function setCoin(message, args) {
    const targetUser = args[0];
    const targetCoin = Number(args[1]);
    const findHub = client.guilds.cache.find(guild => guild.id == hubID);
    const member = findHub.members.cache.find(member => member.id == targetUser);
    if (!member) { message.reply(`Я не смог найти юзера с ID ${targetUser}`) };
    database = JSON.parse(fs.readFileSync("./list.json"));
    const userIndex = database.users_list.findIndex(user => user.id == targetUser);
    if (userIndex == -1) {
        message.reply('Ошибка в команде setcoin (ID не найден)');
        return;
    }
    database.users_list[userIndex].properties.coin = targetCoin;
    fs.writeFileSync("./list.json", JSON.stringify(database));
    const embed = new Discord.MessageEmbed()
        .setColor('#800080')
        .setTitle('Установлено новое кол-во coin\' у юзера!')
        .setDescription(`Инициатор команды ${message.author}`)
        .addFields(
            { name: 'Юзер', value: `<@${member.id}>`, inline: true },
            { name: 'Изменено на', value: targetCoin, inline: true },
        )

    logChannel.send(embed);
}