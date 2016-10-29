var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

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
   var mCtrl = req.app.get('motor_ctrl');
   var input = req.body;
   console.log(input);

   if (motor) {
      switch (input.command) {
         case 'start motor':
            mCtrl(input.value);
            motor.forward(input.value);
            res.json({msg: 'Motor running'});
            break;
         case 'set motor':
            // motor.start(input.value);
            mCtrl();
            res.json({msg: 'Motor set'});
            break;
         case 'stop motor':
            // var start = Date.now();
            // var val = input.value;
            // motor.start(val);
            // motor.on('start', function (val) {
            //    motor.start(val--);
            //    console.log(val);
            // });
            // for(var i = parseInt(input.value); i >= 0; i--) {
            //    motor.start(i);
            //    for(var j = 0; j < 200; j++) {
            //       process.stdout.write('\033c');
            //       console.log(i * j);
            //    }
            // }
            // console.log((Date.now() - start) / 1000);
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