const TelegramBot = require('node-telegram-bot-api');
const puppeteer = require('puppeteer');

const token = '7715514174:AAGk4TTEyFHRidw2KxkcYVbcgE9XiR9dHkE';
const bot = new TelegramBot(token, {polling:true});

let Data = new Map();

let TimeData;

function SaveData(userId, data) {
    Data.set(userId, data)
}

function GetData(userId) {
    return Data.get(userId);
}

bot.onText(/\/start/, (msg) => {
    TimeData = GetData(msg.chat.id);

    if (TimeData === `${msg.from.username}, ${msg.chat.id}`) {

    }
    SaveData(msg.chat.id, `${msg.from.username}, ${msg.chat.id}`);

    bot.sendMessage(msg.chat.id, `Здравствуйте, ${msg.from.first_name}!\n\nМы предоставляем вам возможность поиска ответов для школы.`);
});

bot.onText(/\/account/, (msg) => {});

bot.onText(/\/list/, () => {});

console.log('> Successful start');