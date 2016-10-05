var express = require('express');
var app = express();

var five = require("johnny-five");
var board = new five.Board();
var led = null;

board.on("ready", function() {

  // Create a standard `led` component instance
   led = new five.Led(3);
});

app.get('/:freq', function (req, res) {
	console.log(req.params);
	var freq = parseInt(req.params.freq);
	if(led && freq) {
									  // "blink" the led in 500ms
									  // on-off phase periods
		led.pulse(parseInt(req.params.freq));
		res.send('Hello World! The led is blinking at: ' +  req.params.freq);
	} else {
		res.send('Hello World! The led is not yet ready');
	}
});

app.get('/freq', function (req, res) {
	console.log(req.query.freq);
	var freq = parseInt(req.query.freq);
	if(led && freq) {
									  // "blink" the led in 500ms
									  // on-off phase periods
		led.pulse(freq);
		res.send('Hello World! The led is blinking at: ' + req.query.freq);
	} else {
		res.send('Hello World! The led is not yet ready');
	}
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
