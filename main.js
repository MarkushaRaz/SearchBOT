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
        reply_markup: {
            inline_keyboard: [
                [{text: 'Ответы на контрольную работу', callback_data: 'typesearch-kontrolnaya'}],
                [{text: 'ГДЗ', callback_data: 'typesearch-gdz'}]
            ]
        }
    };
    const button2 = {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Математика', callback_data: 'math'}],
                [{text: 'Алгебра', callback_data: 'algebra'}],
                [{text: 'Геометрия', callback_data: 'geometry'}],
                [{text: 'Русский язык', callback_data: 'ruslang'}],
                [{text: 'Английский язык', callback_data: 'englang'}],
                [{text: 'Физика', callback_data: 'physics'}]
            ]
        }
    };
    const button3 = {
        reply_markup: {
            inline_keyboard: [
                [{text: '1', callback_data: '1'}, {text: '2', callback_data: '2'}],
                [{text: '3', callback_data: '3'}, {text: '4', callback_data: '4'}],
                [{text: '5', callback_data: '5'}, {text: '6', callback_data: '6'}]
            ]
        }
    };
    const button4 = {
        reply_markup: {
            inline_keyboard: [
                [{text: '1', callback_data: '1'}, {text: '2', callback_data: '2'}],
                [{text: '3', callback_data: '3'}, {text: '4', callback_data: '4'}],
                [{text: '5', callback_data: '5'}, {text: '6', callback_data: '6'}]
            ]
        }
    };

    bot.sendMessage(msg.chat.id, `<i><b>Опция: поиск</b></i>\n\n<b>Для того чтобы выбрать конфигурацию, вам потребуется нажмить кнопки под полем ввода. В каждой строке есть несколько кнопок. Каждая строка с кнопками - выбор в конфигурации.</b>\n\n<b>Конфигурация:</b>\n<code>• Тип поиска: не указано</code>\n<code>• Предмет: не указано</code>\n\n<b>Для начала выберите:</b>`, {parse_mode:'HTML', reply_markup:button1.reply_markup})
        .then((sentMessage) => TimeData = sentMessage.message_id);
            // else if (query.data === "text" || query.data === "photo") {
            //     TypeSearchReply = query.data === "text" ? "текст" : "фото";
        
            //     bot.editMessageText(
            //         `<i><b>Опция: поиск</b></i>\n\n<b>Конфигурация:</b>\n<code>• Тип поиска: ${TypeSearch}</code>\n<code>• Тип поиска ответов: ${TypeSearchReply}</code>\n<code>• Предмет: ${Subject}</code>\n\n<b>Выберите предмет:</b>`,
            //         { parse_mode: "HTML", chat_id: chatId, message_id: TimeData, reply_markup: button3.reply_markup }
            //     );
        
            //     bot.answerCallbackQuery(query.id);
            // } else if (["math", "algebra", "geometry", "russlang", "englang", "physics"].includes(query.data)) {
            //     Subject = {
            //         math: "Математика",
            //         algebra: "Алгебра",
            //         geometry: "Геометрия",
            //         russlang: "Русский язык",
            //         englang: "Английский язык",
            //         physics: "Физика"
            //     }[query.data];
        
            //     bot.editMessageText(
            //         `<i><b>Опция: поиск</b></i>\n\n<b>Конфигурация:</b>\n<code>• Тип поиска: ${TypeSearch}</code>\n<code>• Тип поиска ответов: ${TypeSearchReply}</code>\n<code>• Предмет: ${Subject}</code>\n\n<b>Выберите номер задания:</b>`,
            //         { parse_mode: "HTML", chat_id: chatId, message_id: TimeData, reply_markup: button4.reply_markup }
            //     );
        
            //     bot.answerCallbackQuery(query.id);
            // } else if (["1", "2", "3", "4", "5", "6"].includes(query.data)) {
            //     bot.editMessageText(
            //         `<i><b>Опция: поиск</b></i>\n\n<b>Конфигурация:</b>\n<code>• Тип поиска: ${TypeSearch}</code>\n<code>• Тип поиска ответов: ${TypeSearchReply}</code>\n<code>• Предмет: ${Subject}</code>\n<code>• Номер задания: ${query.data}</code>\n\n✅ <b>Настройки завершены!</b>`,
            //         { parse_mode: "HTML", chat_id: chatId, message_id: TimeData }
            //     );
        
            //     bot.answerCallbackQuery(query.id);
            // } else {
            //     bot.answerCallbackQuery(query.id, { text: "Ошибка! Неверная кнопка.", show_alert: true });
            // }
        // });
// });

    bot.on("callback_query", (query) => {
        // Type search
        if (query.data === "typesearch-kontrolnaya") {
            TypeSearch = "контрольная работа";

            bot.editMessageText(`<i><b>Опция: поиск</b></i>\n\n<b>Конфигурация:</b>\n<code>• Тип поиска: ${TypeSearch}</code>\n<code>• Предмет: не указано</code>\n<code>• Тема: не указано</code>\n<code>• Количество вариантов (необязательно): не указано</code>\n<code>• Сколько вариантов прислать?: не указано</code>\n\n<b>Выберите тип ответа:</b>`, {
                parse_mode:'HTML',
                chat_id:query.message.chat.id,
                message_id:TimeData,
                reply_markup:button2.reply_markup
            });
        }
        else if (query.data === "typesearch-gdz") {
            TypeSearch = "гдз";

            bot.editMessageText(`<i><b>Опция: поиск</b></i>\n\n<b>Конфигурация:</b>\n<code>• Тип поиска: ${TypeSearch}</code>\n<code>• Предмет: не указано</code>\n<code>• Номер задания: не указано</code>\n<code>• Сколько решений прислать?: не указано</code>\n\n<b>Выберите тип ответа:</b>`, {
                parse_mode:'HTML',
                chat_id:query.message.chat.id,
                message_id:TimeData,
                reply_markup:button2.reply_markup
            });
        }

        // Predmet
        else if (query.data === "math") {
            TypeSearch = "математика";

            bot.editMessageText(`<i><b>Опция: поиск</b></i>\n\n<b>Конфигурация:</b>\n<code>• Тип поиска: ${TypeSearch}</code>\n<code>• Предмет: не указано</code>\n<code>• Номер задания: не указано</code>\n<code>• Сколько решений прислать?: не указано</code>\n\n<b>Выберите тип ответа:</b>`, {
                parse_mode:'HTML',
                chat_id:query.message.chat.id,
                message_id:TimeData,
                reply_markup:button3.reply_markup
            });
        }
    });
});

// Control

//let TypeSearch;
//let Predmet;
//let Theme;
//let Variant;
//let NumVariant;

// Gdz

//let TypeSearch;
//let Predmet;
//let Task;
//let TaskNum;