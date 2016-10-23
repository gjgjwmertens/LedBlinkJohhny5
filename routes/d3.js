var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/d3', function (req, res) {
   console.log(req.params);
   res.render('d3', {         // pass vars to the render template
      pageTitle: 'D3 course',
      pageID: 'd3'
   });
});

module.exports = router;