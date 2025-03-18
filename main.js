const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

const AItoken = 'dBydQ6XjXyIs5y2lJWcuEjxGTMdaUmta';
const token = '8107145779:AAGmqNdTHKGsLTb0qKMVsIvXOZsvhzj4l1E';
const bot = new TelegramBot(token, {polling:true});

let Data = GetData();
let TimeData;

let TypeSearch;
let Question;
let Klass = {
    klass1:'1 класс',
    klass2:'2 класс',
    klass3:'3 класс',
    klass4:'4 класс',
    klass5:'5 класс',
    klass6:'6 класс',
    klass7:'7 класс',
    klass8:'8 класс',
    klass9:'9 класс',
    klass10:'10 класс',
    klass11:'11 класс'
};
let Predmet = {
    math:'Математика',
    algebra:'Алгебра',
    geometry:'Геометрия',
    ruslang:'Русский язык',
    englang:'Английский язык',
    physics:'Физика'
};
let Theme;
let Variant = {
    variant1:'1 вариант',
    variant2:'2 вариант',
    variant3:'3 вариант',
    variant4:'4 вариант',
    variant5:'5 вариант',
    variant6:'6 вариант'
};

// Data
function SaveData(data) {
    fs.writeFileSync('Data.json', JSON.stringify(data, null, 2), 'utf8');
}

function GetData() {
    if (fs.existsSync('Data.json')) {
        const data = fs.readFileSync('Data.json', 'utf8');
        return JSON.parse(data);
    }
    return {};
}

// Search
async function Search(chatId) {
    const url = "https://api.mistral.ai/v1/chat/completions";

    const question = TypeSearch + " " + Klass + " " + Predmet + " " + Theme + " " + Variant + "ответы";

    const Request = JSON.stringify({
        model:'mistral-tiny',
        messages:[{role: 'user', content: question}]
    });

    const response = await fetch(url, {
        method:'POST',
        headers: {
            'Content-Type':'application/json',
            Authorization:`Bearer ${AItoken}`
        },
        body: Request
    });

    const data = await response.json();

    TypeSearch = null;
    Klass = {
        klass1:'1 класс',
        klass2:'2 класс',
        klass3:'3 класс',
        klass4:'4 класс',
        klass5:'5 класс',
        klass6:'6 класс',
        klass7:'7 класс',
        klass8:'8 класс',
        klass9:'9 класс',
        klass10:'10 класс',
        klass11:'11 класс'
    };
    Predmet = {
        math:'Математика',
        algebra:'Алгебра',
        geometry:'Геометрия',
        ruslang:'Русский язык',
        englang:'Английский язык',
        physics:'Физика'
    };
    Theme = null;
    Variant = {
        variant1:'1 вариант',
        variant2:'2 вариант',
        variant3:'3 вариант',
        variant4:'4 вариант',
        variant5:'5 вариант',
        variant6:'6 вариант'
    };
    
    bot.deleteMessage(chatId, TimeData);
    bot.sendMessage(chatId, data.choices[0].message.content);
}

// GetReply
async function GetReply(chatId) {
    const url = "https://api.mistral.ai/v1/chat/completions";

    const question = TypeSearch + " " + Question;

    const Request = JSON.stringify({
        model:'mistral-tiny',
        messages:[{role: 'user', content: question}]
    });

    const response = await fetch(url, {
        method:'POST',
        headers: {
            'Content-Type':'application/json',
            Authorization:`Bearer ${AItoken}`
        },
        body: Request
    });

    const data = await response.json();

    TypeSearch = null;
    Question = null;
    
    bot.deleteMessage(chatId, TimeData);
    bot.sendMessage(chatId, data.choices[0].message.content);
}

