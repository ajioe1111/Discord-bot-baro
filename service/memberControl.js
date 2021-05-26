
import * as Discord from 'discord.js'
import * as fs from 'fs'
import { client, hubID, logChannel } from '../bot.js'



/**
 * 
 * @param {Discord.GuildMember} member 
 */
export function newMemberJoin(member) {
    const findGuild = client.guilds.cache.find(guild => guild.id === member.guild.id);
    const botlog = findGuild.channels.cache.find(botlog => botlog.name === 'botlog');
    const database = JSON.parse(fs.readFileSync("./list.json"));
    let userIndex = database.users_list.findIndex(user => user.id == member.id);
    //Если member зашел в хаб
    if (member.guild.id == hubID) {
        member.roles.add(database.server_list[0].default_role);
        //Если member = -1 то создай запись
        if (userIndex === -1) {
            const user = {
                id: member.id,
                username: member.user.username,
                properties: {
                    level: 0,
                    xp: 0,
                    warn: 0,
                    join_hub: true,
                    coin: 0,
                    joinDate: member.joinedAt,
                    experienceGainDate: 0,
                    stepToCoin: 0,
                    gameLoss: 0,
                    gameWin: 0
                }
            };
            database.users_list.push(user);
            const embed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Зашел новый пользователь!')
                .setAuthor('Система авторизации', 'https://media.discordapp.net/attachments/573490270025416714/841041056182960139/favpng_flame-shield.png?width=598&height=675')
                .setDescription('*пользователя нету в базе*')
                .setThumbnail(member.user.displayAvatarURL())
                .addFields(
                    { name: 'Никнейм', value: member.user.tag, inline: false },
                    { name: 'ID', value: member.id, inline: true },
                    { name: 'Click ID', value: `<@${member.id}>`, inline: true },
                    { name: 'Avatar URL', value: member.user.displayAvatarURL(), inline: false },
                )
                .setTimestamp();
            logChannel.send(embed);
            member.send(`Добро пожаловать на *Project Baro RP!*\nКраткий экскурс по каналам:\n<#789579914869080077> - Это Главный чат проекта.\n<#809054903389519913> - Местая флудилка с мемчикамию\n<#796803203835887657> - Канал с обьявлениями об играх.\nТак же не забудьте посетить нашу Wiki https://wiki.projectbaro.ru\n Приятной игры ${member.user.username}!`);
        }
        //Если member = 1 то измени join_hub на true
        else {
            database.users_list[userIndex].properties.join_hub = true;
            const embed = new Discord.MessageEmbed()
                .setColor('#80ffff')
                .setTitle('Зашел старый пользователь')
                .setAuthor('Система авторизации', 'https://media.discordapp.net/attachments/573490270025416714/841041056182960139/favpng_flame-shield.png?width=598&height=675')
                .setDescription('*пользователь уже есть в базе. join_hub изменен на true*')
                .setThumbnail(member.user.displayAvatarURL())
                .addFields(
                    { name: member.user.tag, value: `С id ${member.id}`, inline: false },
                );

            logChannel.send(embed);
        }
        fs.writeFileSync("./list.json", JSON.stringify(database));
        return;
    }
    // Если member зашел на другой сервер вне хаба

    if (userIndex === -1 || database.users_list[userIndex].properties.join_hub === false) {

        const embed = new Discord.MessageEmbed()
            .setColor('#ff8040')
            .setTitle('Ошибка')
            .setAuthor('Система авторизации', 'https://media.discordapp.net/attachments/573490270025416714/841041056182960139/favpng_flame-shield.png?width=598&height=675')
            .setDescription('**Для входа на данный сервер вам необходимо авторизоваться в нашем хабе и оставаться в нем.**\n*Ваше приглашение действует 24 часа и может быть использовано всего один раз.*')
            .setTimestamp();

        member.send(embed);

        logChannel.createInvite({ maxAge: 86400, maxUses: 1 })
            .then(invite => member.send(`Ваша личная ссылка https://discord.gg/${invite.code}`))
            .catch(console.error);

        setTimeout(() => member.kick('Зайдите пожалуйста в хаб!'), 7000);
        return;
    }
    const joinEmbed = new Discord.MessageEmbed()
        .setColor('#ff80c0')
        .setTitle('Зашел пользователь')
        .setThumbnail(member.user.displayAvatarURL())
        .setAuthor('Система авторизации', 'https://media.discordapp.net/attachments/573490270025416714/841041056182960139/favpng_flame-shield.png?width=598&height=675')
        .addFields(
            { name: member.user.tag, value: member.id, inline: false },
            { name: 'Click ID', value: `<@${member.id}>`, inline: false },
        );
    // Ketsal
    if (member.guild.id === '796804573154115615') {
        member.roles.add(database.server_list[1].default_role);
        botlog.send(joinEmbed);
        return;
    }
    // Alliance
    if (member.guild.id === '789580508090597396') {
        member.roles.add(database.server_list[2].default_role);
        botlog.send(joinEmbed);
        return;
    }
    // Ursus
    if (member.guild.id === '799302316984762438') {
        member.roles.add(database.server_list[3].default_role);
        botlog.send(joinEmbed);
        return;
    }

}

