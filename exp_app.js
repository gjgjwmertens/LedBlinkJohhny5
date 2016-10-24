var express = require('express');
var reload = require('reload');
var wss = new require('ws').Server({port: 3030});
var app = express();

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');

app.use(require('./routes/index'));
app.use(require('./routes/visual'));
app.use(require('./routes/d3'));
app.use(require('./routes/control'));
app.use(require('./routes/config'));
app.use(require('./routes/api'));
app.use('/jquery', express.static('./node_modules/jquery/dist'));
app.use(express.static('./public'));

// global vars for the EJS (Embedded JavaScript) framework
app.locals.siteTitle = 'CS'; // Control Systems title
// app.locals.wsClientList = wsClients; // web socket client list

// var five = require("johnny-five");
// var board = new five.Board();

var server = app.listen(app.get('port'), function () {
   console.log('Example app listening on port: ' + app.get('port') + '!');
});

reload(server, app);

wss.on('connection', function (ws) {
   ws.send('Welcome to cyber chat');
   ws.on('message', function (msg) {
      if (msg == 'exit') {
         ws.close();
      }
   })
});

var five = require("johnny-five");
var board = new five.Board();
var potentiometer = {
   type: 'json',
   item: 'potentiometer',
   value: -0.5,
   data: 250,
   time: new Date().toString()
};

board.on('ready', function () {

   var sensor = new five.Sensor('A0');

   sensor.on('change', function () {
      var sample = this;
      process.stdout.write('\033c');
      console.log('[' + Date.now() + ']' + sample.scaleTo(0, 10));
      console.log('[' + Date.now() + ']' + sample.value);

      potentiometer.value = sample.scaleTo(-1, 1);
      potentiometer.data = sample.value;
      potentiometer.time = new Date().toString();
   })
});

setInterval(updateClient, 500);

function updateClient() {
   wss.clients.forEach(function (ws, index, list) {
      ws.send(JSON.stringify(potentiometer));
   })
}