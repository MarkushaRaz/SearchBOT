const TelegramBot = require('node-telegram-bot-api');
const puppeteer = require('puppeteer');

const token = '7715514174:AAHcby70BM39h8B4V5YkGb_MaiK2CfT2_ik';
const bot = new TelegramBot(token, {polling:true});

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, `Здравствуйте, ${msg.from.first_name}!\nМы предоставляем вам возможность пранка.\n`);
});

console.log('> Successful start');