// Start
bot.onText(/\/start/, (msg) => {
    if (!Data[msg.chat.id]) {
        Data[msg.chat.id] = {
            username: msg.from.username,
            balance: 1
        };
        SaveData(Data);

        bot.sendMessage(msg.chat.id, `Здравствуйте, ${msg.from.first_name}!\n\nМы предоставляем вам возможность поиска ответов для учёбы за <i><b>низкую плату</b></i>!\n\n<i><b>Ваш аккаунт успешно создан:\n/account</b></i>`, {parse_mode:'HTML'});
    }
    else {
        bot.sendMessage(msg.chat.id, `Здравствуйте, ${msg.from.first_name}!\n\n<i><b>Ваш аккаунт:\n/account</b></i>`, {parse_mode:'HTML'});
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

    if (!Data[msg.chat.id]) {
        bot.sendMessage(msg.chat.id, '<i><b>Для создания аккаунта используйте:\n/start</b></i>', {parse_mode:'HTML'});
    }
    else {
        bot.sendMessage(msg.chat.id, `Здравствуйте, ${msg.from.first_name} (@${msg.from.username})!\n\nЭто ваш личный кабинет, здесь вы можете управлять своим аккаунтом.\n\n<code>Баланс: ${Data[msg.chat.id].balance} (количество поисков)</code>`, {parse_mode:'HTML', reply_markup:button1.reply_markup});
    }

    bot.on('callback_query', (query) => {
        // Search
        if (query.data === 'search') {
            const button1 = {
                reply_markup: {
                    inline_keyboard: [
                        [{text: 'Ответы на контрольную работу', callback_data: 'typesearch-kontrolnaya'}],
                        [{text: 'ГДЗ (временно недоступно)', callback_data: 'typesearch-gdz'}],
                        [{text: 'Решить задание', callback_data: 'typesearch-reply'}]
                    ]
                }
            };
            const button2 = {
                reply_markup: {
                    inline_keyboard: [
                        [{text: '1', callback_data: 'klass1'}, {text: '2', callback_data: 'klass2'}, {text: '3', callback_data: 'klass3'}],
                        [{text: '4', callback_data: 'klass4'}, {text: '5', callback_data: 'klass5'}, {text: '6', callback_data: 'klass6'}],
                        [{text: '7', callback_data: 'klass7'}, {text: '8', callback_data: 'klass8'}, {text: '9', callback_data: 'klass9'}],
                        [{text: '10', callback_data: 'klass10'}, {text: '11', callback_data: 'klass11'}]
                    ]
                }
            }
            const button3 = {
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
            const button4 = {
                reply_markup: {
                    inline_keyboard: [
                        [{text: '1', callback_data: 'variant1'}, {text: '2', callback_data: 'variant2'}],
                        [{text: '3', callback_data: 'variant3'}, {text: '4', callback_data: 'variant4'}],
                        [{text: '5', callback_data: 'variant5'}, {text: '6', callback_data: 'variant6'}],
                        [{text: 'Пропустить', callback_data: 'variant-skip'}]
                    ]
                }
            };
            const button5 = {
                reply_markup: {
                    inline_keyboard: [
                        [{text: 'Начать поиск', callback_data: 'search-start-kontrolnaya'}]
                    ]
                }
            }
            const button6 = {
                reply_markup: {
                    inline_keyboard: [
                        [{text: 'Начать поиск', callback_data: 'search-start-reply'}]
                    ]
                }
            }
        
            if (!Data[query.message.chat.id]) {
                bot.sendMessage(query.message.chat.id, '<b>Ошибка. Для создания аккаунта, используйте команду:\n/start</b>', {parse_mode:'HTML'});
            }
            else {
                if (Data[query.message.chat.id].balance < 1) {
                    bot.sendMessage(query.message.chat.id, '<b>Ошибка. На балансе недостаточно поисков.</b>');
                }
                else {
                    bot.sendMessage(query.message.chat.id, `<i><b>Опция: поиск</b></i>\n\nДля того чтобы выбрать конфигурацию, вам потребуется нажмить кнопки под полем ввода. В каждой строке есть несколько кнопок. Каждая строка с кнопками - выбор в конфигурации.\n\n<b>Конфигурация:</b>\n<code>• Тип поиска: не указано</code>\n<code>• Предмет: не указано</code>\n\n<b>Для начала выберите:</b>`, {parse_mode:'HTML', reply_markup:button1.reply_markup})
                        .then((sentMessage) => TimeData = sentMessage.message_id);
        
                    bot.on('callback_query', (query) => {
                        // Type search
                        if (query.data === "typesearch-kontrolnaya") {
                            TypeSearch = "контрольная работа";
        
                            bot.editMessageText(`<i><b>Опция: поиск</b></i>\n\n<b>Конфигурация:</b>\n<code>• Тип поиска: ${TypeSearch}</code>\n<code>• Класс: не указано</code>\n<code>• Предмет: не указано</code>\n<code>• Тема: не указано</code>\n<code>• Вариант (необязательно): не указано</code>\n\n<b>Выберите тип ответа:</b>`, {
                                parse_mode:'HTML',
                                chat_id:query.message.chat.id,
                                message_id:TimeData,
                                reply_markup:button2.reply_markup
                            });
                        }
        
                        else if (query.data === "typesearch-reply") {
                            TypeSearch = "Реши задание:";
        
                            bot.editMessageText(`<i><b>Опция: поиск</b></i>\n\n<b>Конфигурация:</b>\n<code>• Тип поиска: решение задания</code>\n<code>• Текст задания: не указано</code>\n\n<b>В своём следующем сообщении напишите текст задания:</b>`, {
                                parse_mode:'HTML',
                                chat_id:query.message.chat.id,
                                message_id:TimeData,
                            });
        
                            bot.on('message', (msg) => {
                                Question = msg.text;
        
                                bot.editMessageText(`<i><b>Опция: поиск</b></i>\n\n<b>Конфигурация:</b>\n<code>• Тип поиска: решение задания</code>\n<code>• Текст задания: ${Question}</code>\n\n<b>Конфигурация успешно создана!\nДля начала решения нажмите кнопку:</b>`, {
                                    parse_mode:'HTML',
                                    chat_id:query.message.chat.id,
                                    message_id:TimeData,
                                    reply_markup:button6.reply_markup
                                });
                            });
                        }
        
                        // Klass
                        else if (Klass[query.data]) {
                            Klass = Klass[query.data];
        
                            bot.editMessageText(`<i><b>Опция: поиск</b></i>\n\n<b>Конфигурация:</b>\n<code>• Тип поиска: ${TypeSearch}</code>\n<code>• Класс: ${Klass}</code>\n<code>• Предмет: не указано</code>\n<code>• Тема: не указано</code>\n<code>• Вариант (необязательно): не указано</code>\n\n<b>Выберите тип ответа:</b>`, {
                                parse_mode:'HTML',
                                chat_id:query.message.chat.id,
                                message_id:TimeData,
                                reply_markup:button3.reply_markup
                            });
                        }
        
                        // Predmet
                        else if (Predmet[query.data]) {
                            Predmet = Predmet[query.data];
        
                            bot.editMessageText(`<i><b>Опция: поиск</b></i>\n\n<b>Конфигурация:</b>\n<code>• Тип поиска: ${TypeSearch}</code>\n<code>• Класс: ${Klass}</code>\n<code>• Предмет: ${Predmet}</code>\n<code>• Тема: не указано</code>\n<code>• Вариант (необязательно): не указано</code>\n\n<b>В своём следующем сообщении напишите тему:</b>`, {
                                parse_mode:'HTML',
                                chat_id:query.message.chat.id,
                                message_id:TimeData,
                            });
        
                            bot.on('message', (msg) => {
                                Theme = msg.text;
        
                                bot.editMessageText(`<i><b>Опция: поиск</b></i>\n\n<b>Конфигурация:</b>\n<code>• Тип поиска: ${TypeSearch}</code>\n<code>• Класс: ${Klass}</code>\n<code>• Предмет: ${Predmet}</code>\n<code>• Тема: ${Theme}</code>\n<code>• Вариант (необязательно): не указано</code>\n\n<b>Выберите тип овтета:</b>`, {
                                    parse_mode:'HTML',
                                    chat_id:query.message.chat.id,
                                    message_id:TimeData,
                                    reply_markup:button4.reply_markup
                                });
                            });
                        }
        
                        // Variant (Контрольная)
                        else if (Variant[query.data]) {
                            Variant = Variant[query.data];
        
                            bot.editMessageText(`<i><b>Опция: поиск</b></i>\n\n<b>Конфигурация:</b>\n<code>• Тип поиска: ${TypeSearch}</code>\n<code>• Класс: ${Klass}</code>\n<code>• Предмет: ${Predmet}</code>\n<code>• Тема: ${Theme}</code>\n<code>• Вариант (необязательно): ${Variant}</code>\n\n<b>Конфигурация успешно создана!\nДля начала поиска нажмите кнопку:</b>`, {
                                parse_mode:'HTML',
                                chat_id:query.message.chat.id,
                                message_id:TimeData,
                                reply_markup:button5.reply_markup
                            });
                        }
        
                        else if (query.data === "variant-skip") {
                            Variant = "";
        
                            bot.editMessageText(`<i><b>Опция: поиск</b></i>\n\n<b>Конфигурация:</b>\n<code>• Тип поиска: ${TypeSearch}</code>\n<code>• Класс: ${Klass}</code>\n<code>• Предмет: ${Predmet}</code>\n<code>• Тема: ${Theme}</code>\n<code>• Вариант (необязательно): не указано</code>\n\n<b>Конфигурация успешно создана!\nДля начала поиска нажмите кнопку:</b>`, {
                                parse_mode:'HTML',
                                chat_id:query.message.chat.id,
                                message_id:TimeData,
                                reply_markup:button5.reply_markup
                            });
                        } 
        
                        // Start
                        else if (query.data === "search-start-kontrolnaya") {
                            const Balance = Data[query.message.chat.id].balance;
                            Data[query.message.chat.id] = {
                                username: query.from.username,
                                balance: Balance - 1
                            }
                            SaveData(Data);
        
                            Search(query.message.chat.id);
        
                            bot.sendMessage(query.message.chat.id, '<i><b>Начало поиска...\nОжидайте...</b></i>', {parse_mode:'HTML'})
                                .then((sentMessage) => TimeData = sentMessage.message_id);
                        }
        
                        else if (query.data === "search-start-reply") {
                            const Balance = Data[query.message.chat.id].balance;
                            Data[query.message.chat.id] = {
                                username: query.from.username,
                                balance: Balance - 1
                            }
                            SaveData(Data);
        
                            GetReply(query.message.chat.id);
        
                            bot.sendMessage(query.message.chat.id, '<i><b>Начало поиска...\nОжидайте...</b></i>', {parse_mode:'HTML'})
                                .then((sentMessage) => TimeData = sentMessage.message_id);
                        }
                    });
                }
            }
        }

        // Buy
        else if (query.data === 'buy') {
            const button1 = {
                reply_markup: {
                    inline_keyboard: [
                        [{text: 'Своя сумма', callback_data: 'own_amount'}],
                        [{text: 'Сыщик на 1 месяц', callback_data: 'search_1month'}],
                        [{text: 'Сыщик на 2 месяца', callback_data: 'search_2month'}],
                        [{text: 'Сыщик на 3 месяца', callback_data: 'search_3month'}]
                    ]
                }
            };
        
            if (!Data[query.message.chat.id]) {
                bot.sendMessage(query.message.chat.id, '<b>Ошибка. Для создания аккаунта, используйте команду:\n/start</b>', {parse_mode:'HTML'});
            }
            else {
                bot.sendMessage(query.message.chat.id, '<i><b>Опция: пополнение баланса</b></i>\n\nЧтобы узнать подробности, введите команду:\n/about\n\n<b>Тариф: 1 поиск = 1 звезда</b>\n\n<b>Выберите тип ответа:</b>', {parse_mode:'HTML', reply_markup:button1.reply_markup})
                    .then((sentMessage) => TimeData = sentMessage.message_id);
        
                bot.on('callback_query', (query) => {
                    if (query.data === "own_amount") {
                        bot.editMessageText('<i><b>Опция: пополнение баланса</b></i>\n\nВ своём следующем сообщении введите желаемую сумму. Чтобы узнать подробности, введте команду:\n/about\n\n<b>Тариф: 1 поиск = 1 звезда</b>', {
                            parse_mode:'HTML',
                            chat_id:query.message.chat.id,
                            message_id:TimeData,
                        });
        
                        bot.on('message', (msg) => {
                            if (isNaN(msg.text) === false) {
                                const prices = [{label: 'Пополнение баланса (своя сумма)', amount: msg.text}];
        
                                bot.sendInvoice(msg.chat.id, 'Пополнение баланса (своя сумма)', 'Пополнение на любую сумму, которая потом конвертируется в поиски', 'own_amount', '', 'XTR', prices, {
                                    protect_content: true
                                });
        
                                bot.on('message', (msg) => {
                                    if (msg.successful_payment) {
                                        Data[query.message.chat.id].balance += msg.successful_payment.total_amount;
                                        SaveData(Data);
        
                                        bot.sendMessage(msg.chat.id, '<i><b>Успешное пополнение!</b></i>\n\n<b>Спасибо за покупку, мы вам очень благодарны.</b>\n\n<b>Для начала пользования, введите команду:\n/account</b>', {parse_mode:'HTML'});
                                    }
                                });
                            }
                            else {
                                bot.sendMessage(msg.chat.id, '<b>Ошибка. Введите корректную сумму.</b>', {parse_mode:'HTML'});
                            }
                        });
                    }
        
                    else if (query.data === "search_1month") {
                        const prices = [{label: 'Подписка', amount: 30}];
        
                        bot.sendInvoice(msg.chat.id, 'Сыщик на 1 месяц', 'Доступ к поиску ответов на 1 месяц', 'search_1month', '', 'XTR', prices, {
                            protect_content: true
                        });
        
                        bot.on('message', (msg) => {
                            if (msg.successful_payment) {
                                Data[query.message.chat.id].balance += msg.successful_payment.total_amount;
                                SaveData(Data);
        
                                bot.sendMessage(msg.chat.id, '<i><b>Успешное пополнение!</b></i>\n\n<b>Спасибо за покупку, мы вам очень благодарны.</b>\n\n<b>Для начала пользования, введите команду:\n/account</b>', {parse_mode:'HTML'});
                            }
                        });
                    }
        
                    else if (query.data === "search_2month") {
                        const prices = [{label: 'Подписка', amount: 55}];
        
                        bot.sendInvoice(msg.chat.id, 'Сыщик на 2 месяца', 'Доступ к поиску ответов на 2 месяца', 'search_2month', '', 'XTR', prices, {
                            protect_content: true
                        });
        
                        bot.on('message', (msg) => {
                            if (msg.successful_payment) {
                                Data[query.message.chat.id].balance += msg.successful_payment.total_amount;
                                SaveData(Data);
        
                                bot.sendMessage(msg.chat.id, '<i><b>Успешное пополнение!</b></i>\n\n<b>Спасибо за покупку, мы вам очень благодарны.</b>\n\n<b>Для начала пользования, введите команду:\n/account</b>', {parse_mode:'HTML'});
                            }
                        });
                    }
        
                    else if (query.data === "search_3month") {
                        const prices = [{label: 'Подписка', amount: 85}];
        
                        bot.sendInvoice(msg.chat.id, 'Сыщик на 3 месяца', 'Доступ к поиску ответов на 3 месяца', 'search_3month', '', 'XTR', prices, {
                            protect_content: true
                        });
        
                        bot.on('message', (msg) => {
                            if (msg.successful_payment) {
                                Data[query.message.chat.id].balance += msg.successful_payment.total_amount;
                                SaveData(Data);
        
                                bot.sendMessage(msg.chat.id, '<i><b>Успешное пополнение!</b></i>\n\n<b>Спасибо за покупку, мы вам очень благодарны.</b>\n\n<b>Для начала пользования, введите команду:\n/account</b>', {parse_mode:'HTML'});
                            }
                        });
                    }
                });
            }
        }

        // Free Buy
        else if (query.data === 'freebuy') {
            let prices = [{label: 'Добровольное пожертвование', amount: 1}];

            bot.sendInvoice(query.message.chat.id, 'Добровольное пожертвование', 'Для тех, кому не жалко поддержать проект. Чтобы отправить свою сумму, в следующем сообщении отправьте число, сумму которого хотите пожертвовать', 'freebuy', '', 'XTR', prices, {
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

bot.onText(/\/about/, (msg) => {
    bot.sendMessage(msg.chat.id, `<b>Здравствуйте, ${msg.from.first_name}!</b>\n\n<b>Скоро</b> тут вы сможете узнать подробности этого бота.`, {parse_mode:'HTML'});
});

console.log('> Successful start');



//////////



// ГДЗ

//let TypeSearch;
//let Klass;
//let Predmet;
//let Author;
//let Task;

{/* <i><b>Опция: поиск</b></i>\n\n
<b>Конфигурация:</b>\n
<code>• Тип поиска: ${TypeSearch}</code>\n
<code>• Класс: не указано</code>\n
<code>• Предмет: не указано</code>\n
<code>• Автор учебника: не указано</code>\n
<code>• Номер задания: не указано</code>\n
<code>• Сколько решений прислать?: не указано</code>\n\n
<b>Выберите тип ответа:</b> */}