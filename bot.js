console.log("my bot app");
var TelegramBot = require('node-telegram-bot-api');
var tg;
function create() {
    var token = "351310686:AAFnSsMRKdWg2xHZjef2CcYSUvGEkVBvRPk";
    tg = new TelegramBot(token, {
        polling: true
    });
    tg.on('message', onMessage);
    tg.on('callback_query', onCallbackQuery);
}
function onCallbackQuery(callbackQuery) {
    console.log('callbackQuery:', callbackQuery);
}


function onMessage(message) {
    console.log('message:', message);
    if (message.text && message.text.toLowerCase() == 'ping') {
        tg.sendMessage(message.chat.id, '<pre>член</pre>', {
            parse_mode:'HTML'
        });
        return;
    }
    //
    if (message.text && message.text.toLowerCase() == '/start') {
        sendStartMessage(message);
        return;
    }
}
function sendStartMessage(message) {
    var text = 'Чего желаете? ';
    //
    var SetButton = {
        text:"Установить напоминалку",
        callback_data:'SetCmd'
    }
    //
    var ClearButton = {
        text:"Очистить все напоминалки",
        callback_data:'ClearCmd'
    }
    //
	var ShowButton = {
        text:"Показать все напоминалки",
        callback_data:'ShowCmd'
    }
    //
    var options = {};
    options.reply_markup = {};
    options.reply_markup.inline_keyboard = [];
    options.reply_markup.inline_keyboard.push([SetButton]);
    options.reply_markup.inline_keyboard.push([ClearButton]);
    options.reply_markup.inline_keyboard.push([ShowButton]);
    tg.sendMessage(message.chat.id, text, options);
}

var notes = [];
var rem = 0;

function onCallbackQuery(callbackQuery) 
{
    console.log('callbackQuery:', callbackQuery);

    if (callbackQuery.data == 'SetCmd') 
    {
	
	var flag = 0;
	tg.sendMessage(callbackQuery.message.chat.id,'Введите напоминание и время в формате ЧЧ:ММ');
	tg.onText(/(.+) (.+)/, function (msg, match)
	{
		
		if (flag != 1)
		{
   		var userId = msg.from.id
		var textt = match[1];
		var time = match[2];
		var timeNow = new Date().getHours()+ ':' + new Date().getMinutes();
	
		notes.push({'uid':userId, 'time':time, 'textt':textt, 'timeNow':timeNow});

		rem = rem + 1;
      		var helpText = "Напоминание установлено!";
	
	
    	      	    tg.sendMessage(callbackQuery.message.chat.id,helpText);
	 	    flag = 1;
		}

     	});

	
    } 		//end Function Set




setInterval(function()
{
	for (var i=0; i<notes.length; i++)
	{
		var curDate = new Date().getHours()+ ':' + new Date().getMinutes();
			if (notes [i]['time'] == curDate)
			{
				tg.sendMessage(notes[i]['uid'],'Напоминалка - установлена в '+ notes[i]['timeNow'] +'\r\n' + notes[i]['textt'] );

notes.splice(i,4); 		//удаление 1 элемента с индекса i
			}
	
	}
},100);




tg.answerCallbackQuery(callbackQuery.id);	


    if (callbackQuery.data == 'ClearCmd')
{
	for(var i=0;i<100;i++)
	{
	    notes.splice(i,4);
	}
	tg.sendMessage(callbackQuery.message.chat.id,'Удалено ' + rem + ' напоминаний');
	tg.sendMessage(callbackQuery.message.chat.id,'Очищено!');
	rem = 0;
}


    if (callbackQuery.data == 'ShowCmd') 
{
	tg.sendMessage('Установлено:');
	if (rem == 0)
	{ 
	tg.sendMessage(callbackQuery.message.chat.id,'Напоминаний нет');
	}
	else
	{

		for (i=0; i<notes.length; i++)
		{
		tg.sendMessage(notes[i]['uid'],'Напоминание ' + '- установлено в '+ notes[i]['timeNow'] +'\r\n' + notes[i]['textt'] +'\r\n' +'time: ' + notes [i]['time']);

		}
	}
}
};

create();
