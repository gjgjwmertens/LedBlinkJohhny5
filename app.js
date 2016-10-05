var five = require("johnny-five");
var board = new five.Board();

var http = require('http');
const PORT = 8080;

function handleRequest(rqs, rsp) {
   rsp.end('It Works: ' +  rqs.url);
}


var server = http.createServer(handleRequest);

board.on("ready", function() {

  // Create a standard `led` component instance
   var led = new five.Led(4);

   server.listen(PORT, function() {
      console.log('Server listening on: http://20.0.0.112:%s', PORT);
   });

  // "blink" the led in 500ms
  // on-off phase periods
   led.blink(500);
});
