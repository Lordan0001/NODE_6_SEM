const TelegramApi = require('node-telegram-bot-api')

const token = 'token'

const bot = new TelegramApi(token, { polling: true })

bot.on('message', async msg => {
    console.log(msg)
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === '/start') {
        return bot.sendMessage(chatId, `Добро пожаловать в телеграmm бот ${msg.chat.username}`);
    }
    else if (text.toLowerCase() === 'манул') {
        const stickerUrl =
            'https://tlgrm.ru/_/stickers/f47/213/f4721376-2227-49b9-be66-5a295aa03b02/2.webp';
        await bot.sendSticker(chatId, stickerUrl);
    }
    else if (text.toLowerCase() === 'лучший рокер эвер') {
        const stickerUrl =
            'https://tlgrm.ru/_/stickers/10c/d72/10cd7214-ee04-3bff-8ddc-ca193958ce88/96/16.webp';
        await bot.sendSticker(chatId, stickerUrl);
    }
    else if (text.toLowerCase() === 'slipknot') {
        const stickerUrl =
            'https://stickerswiki.ams3.cdn.digitaloceanspaces.com/Slipknot/366613.512.webp';
        await bot.sendSticker(chatId, stickerUrl);
    }

    else
     {
        await bot.sendMessage(chatId, `echo: ${text}`)
    }
})
