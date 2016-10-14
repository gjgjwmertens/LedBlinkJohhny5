var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function() {

   var sensor = new five.Sensor('A0');
   var motor = new five.Motor(9);

   sensor.on('change', function() {
      process.stdout.write('\033c');
      console.log('[' + Date.now() + ']' + this.scaleTo(0, 10));
      console.log('[' + Date.now() + ']' + this.value);
   });

   motor.start(150);
   board.wait(5000, function() {
      motor.stop();
   });
});
