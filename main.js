const TelegramBot = require('node-telegram-bot-api');
const puppeteer = require('puppeteer');

const token = '7715514174:AAGk4TTEyFHRidw2KxkcYVbcgE9XiR9dHkE';
const bot = new TelegramBot(token, {polling:true});

let Data = new Map();
let DataBalance = new Map();
let TimeData;

let Balance;

let TypeSearch;
let TypeSearchReply;
let Predmet;
let Theme;
let Variant;
let NumVariant;

// Data
function SaveData(userId, data) {
    Data.set(userId, data);
}

function GetData(userId) {
    return Data.get(userId);
}

// Balance
function SaveBalance(userId, data) {
    DataBalance.set(userId, data);
}

function GetBalance(userId) {
    return DataBalance.get(userId);
}

// Start
bot.onText(/\/start/, (msg) => {
    TimeData = GetData(msg.chat.id);

    if (TimeData === `${msg.from.username}, ${msg.chat.id}`) {
        bot.sendMessage(msg.chat.id, `Здравствуйте, ${msg.from.first_name}!\n\n<i><b>Ваш аккаунт:\n/account</b></i>`, {parse_mode:'HTML'});
    }
    else {
        SaveData(msg.chat.id, `${msg.from.username}, ${msg.chat.id}`);
        SaveBalance(msg.chat.id, '1');
        bot.sendMessage(msg.chat.id, `Здравствуйте, ${msg.from.first_name}!\n\nМы предоставляем вам возможность поиска ответов для учёбы за <i><b>низкую плату</b></i>!\n\n<i><b>Ваш аккаунт успешно создан:\n/account</b></i>`, {parse_mode:'HTML'});
    }
});

// Account
bot.onText(/\/account/, (msg) => {
    const button1 = {
        inline_keyboard: [
            [{text: 'Начать поиск', callback_data: "search"}],
            [{text: 'Пополнить баланс', callback_data: "buy"}],
            [{text: 'Добровольное пожертвование', callback_data: "freebuy"}]
        ]
    };
    const button2 = {
        inline_keyboard: [
            [{text: 'Своя сумма', callback_data: "own_amount"}],
            [{text: 'Сыщик на 1 месяц', callback_data: "search_1month"}],
            [{text: 'Сыщик на 2 месяца', callback_data: "search_2month"}],
            [{text: 'Сыщик на 3 месяца', callback_data: "search_3month"}]
        ]
    };

    TimeData = GetData(msg.chat.id);
    Balance = GetBalance(msg.chat.id);

    if (TimeData === `${msg.from.username}, ${msg.chat.id}`) {
        bot.sendMessage(msg.chat.id, `Здравствуйте, ${msg.from.first_name} (@${msg.from.username})!\n\nЭто ваш личный кабинет, здесь вы можете управлять своим аккаунтом.\n\n<code>Баланс: ${Balance} (количество поисков)</code>`, {parse_mode:'HTML', reply_markup:button1});
    }
    else {
        bot.sendMessage(msg.chat.id, '<i><b>Для создания аккаунта используйте:\n/start</b></i>', {parse_mode:'HTML'});
    }

    bot.on('callback_query', (query) => {
        // Search
        if (query.data === 'search') {
            bot.sendMessage(query.message.chat.id, '<b>Временно недоступно. Приносим извинения.</b>', {parse_mode:'HTML'});
        }

        // Buy
        else if (query.data === 'buy') {
            bot.sendMessage(query.message.chat.id, '<b>Временно недоступно. Приносим извинения.</b>', {parse_mode:'HTML'});
        }

        // Free Buy
        else if (query.data === 'freebuy') {
            let prices = [{label: 'Добровольное пожертвование', amount: 1}];

            bot.sendInvoice(query.message.chat.id, 'Добровольное пожертвование', 'Для тех, кому не жалко поддержвать проект. Чтобы отправить свою сумму, в следующем сообщении отправьте число, сумму которого хотите пожертвовать', 'freebuy', '', 'XTR', prices, {
                protect_content: true
            });

            bot.on('message', (msg) => {
                if (isNaN(msg.text) === false) {
                    prices = [{label: 'Добровольное пожертвование', amount: msg.text}];

                    bot.sendInvoice(msg.chat.id, 'Добровольное пожертвование', 'Для тех, кому не жалко поддержвать проект. Чтобы отправить свою сумму, в следующем сообщении отправьте число, сумму которого хотите пожертвовать', 'freebuy', '', 'XTR', prices, {
                        protect_content: true
                    });
                }
            });
        }
    });
});

//bot.onText(/\/about/, (msg) => {
    //bot.sendMessage(msg.chat.id, '');
//});

console.log('> Successful start');

// ***

// const prices = [{label: 'Подписка', amount: 30}];

// bot.sendInvoice(msg.chat.id, 'Сыщик на 1 месяц', 'Доступ к поиску ответов на 1 месяц', 'search_month', '', 'XTR', prices, {
// });


///////
///////


//let TypeSearch;
//let TypeSearchReply;
//let Predmet;
//let Theme;
//let Variant;
//let NumVariant;


// Search
bot.onText(/\/test4145/, (msg) => {
    const button1 = {
        inline_keyboard: [
            [{text: 'Ответы на контрольную работу', callback_data: 'typesearch-kontrolnaya'}],
            [{text: 'ГДЗ', callback_data: 'typesearch-gdz'}]
        ]
    }
    const button2 = {
        reply_markup: {
            inline_keyboard: [
                [{text: ''}]
            ]
        }
    }

    bot.sendMessage(msg.chat.id, `<i><b>Опция: поиск</b></i>\n\n<b>Для того чтобы выбрать конфигурацию, вам потребуется нажмить кнопки под полем ввода. В каждой строке есть несколько кнопок. Каждая строка с кнопками - выбор в конфигурации.</b>\n\n<b>Конфигурация:</b>\n<code>• Тип поиска: не указано\n• Тип поиска ответов: не указано</code>\n<code>• Предмет: не указано</code>\n\n<b>Для начала выберите:</b>`, {parse_mode:'HTML', reply_markup:button1});

    bot.editMessageReplyMarkup(button2.reply_markup, {
        chat_id: ,
        message_id:
    });
});