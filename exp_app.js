var express = require('express');
var reload = require('reload');
var app = express();

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');

app.use(require('./routes/index'));
app.use('/index', require('./routes/index'));
app.use('/visual', require('./routes/visual'));
app.use(require('./routes/config'));
app.use('/jquery', express.static('./node_modules/jquery/dist'));
app.use(express.static('./public'));

                                          // global vars for the EJS (Embedded JavaScript) framework
app.locals.siteTitle = 'CS'; // Control Systems

// var five = require("johnny-five");
// var board = new five.Board();

var server = app.listen(app.get('port'), function () {
   console.log('Example app listening on port: ' + app.get('port') + '!');
});

reload(server, app);