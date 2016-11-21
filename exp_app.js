var express = require('express');
var reload = require('reload');
var fs = require('fs');
var wss = new require('ws').Server({port: 3030});
var app = express();
var Chopper = require('./lib/Chopper');

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

var chop = new Chopper();

chop.on('ready', function() {
   console.log('Chopper ready');
   app.set('chopper', chop);
});

chop.on('change', function(value) {
   wss.clients.forEach(function (ws, index, list) {
      ws.send(JSON.stringify(value));
   })
});

chop.on('data', function(type, data) {
   fs.writeFile(type + Date.now() + '.csv', data, function (err) {
      console.log(`${type} data saved`);
   });
});