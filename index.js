const { VK } = require('vk-io'); //
const requst = require('request'); // Подключение библиотеки реквест, делает https
const moment = require('moment');
const config = { // Получаем из окружения токен и линк вебхука(типа безопасность)
    token: process.env.TOKEN, 
    webhook: process.env.WEBHOOKLINK
};


const vk = new VK({ // Инициализация класса вк с токеном
    token: config.token
});
/*
* ctx
 */
const bot = async ctx => { // Функция обработки данных и отправки объекта
    const userdata = await vk.api.users.get({user_ids: ctx.senderId, fields: "photo_50"});
    //console.log(userdata[0].first_name );
    const data = ctx.message.date;
   // console.log(data)
    const time = moment(data * 1000).utc().format('YYYY-MM-DDTHH:mm:ss.SSS');
  //  console.log(time.replace())
    return {
        "username": "Logger",
        "embeds": [
            {
                "title": "Перейти в диалог с юзером",
                "url": "https://vk.com/write" + ctx.senderId,
                "color": 2451211,
                "timestamp": `${time}Z`,
                "author": {
                    "name": userdata[0].first_name + ' ' + userdata[0].last_name,
                    "url": "https://vk.com/gim191140619?sel=" + ctx.senderId,
                    "icon_url": userdata[0].photo_50
                },
                "fields": [
                    {
                        "name": "Сообщение",
                        "value": ctx.text
                    }
                ]
            }
        ]
    }
};
vk.updates.on('message', async ctx => { //Мидлварь, прослушивающий сообщения и отправляющий на вебхук запрос
    if(ctx.isFromGroup || ctx.isOutbox || !ctx.is('message')) return;
    if(!ctx.isChat) {
        let req = requst({
                method: "POST",
                uri: config.webhook,
                body: await bot(ctx),
                json: true
            },
            function (err, req1, resp) {
                if(!resp) return;
                console.log(resp);
            }
        )
        //console.log(req)
        }
    });


vk.updates.start() //Запуск "бота"
    .then(() => console.log('Bot has been started'));