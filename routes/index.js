var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
   console.log(req.params);
   res.render('index', {         // pass vars to the render template
      pageTitle: 'PID chopper control',
      pageID: 'home'
   });
});

module.exports = router;