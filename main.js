const TelegramBot = require('node-telegram-bot-api');
const puppeteer = require('puppeteer');

const token = '7715514174:AAGk4TTEyFHRidw2KxkcYVbcgE9XiR9dHkE';
const bot = new TelegramBot(token, {polling:true});

let Data = new Map();

let TimeData;

function SaveData(userId, data) {
    Data.set(userId, data);
}

function GetData(userId) {
    return Data.get(userId);
}

bot.onText(/\/start/, (msg) => {
    TimeData = GetData(msg.chat.id);

    if (TimeData === `${msg.from.username}, ${msg.chat.id}`) {
        bot.sendMessage(msg.chat.id, `Здравствуйте, ${msg.from.first_name}!\n\n<i><b>Ваш аккаунт:\n/account</b></i>`, {parse_mode:'HTML'});
    }
    else {
        SaveData(msg.chat.id, `${msg.from.username}, ${msg.chat.id}`);
        bot.sendMessage(msg.chat.id, `Здравствуйте, ${msg.from.first_name}!\n\nМы предоставляем вам возможность поиска ответов для учёбы за <i><b>низкую плату</b></i>!\n\n<i><b>Ваш аккаунт успешно создан:\n/account</b></i>`, {parse_mode:'HTML'});
    }
});

// Account
bot.onText(/\/account/, (msg) => {
    const button1 = {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Начать поиск', callback_data: "search"}],
                [{text: 'Пополнить баланс', callback_data: "buy"}],
                [{text: 'Добровольное пожертвование', callback_data: "freebuy"}]
            ]
        }
    };
    const button2 = {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Своя сумма', callback_data: "own_amount"}],
                [{text: 'Сыщик на 1 месяц', callback_data: "search_1month"}],
                [{text: 'Сыщик на 2 месяца', callback_data: "search_2month"}],
                [{text: 'Сыщик на 3 месяца', callback_data: "search_3month"}]
            ]
        }
    };

    TimeData = null;
    TimeData = GetData(msg.chat.id);

    if (TimeData === `${msg.from.username}, ${msg.chat.id}`) {
        bot.sendMessage(msg.chat.id, `Здравствуйте, ${msg.from.first_name} (@${msg.from.username})!\n\nЭто ваш личный кабинет, здесь вы можете управлять своим аккаунтом.\n\n`, button1);
    }
    else {
        bot.sendMessage(msg.chat.id, '<i><b>Для создания аккаунта используйте:\n/start</b></i>', {parse_mode:'HTML'});
    }

    bot.on('callback_query', (query) => {
        if (query.data === 'search') {
            bot.sendMessage(query.message.chat.id, '<b>Временно недоступно. Приносим извинения.</b>', {parse_mode:'HTML'});
        }
        else if (query.data === 'buy') {
            bot.sendMessage(query.message.chat.id, '<b>Временно недоступно. Приносим извинения.</b>', {parse_mode:'HTML'});
        }
        else if (query.data === 'freebuy') {
            bot.sendMessage(query.message.chat.id, 'Для использования этой функции, используйте команду /freebuy');
        }
    });
});

// Search
bot.onText(/\/search/, (msg) => {});

// Buy
bot.onText(/\/buy/, (msg) => {});

// Free Buy
bot.onText(/\/freebuy/, (msg) => {
    const prices = [{label: 'Добровольное пожертвование', amount: 1}];

    bot.sendInvoice(msg.chat.id, 'Добровольное пожертвование', 'Для тех, кому не жалко поддержвать проект. Чтобы отправить свою сумму, в следующем сообщении отправьте число, сумму которого хотите пожертвовать', 'freebuy', '', 'XTR', prices, {
        protect_content: true
    });

    bot.on('message', (msg) => {});
});

console.log('> Successful start');

// ***

// const prices = [{label: 'Подписка', amount: 30}];

// bot.sendInvoice(msg.chat.id, 'Сыщик на 1 месяц', 'Доступ к поиску ответов на 1 месяц', 'search_month', '', 'XTR', prices, {
// });