const { VK } = require('vk-io');
const requst = require('request');
const moment = require('moment');

const vk = new VK({
    token: '5e5497efc36baa34bd7403c7efd3f70db7a80f3b149582c29ba57cd94318c64f7ff9b4c460dfc88d0ec83'
});

const bot = async ctx => {
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
}
vk.updates.on('message', async ctx => {
    if(ctx.isFromGroup || ctx.isOutbox || !ctx.is('message')) return;
    if(!ctx.isChat) {
       // console.log(ctx.peerId);
        //await fetch("https://discordapp.com/api/webhooks/671808825371787294/35_4qYn087067gZ7Ds1HDlf_iBlzFvfRmw6ZL_MAvmBPrxUF7p30lnMLlxeAqLgoyG0o", { method: "POST", headers: {'Content-Type': 'application/json' }, body: JSON.stringify(bot)} )
        //.then(resp => console.log(resp))
        let req = requst({
                method: "POST",
                uri: 'https://discordapp.com/api/webhooks/671808825371787294/35_4qYn087067gZ7Ds1HDlf_iBlzFvfRmw6ZL_MAvmBPrxUF7p30lnMLlxeAqLgoyG0o',
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


vk.updates.start()
    .then(() => console.log('Bot has been started'));