var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

router.get('/api', function (req, res) {
   res.json({
      type: 'json',
      data: 'Hello World',
      time: new Date().toString()
   });
});

router.get('/api/:item_id/:new_value', function (req, res) {
   res.json({
      type: 'json',
      item: req.params.item_id,
      value: req.params.new_value,
      data: 'Hello World',
      time: new Date().toString()
   });
});

router.post('/api', function (req, res) {
   var motor = req.app.get('motor');
   var input = req.body;
   console.log(input);

   if(motor) {
      switch(input.command) {
         case 'start motor':
            motor.start(input.value);
            res.json({msg: 'Motor running'});
            break;
         case 'stop motor':
            var start = Date.now();
            for(var i = parseInt(input.value); i >= 0; i--) {
               motor.start(i);
               for(var j = 0; j < 25; j++) {
                  // process.stdout.write('\033c');
                  console.log(i);
               }
            }
            console.log((Date.now() - start) / 1000);
            motor.stop();
            res.json({msg: 'Motor stopped'});
            break;
         default:
            res.json({msg: 'Unknown command'});
      }
   } else {
      res.json({msg: 'Motor not ready'});
   }
})

module.exports = router;