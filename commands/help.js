import * as Discord from 'discord.js'
import { checkPerm } from '../service/checkperm.js';



function getPerm(message) {
    let author = checkPerm(message);
    let userRole;
    if (author.hasPermission('ADMINISTRATOR')) { userRole = 'admin'; return userRole; }
    if (author.hasPermission('PRIORITY_SPEAKER')) { userRole = 'gm'; return userRole; }
    if (author.hasPermission('VIEW_AUDIT_LOG')) { userRole = 'moder'; return userRole; }
    else { userRole = 'justUser'; return userRole; }
}

function createEmbed(message) {
    let user = getPerm(message);
    let embedArr = [];
    const adminEmbed = new Discord.MessageEmbed()
        .setColor('#ff80c0')
        .setDescription('Команды уровня Администратор')
        .addFields(
            { name: 'Добавить слово в список забаненых слов', value: '!addword дурак ИЛИ !слово дурак', inline: false },
            { name: 'Удалить слово из списка забаненых слов', value: '!deleteword дурак или !удалить дурак', inline: false },
            { name: 'Забанить пользователя на всех серверах', value: '!ban id (пкм по юзеру и копировать id) (причина по желанию, можно оставить пустым)', inline: false },
            { name: 'Кикнуть пользователя со всех серверах', value: '!kick id (пкм по юзеру и копировать id) (причина по желанию, можно оставить пустым)', inline: false },
            { name: 'Получить информацию о юзере', value: '!info id (пкм по юзеру и копировать id)', inline: false },
            { name: 'Написать сообщение от лица бота', value: '!say #канал "СООБЩЕНИЕ ОБЯЗАТЕЛЬНО МЕЖДУ ДВОЙНЫХ КОВЫЧЕК! ЗАПРЕЩАЕТСЯ ИСПОЛЬЗОВАТЬ ДОПОЛНИТЕЛЬНЫЕ ДВОЙНЫЕ КОВЫЧКИ В СООБЩЕНИИ!"', inline: false },
            { name: 'Установить значение коинов у юзера', value: '!setcoin кол-во (цифрами и без ковычек) id (пкм по юзеру и копировать id)', inline: false },
        );
    const gmEmbed = new Discord.MessageEmbed()
        .setColor('#ff80c0')
        .setDescription('Команды уровня ГеймМастер')
        .addFields(
            { name: 'Обьявить игру', value: '!event "Название" "21:30" "Описание" (и по желанию"ССЫЛКА НА ИЗОБРАЖЕНИЕ ИЗ ДИСКОРДА *можно не указывать тогда будет использована дефолтная*")', inline: false },
            { name: 'Контроль опыта юзера(ов)', value: '!xp `add`|`remove` (кол-во) @user @user @user', inline: false },
        );
    const moderEmbed = new Discord.MessageEmbed()
        .setColor('#ff80c0')
        .setDescription('Команды уровня Модератор')
        .addFields(
            { name: 'Выдать юзеру mute на чат и голос (если он находится в голосовом)', value: '!mute @user время c|м|ч (секунд, минут, часов) "причина"', inline: false },
            { name: 'Короткая версия команды !mute', value: '!mute @user время', inline: false },
            { name: 'Выдать предупреждение юзеру', value: '!warn id(пкм по юзеру и копировать id "Причина"', inline: false },
            { name: 'Очистить чат', value: '!clear число (от 1 до 100)', inline: false },
        );
    const userEmbed = new Discord.MessageEmbed()
        .setColor('#ff80c0')
        .setDescription('Команды уровня Пользователь')
        .addFields(
            { name: 'Кинуть кубик', value: '!dice', inline: false },
            { name: 'Узнать свой уровень', value: '!level', inline: false },
            { name: 'Бесполезная команда', value: '!ping', inline: false },
            { name: 'Узнать игровую дату', value: '!time', inline: false },
            { name: 'Получить рандомного персонажа для игры', value: '!random', inline: false },
            { name: 'Поставить песню в очередь', value: '!play url (принимаются только ссылки из youtube)', inline: false },
            { name: 'Пропустить песню', value: '!skip', inline: false },
            { name: 'Прекратить воспроизведение музыки', value: '!stop', inline: false },
        );

    if (user == 'admin') {
        embedArr.push(adminEmbed, gmEmbed, moderEmbed, userEmbed)
        return embedArr;
    }
    if (user == 'gm') {
        embedArr.push(gmEmbed, moderEmbed, userEmbed);
        return embedArr;
    }
    if (user == 'moder') {
        embedArr.push(moderEmbed, userEmbed);
        return embedArr;
    }
    if (user == 'justUser') {
        embedArr.push(userEmbed);
        return embedArr;
    }
    else { return; }
}

function sendHelp(message) {
    let embeds = createEmbed(message);
    for (let i = 0; i < embeds.length; i++) {
        message.author.send(embeds[i]);
    }

}



export default {
    name: "help",
    aliases: ["помощь"],
    description: "Выводит команды роли",
    guildOnly: true,
    memberpermissions: "VIEW_CHANNEL",
    adminPermOverride: true,
    cooldown: 60,
    usage: "<!help>",
    execute(message, args) {
        sendHelp(message);
    },
};