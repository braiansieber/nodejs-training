/* 
Generar un módulo con Node.js que integre los conceptos que aprendimos en el curso hasta la fecha.
El caso más sencillo y comúnmente utilizado suele ser un conversor de moneda que 
recibe un parámetro en una moneda especifica y hace la correspondiente conversión.
Con este práctico, buscamos que aprendan cómo es el proceso 
completo de desarrollo y publicación de un módulo en npm.
Dicha solución debería de englobar los siguientes conceptos teóricos
* Promesas
* Modularización de código
* Módulos del core de Node.js
* Asincronismo
* Manejo de errores
* Manejo del CLI de npm con comandos básicos
Si tienen otra idea para implementar y lo ven suficientemente factible, es bienvenido.
Recuerden que no es una tarea formal y no implica ninguna nota. ¡El límite está en ustedes!. 
*/
const get_values_dolarsi = require('./get_values_dolarsi')
const Telegraf = require('telegraf')
const Markup = require('telegraf/markup');
const express = require('express')

const bot = new Telegraf('1245920159:AAFvbrj232mB5YNg8ZqQi0sY1iB9Du-ed1o');
const expressApp = express()

expressApp.use(bot.webhookCallback('/bot-path'));
expressApp.post('bot-path', (req, res) => {
    res.send('Llamada a la ruta del bot');
});
expressApp.listen(3000, () => {
    console.log('El server esta escuchando');
});

const webhoook = 'https://3de01080.ngrok.io'
bot.telegram.setWebhook(`${webhoook}/bot-path`)
bot.start(ctx => {
    let arr_bottons = [
        Markup.callbackButton('Queres cambiar dolares oficiales', 'falsa'),
        Markup.callbackButton('Queres cambiar dolares bolsa', 'correcta'),
        Markup.callbackButton('Queres cambiar dolares lala', 'falsa')
    ];
    let extra = Markup.inlineKeyboard(arr_bottons).extra()
    extra['pase_mod'] = 'HTML'
    bot.telegram.sendMessage(ctx.from.id, '¿Que queres hacer?', extra)
});
//     ctx.reply(
//     `🛎 Hola ${ctx.from.first_name}, ¿En qué puedo ayudarte?`,
//     Markup.inlineKeyboard([
//       Markup.callbackButton('Consultar saldo tarjeta', 214),
//     ]).extra()
//   )

// bot.start((ctx) => ctx.reply(`Bienvenido, aquí podrás recibir cotización del dolar y distintas monedas al intante.\n\
//     Escribe "/help" para recibir ayuda. \n${get_values_dolarsi.help_message}`))
bot.help((ctx) => ctx.reply(get_values_dolarsi.help_message));
bot.on('text', ctx => {
    get_values_dolarsi.command_get_price(ctx).then(data => {
        console.log(data);
        bot.telegram.sendMessage(ctx.from.id, data);
    }).catch(err => {
        console.log(err);
        bot.telegram.sendMessage(ctx.from.id, err);
    });
});
