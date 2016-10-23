var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/control', function (req, res) {
   res.render('control', {         // pass vars to the render template
      pageTitle: 'PID chopper control',
      pageID: 'pid_control'
   });
});

module.exports = router;