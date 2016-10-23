var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/visual', function (req, res) {
   console.log(req.params);
   res.render('visual', {         // pass vars to the render template
      pageTitle: 'PID Visualisation',
      pageID: '3d'
   });
});

module.exports = router;