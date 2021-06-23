import { Client, Collection, TextChannel } from 'discord.js';
import config from './configuration.js';
import * as fs from 'fs';
import { checkPerm } from './service/checkperm.js';
import { guildMemberUpdate, memberRemove, newMemberJoin } from './service/memberControl.js';
import { getArguments } from './service/getArguments.js';
import { checkMessage, messageDelete, messageUpdate } from './service/checkMessage.js';
import { xpControl } from './service/levelSystem.js';
import { EROFS } from 'constants';
import moment from 'moment';
export const client = new Client();
client.commands = new Collection();

// export переменных
export let msg;
export let memberPerm;
export const hubID = '789579914869080074'; //Заменить ID 787699629944864839 на 789579914869080074
export let logChannel;
/**
 * @type {TextChannel}
 */
export let gameChannel;
/**
 * @type {TextChannel}
 */
export let warnChannel;


// Обработчик команд
const modulePromises = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const fileName = `./commands/${file}`;
  modulePromises.push(import(fileName)
    .then(module => client.commands.set(module.default.name, module.default))
    .catch(console.error));
}

const cooldowns = new Collection();

// On Ready
client.once('ready', () => {
  if (client.user.username != 'A.I Covenant') {
    client.user.setUsername('A.I Covenant');
    moment.locale('ru');
  }
  console.log('Ready!');
  let findGuild = client.guilds.cache.find(guild => guild.id === hubID);
  logChannel = findGuild.channels.cache.find(channel => channel.id === '799306126159773726'); //заменить на log Хаба #ff0000 796835391113658479 на 799306126159773726
  gameChannel = findGuild.channels.cache.find(channel => channel.id === '796803203835887657'); //заменить на game Хаба #ff0000 796835391113658479 на 796803203835887657
  warnChannel = findGuild.channels.cache.find(channel => channel.id === '800767106748121118'); // заменить на канал предупреждений в хабе #ff0000 796835391113658479 на 800767106748121118

});

// On Message
client.on('message', message => {
  if (message.author.bot)
    return;
  if (!message.guild) {
    message.reply('Я не работаю в личных сообщениях');
    return;
  }


  // Блок выполнения сторонних функций
  try {
    memberPerm = checkPerm(message);
    msg = message;
    checkMessage(message);
    xpControl(message);
  }
  catch (error) {
    console.error('Error occured during guild member management exectuion', error);
    return;
  }


  if (!message.content.startsWith(config.prefix) || message.author.bot) return;

  try {
    const args = getArguments(message.content.slice(config.prefix.length));
    const posCommandName = args.shift();
    const commandName = posCommandName.toLowerCase();
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    // Проверка на существование команды
    if (!command) return;


    // Проверка аргументов
    if (command.args && !args.length) {
      let reply = `Нету аргрументов!, ${message.author}!`;

      if (command.usage) {
        reply += `\nПравильно использовать так: \`${config.prefix}${command.name} ${command.usage}\``;
      }

      return message.channel.send(reply);
    }

    // Проверка задержки
    if (!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new Collection());
    }


    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;


    // Убирает задержку для Администратора
    if (memberPerm.hasPermission('ADMINISTRATOR')) {
      timestamps.delete(message.author.id), cooldownAmount
    }

    // Проверяет наличие прав
    if (!memberPerm.hasPermission(command.memberpermissions)) {
      message.reply(`Недостаточно прав!`);
      return;
    }


    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
      if (now < expirationTime) {
        // Если время ещё не прошло
        const timeLeft = (expirationTime - now) / 1000;
        return message.reply(`Пожалуйста подождите ещё ${timeLeft.toFixed(1)} секунд перед тем как использовать \`${command.name}\`.`);
      }
    }


    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    // Ошибка
    try {
      command.execute(message, args);
    } catch (error) {
      console.error('Error occured during command execution', error);
      message.reply('При попытке выполнить команду произошла ошибка!');
    }
  } catch (error) {
    console.error('Error occured on checking requirements for command execution', error);
    return;
  }
});

client.on('guildMemberAdd', (member) => {
  // Инициализация нового пользователя
  newMemberJoin(member);
});
// Пользователь покинул сервер
client.on('guildMemberRemove', (member) => {
  memberRemove(member);
});

client.on('messageDelete', (message) => {
  messageDelete(message);
});
client.on('messageUpdate', (oldMessage, newMessage) => {
  messageUpdate(oldMessage, newMessage);
});
client.on('guildMemberUpdate', (oldMember, newMember) => {
  guildMemberUpdate(oldMember, newMember);
});


Promise.all(modulePromises)
  .then(() => client.login(config.token))
  .catch(console.error);

process.on('uncaughtException', error => {
  console.error("Uncaught exception occured.", error);
  process.exit(1);
});