/**
 * 
 * @param {Discord.GuildMember} member 
 */
export function memberRemove(member) {
    const findGuild = client.guilds.cache.find(guild => guild.id === member.guild.id);
    const botlog = findGuild.channels.cache.find(botlog => botlog.name === 'botlog');
    const database = JSON.parse(fs.readFileSync("./list.json"));
    let userIndex = database.users_list.findIndex(user => user.id == member.id);
    if (member.guild.id === hubID) {
        let id = member.id;
        database.users_list[userIndex].properties.join_hub = false;
        fs.writeFileSync("./list.json", JSON.stringify(database));
        client.guilds.cache.forEach((guild) => {
            let member = guild.members.cache.find(member => member.id === id);
            if (member) {
                member.kick({ reason: `Выход из хаба` })
            }
        });
        const embed = new Discord.MessageEmbed()
            .setColor('#f80000')
            .setTitle('Пользователь вышел')
            .setAuthor('Система авторизации', 'https://media.discordapp.net/attachments/573490270025416714/841041056182960139/favpng_flame-shield.png?width=598&height=675')
            .setDescription('*пользователь покинул хаб и был кикнут из других серверов*')
            .setThumbnail(member.user.displayAvatarURL())
            .addFields(
                { name: 'Никнейм', value: member.user.tag, inline: false },
                { name: 'ID', value: member.id, inline: true },
                { name: 'Click ID', value: `<@${member.id}>`, inline: true },
                { name: 'Avatar URL', value: member.user.displayAvatarURL(), inline: false },
            )
            .setTimestamp();
        logChannel.send(embed);
        return;
    }
    else {
        const removeEmbed = new Discord.MessageEmbed()
            .setColor('#400000')
            .setTitle('Пользователь вышел')
            .setThumbnail(member.user.displayAvatarURL())
            .setAuthor('Система авторизации', 'https://media.discordapp.net/attachments/573490270025416714/841041056182960139/favpng_flame-shield.png?width=598&height=675')
            .addFields(
                { name: member.user.tag, value: member.id, inline: false },
                { name: 'Click ID', value: `<@${member.id}>`, inline: false },
            );

        botlog.send(removeEmbed);
        return;
    }
}

/**
 * 
 * @param {Discord.GuildMember} oldMember 
 * @param {Discord.GuildMember} newMember 
 */
export function guildMemberUpdate(oldMember, newMember) {
    const guild = oldMember.guild;
    const botlog = guild.channels.cache.find(memberGuild => memberGuild.name == 'botlog');
    if (newMember.nickname != oldMember.nickname) {
        const embed = new Discord.MessageEmbed()
            .setColor('#ff80ff')
            .setAuthor('Система контроль', 'https://media.discordapp.net/attachments/573490270025416714/841041056182960139/favpng_flame-shield.png?width=598&height=675')
            .setTitle('Юзер поменял ник!')
            .setDescription(`${newMember}\nС **${oldMember.displayName}** НА **${newMember.displayName}**`)
            botlog.send(embed);
    }
    
}