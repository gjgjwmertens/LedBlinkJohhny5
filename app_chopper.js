var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function() {

   var sensor = new five.Sensor('A0');

   sensor.on('change', function() {
      process.stdout.write('\033c');
      console.log('[' + Date.now() + ']' + this.scaleTo(0, 10));
      console.log('[' + Date.now() + ']' + this.value);
   });
});
