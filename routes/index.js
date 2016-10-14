var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
   console.log(req.params);
   res.render('index');
});

module.exports = router;