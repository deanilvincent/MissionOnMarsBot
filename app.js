/*
NPM
*/
var restify = require('restify');
var builder = require('botbuilder');

/*
Setup
*/
//Setup restify server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function(){
    console.log('%s listening to %s', server.name, server.url);
});

//Setup chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);

//Open connection to database before listening on server
server.post('api/messages', connector.listen());

/*
Dialogs
*/
//Intent dialog
var luisUrl = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/109f950e-11c6-462a-b84c-f3454a1fc79e?subscription-key=61fe645b6056470cba59a88b0d6d927d&verbose=true';
var luisRecognizer = new builder.LuisRecognizer(luisUrl);
var intentDialog = new builder.IntentDialog({recognizers: [luisRecognizer]});

//Root dialog
bot.dialog('/', intentDialog);
intentDialog.onDefault(builder.DialogAction.send('Sorry, I didn\'t understand that.'));
intentDialog.matches('Greeting', '/greetingDialog');
intentDialog.matches('Size', '/sizeDialog')
intentDialog.matches('Distance', '/distanceDialog');
intentDialog.matches('Life', 'lifeDialog');

bot.dialog('/greetingDialog', 
    function(session)
    {
        session.endDialog('Hi! I\'m a droid from Mars. Ask me questions you have about Mars!');
    }
)

bot.dialog('/sizeDialog',
    function(session)
    {
        session.endDialog('Mars has a radius of 3,390km, compared to Earth\'s radius which is 6,371km');
    }
)

bot.dialog('/distanceDialog',
    function(session)
    {
        session.endDialog('Mars is pretty far away from your home planet, Earth. On average, the distance is 225 million km.');
    }
)

bot.dialog('/lifeDialog', 
    function(session)
    {
        session.endDialog('Yes, there is life on Mars although not yet discovered by primitive humans.');
    }
)

