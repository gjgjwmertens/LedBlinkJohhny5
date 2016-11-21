/**
 * Created by G on 21-11-2016.
 */

var EventEmitter = require('events').EventEmitter;
var util = require('util');
var five = require("johnny-five");

var Chopper = function() {
   this.motor = null;
   this.mValue = 100;
   this.board = new five.Board();

   this.potSensor = null;
   this.motorPowerSensor = null;
   this.motorFeedbackSensor = null;
   this.motorPowerData = '';
   this.motorFeedbackData = '';

   this.board.on('ready', function () {
      this.motor = new five.Motor(9);
      this.potSensor = new five.Sensor({
         pin: 'A0',
         freq: 100
      });

      this.potSensor.on('change', function () {
         var potentiometer = {
            type: 'json',
            item: 'potentiometer',
            value: this.potSensor.fscaleTo(-1, 1),
            data: this.potSensor.value,
            time: new Date().toString()
         };
         this.emit('change', potentiometer);
      }.bind(this));

      this.motorPowerSensor = new five.Sensor({
         pin: 'A1',
         freq: 100
      });

      this.motorPowerSensor.on('change', function () {
         var motorPower = {
            type: 'json',
            item: 'motorPower',
            value: this.motorPowerSensor.fscaleTo(0, 150),
            data: this.motorPowerSensor.value,
            time: new Date().toString()
         };
         this.emit('change', motorPower);
      }.bind(this));

      this.motorFeedbackSensor = new five.Sensor({
         pin: 'A2',
         freq: 100
      });

      this.motorFeedbackSensor.on('change', function () {
         var motorFeedback = {
            type: 'json',
            item: 'motorFeedback',
            value: this.motorFeedbackSensor.fscaleTo(0, 500),
            data: this.motorFeedbackSensor.value,
            time: new Date().toString()
         };
         this.emit('change', motorFeedback);
      }.bind(this));

      this.emit('ready');
   }.bind(this));

   this.motorStart = function (val) {
      this.motor.start(this.mValue);
   };

   this.startMotorTest = function () {
      this.motor.start(this.mValue);
      this.motorPowerSensor.on('data', function () {
         this.motorPowerData += this.motorPowerSensor.value + ', ' + this.motorPowerSensor.raw + "\r\n";
         console.log('Motor power: ' + this.motorPowerSensor.value);
      }.bind(this));
      this.motorFeedbackSensor.on('data', function () {
         this.motorFeedbackData += this.motorFeedbackSensor.value + ', ' + this.motorFeedbackSensor.raw + "\r\n";
         console.log('Motor feedback: ' + this.motorFeedbackSensor.value);
      }.bind(this));
      this.board.wait(5000, this.stopMotorTest);
   }.bind(this);

   this.stopMotorTest = function () {
      this.motorPowerSensor.removeAllListeners('data');
      this.motorFeedbackSensor.removeAllListeners('data');

      this.emit('data', 'motorPowerData_', this.motorPowerData);
      this.emit('data', 'motorFeedbackData_', this.motorFeedbackData);

      console.log('stop Motor test');
      this.motor.stop();
   }.bind(this);

   this.motorTest = function () {
      console.log('Motor test');
      if(this.motorFeedbackSensor && this.motorPowerSensor) {
         this.board.wait(5000, this.startMotorTest);
      }
   };
};

util.inherits(Chopper, EventEmitter);

module.exports = Chopper;
