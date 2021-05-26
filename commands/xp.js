import * as Discord from 'discord.js'
import { xpAdd, xpRemove } from '../service/levelSystem.js';


/**
 * 
 * @param {Discord.Message} message 
 */
export function mentionsUsers(message, args) {
    const channel = message.channel;
    let addCount = Number(args[1]);
    let mentions = message.mentions.users;
    let userId = mentions.map(user => user.id);
    switch (args[0]) {
        case 'add':
            xpAdd(addCount, userId, channel);
            break;
        case 'remove':
            xpRemove(addCount, userId, channel);
            break;
        default:
            message.reply('Ошибка ввода!\nПример команды: !xp `add`|`remove` @user @user @user');
    }
    
}


export default {
    name: "xp",
    guildOnly: true,
    memberpermissions: "PRIORITY_SPEAKER",
    execute(message, args) {
       mentionsUsers(message, args);
    },
};