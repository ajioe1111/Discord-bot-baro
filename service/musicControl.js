import * as Discord from 'discord.js';
import { client } from '../bot.js';
import ytdl from 'ytdl-core';
import { getArguments } from './getArguments.js';
import AsyncLock from 'async-lock';

/**
 * @type {Array<String>}
 */
const queue = [];
const queueLock = new AsyncLock();
const enqueue = (item) => queue.push(item);
const dequeue = () => queue.shift();
const voiceChannelId = '851136379353038848';
const textChannelId = '851136274043371540';

const CONTROLS_LOCK = 'music-controls';

/**
 * @type {Discord.VoiceConnection}
 */
let voiceConnection = undefined;


/**
 * 
 * @returns {Promise<Discord.VoiceConnection>} 
 */
async function createVoiceConnection() {
    if (voiceConnection)
        return voiceConnection;

    const channel = getVoiceChannel();

    voiceConnection = await channel.join();
    voiceConnection.on("error", closeVoiceConnection);
    voiceConnection.on("disconnect", closeVoiceConnection);
    voiceConnection.on("failed", closeVoiceConnection);

    return voiceConnection;
}

/** 
 * 
 * @param {Error} error 
 */
function closeVoiceConnection(error) {
    if (error)
        console.error(error);

    const channel = getVoiceChannel();
    channel.leave();

    voiceConnection = undefined;
}

/**
* @return {Discord.VoiceChannel}
*/
function getVoiceChannel() {
    const channel = client.channels.resolve(voiceChannelId);
    if (!channel || !channel.joinable)
        throw new Error("Channel is not found or is not joinable");

    return channel;
}

/**
* @return {Discord.TextChannel}
*/
function getTextChannel() {
    /**
     * @type {Discord.TextChannel}
     */
    const channel = client.channels.resolve(textChannelId);
    if (!channel)
        throw new Error("Channel is not found");

    return channel;
}


/**
 * V dusshe ne ebu chto za info
 * @param {string} info 
 */
async function onMediaStreamFinish(info) {
    const nextTrackUrl = dequeue();
    if (nextTrackUrl) {
        await setMediaStream(nextTrackUrl);
    }
    else {
        closeVoiceConnection();
    }
}

async function setMediaStream(url) {
    if (!voiceConnection)
        throw new Error("Voice connection is undefined or not initialized");

    const mediaStream = ytdl(url, { filter: 'audioonly' });
    const dispatcher = voiceConnection.play(mediaStream);
    dispatcher.on('finish', async () => await onMediaStreamFinish());

    const channel = getTextChannel();
    const sosi = await ytdl.getInfo(url);
    const embedMessage = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setTitle(`🎵 Сейчас играет ${sosi.videoDetails.title} 🎵`)
        .setAuthor(sosi.videoDetails.author.name, sosi.videoDetails.author.thumbnails[0].url, sosi.videoDetails.video_url)
        .setURL(sosi.videoDetails.video_url)
        .addFields(
            { name: 'Лайков ❤', value: sosi.videoDetails.likes, inline: true },
            { name: 'Дизлайков 💔', value: sosi.videoDetails.dislikes, inline: true },
            { name: 'Просмотров 👀', value: sosi.videoDetails.viewCount, inline: true },
        );

    await channel.send(embedMessage);
}

/**
 * 
 * @param {Discord.Message} message 
 */
async function playInternal(message, args) {
    const voiceConnection = await createVoiceConnection();
    const url = args[0];
    let isValid = await ytdl.validateURL(url);
    let videoInfo = await ytdl.getBasicInfo(url);
    isValid &= !videoInfo.videoDetails.isPrivate;
    if (!isValid) {
        message.reply('Некоректная ссылка!');
        return;
    }
    if (voiceConnection.dispatcher) {
        enqueue(url);
    }
    else {
        await setMediaStream(url);
    }
}

function skipInternal() {
    if (voiceConnection && voiceConnection.dispatcher)
        voiceConnection.dispatcher.end();
}

function stopInternal() {
    queue.length = 0;
    if (voiceConnection && voiceConnection.dispatcher)
        voiceConnection.dispatcher.end();
}

export async function play(message, args) {
    if (message.channel.id != textChannelId) {
        message.reply(`Я выполняю команды только в <#${textChannelId}>`)
        return;
    }
    await queueLock.acquire(CONTROLS_LOCK, async () => await playInternal(message, args));
}

export async function skip() {
    await queueLock.acquire(CONTROLS_LOCK, () => skipInternal());
}

export async function stop() {
    await queueLock.acquire(CONTROLS_LOCK, () => stopInternal());
}
