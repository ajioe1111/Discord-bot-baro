import * as Discord from 'discord.js'
import { client, hubID } from '../bot.js';
import * as fs from 'fs'


/**
 * 
 * @param {Discord.Message} message 
 */
function checkOwner(message) {
    if (message.author.id === '333660691644809216') {
        const database = JSON.parse(fs.readFileSync("./list.json"));
        let findGuild = client.guilds.cache.find(guild => guild.id === hubID)
        let arrMembers = findGuild.members.cache.map(guildMember => guildMember.id);
        let memberName = findGuild.members.cache.map(guildMember => guildMember.user.username);
        let memberJoinDate = findGuild.members.cache.map(guildMember => guildMember.joinedAt);
        for (let i = 0; i < arrMembers.length; i++) {
            let userIndex = database.users_list.findIndex(user => user.id == arrMembers[i]);
            if (userIndex === -1) {
                const user = {
                    id: arrMembers[i],
                    username: memberName[i],
                    properties: {
                        level: 0,
                        xp: 0,
                        warn: 0,
                        join_hub: true,
                        coin: 0,
                        joinDate: memberJoinDate[i]
                    }
                }
                database.users_list.push(user);
            };
            fs.writeFileSync("./list.json", JSON.stringify(database));
        };
    }
    else {
        message.reply('Эта команда доступна лишь владельцу бота!');
        return;
    }
}

export default {
    name: "initmembers",
    aliases: ["initmembers", "init"],
    guildOnly: true,
    memberpermissions:"ADMINISTRATOR",
    execute(message) {
        checkOwner(message);
    },
};