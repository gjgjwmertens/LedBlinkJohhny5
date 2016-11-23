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
   var chopper = req.app.get('chopper');
   var input = req.body;

   if (chopper && chopper.motor) {
      switch (input.command) {
         case 'start motor':
            chopper.motorStart();
            res.json({msg: 'Motor started at: ' + chopper.mValue});
            break;
         case 'set motor':
            chopper.motorSet(input.value);
            res.json({msg: 'Motor set: ' + input.value});
            break;
         case 'test motor':
            chopper.motorTest();
            res.json({msg: 'Motor tested'});
            break;
         case 'stop motor':
            chopper.motorStop();
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