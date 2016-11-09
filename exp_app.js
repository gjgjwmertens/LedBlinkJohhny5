var express = require('express');
var reload = require('reload');
var fs = require('fs');
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
var motor = null;
var potentiometer = {
   type: 'json',
   item: 'potentiometer',
   value: 0,
   data: 0,
   time: new Date().toString()
};
var motorPower = {
   type: 'json',
   item: 'motorPower',
   value: 0,
   data: 0,
   time: new Date().toString()
};
var motorFeedback = {
   type: 'json',
   item: 'motorFeedback',
   value: 0,
   data: 0,
   time: new Date().toString()
};
var motorPowerSensor = null, motorFeedbackSensor = null;
var motorPowerData = '', motorFeedbackData = '';

var mValue = 100;
function motorControl(val) {
   if(val !== undefined) {
      mValue = Math.min(255, parseInt(val));
      console.log('New motor value: ' + mValue);
   } else {
      motor.start(mValue--);
      if(mValue > 0) {
         board.wait(100, motorControl);
      }
      if(mValue == 0) {
         motor.stop();
         console.log('Motor stopped');
      }
      console.log(mValue);
   }
}

function startMotorTest() {
   motorPowerSensor.on('data', function() {
      motorPowerData += this.value + ', ' + this.raw + "\r\n";
      console.log('Motor power: ' + this.value);
   });
   motorFeedbackSensor.on('data', function() {
      motorFeedbackData += this.value + ', ' + this.raw + "\r\n";
      console.log('Motor feedback: ' + this.value);
   });
   motor.start(100);
   board.wait(5000, stopMotorTest);
}

function motorTest() {
   if(motorPowerSensor && motorFeedbackSensor) {
      board.wait(5000, startMotorTest)
   }
}

function stopMotorTest() {
   motorPowerSensor.removeAllListeners('data');
   fs.writeFile('motorPowerData_' + Date.now() + '.csv', motorPowerData, function (err) {
      console.log('Motor power data saved');
   });
   motorFeedbackSensor.removeAllListeners('data');
   fs.writeFile('motorFeedbackData_' + Date.now() + '.csv', motorFeedbackData, function (err) {
      console.log('Motor feedback data saved');
   });
   motor.stop();
}

board.on('ready', function () {
   motor = new five.Motor(9);
   app.set('motor', motor);
   app.set('motor_ctrl', motorControl);
   app.set('motor_test', motorTest);

   var potSensor = new five.Sensor({
      pin: 'A0',
      freq: 100
   });

   potSensor.on('change', function () {
      var sample = this;
      // process.stdout.write('\033c');
      // console.log('[' + Date.now() + ']' + sample.scaleTo(0, 10));
      // console.log('[' + Date.now() + ']' + sample.value);

      potentiometer.value = sample.fscaleTo(-1, 1);
      potentiometer.data = sample.value;
      potentiometer.time = new Date().toString();

      wss.clients.forEach(function (ws, index, list) {
         ws.send(JSON.stringify(potentiometer));
      })
   });

   motorPowerSensor = new five.Sensor({
      pin: 'A1',
      freq: 100
   });

   motorPowerSensor.on('change', function () {
      var sample = this;

      motorPower.value = sample.scaleTo(0, 100);
      motorPower.data = sample.value;
      motorPower.time = new Date().toString();

      wss.clients.forEach(function (ws, index, list) {
         ws.send(JSON.stringify(motorPower));
      })
   });

   motorFeedbackSensor = new five.Sensor({
      pin: 'A2',
      freq: 100
   });

   motorFeedbackSensor.on('change', function () {
      var sample = this;

      motorFeedback.value = sample.scaleTo(0, 500);
      motorFeedback.data = sample.value;
      motorFeedback.time = new Date().toString();

      wss.clients.forEach(function (ws, index, list) {
         ws.send(JSON.stringify(motorFeedback));
      })
   });
});
