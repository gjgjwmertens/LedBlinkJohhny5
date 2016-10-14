var express = require('express');
var reload = require('reload');
var app = express();

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');

app.use(require('./routes/index'));
app.use(require('./routes/config'));
app.use('/jquery', express.static('./node_modules/jquery/dist'));
app.use(express.static('./public'));

// var five = require("johnny-five");
// var board = new five.Board();

var server = app.listen(app.get('port'), function () {
   console.log('Example app listening on port: ' + app.get('port') + '!');
});

reload(server, app);