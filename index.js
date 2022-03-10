const TelegramApi = require('node-telegram-bot-api');

const token = '5184874668:AAFWAqkGVVfE-N6eKMQiMByIpQ5xgLZRub0';

const bot = new TelegramApi(token, {polling: true});

const chats = {};
const { gameOptions, againOptions } = require('./options')


bot.setMyCommands([
    {command: '/start', description: 'Привітання'},
    {command: '/info', description: 'Інформація щодо вас'},
    {command: '/game', description: 'Весела гра'},
])

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Пропоную зіграти в просту гру. Я загадую тобі число від 1 до 9, а тобі тре вгадать. Якщо вгадуєш, від життя путіна віднімається стільки ж днів. Бажаю вгадувати частіше)`)
    const randomNum = Math.floor(Math.random() * 9);
    chats[chatId] = randomNum;
    await bot.sendMessage(chatId, 'Відгадуй!', gameOptions);
}

const start = async () => {
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if(text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/6d1/469/6d146963-fb36-33f4-b750-61b93b0b799a/2.webp')
            return bot.sendMessage(chatId, `Путін хуйло, все буде Україна. Вітаю у цьому тестовому телеграм боті`)
        }

        if(text === '/info') {
            return bot.sendMessage(chatId, `Вас звать ${msg.from.first_name} ${msg.from.last_name}`)
        }

        if(text === '/game') {
            return startGame(chatId);
        }

        return bot.sendMessage(chatId, `Ти шо, ретард?`)
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if(data === '/again') {
            return startGame(chatId);
        }
        if(data == chats[chatId]) {
            return bot.sendMessage(chatId, `Ти вгадав! хуйло проживе на ${chats[chatId]} днів менше!`, againOptions)
        } else {
            return bot.sendMessage(chatId, `Нажаль ти не вгадав, бот загадав цифру ${chats[chatId]}. Сробуй ще раз, бо путін повинен поскоріше здохнути!`, againOptions)
        }



    })
}

start()