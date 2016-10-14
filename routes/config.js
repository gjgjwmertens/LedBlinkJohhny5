/**
 * Created by G on 14-10-2016.
 */
var express = require('express');
var router = express.Router();

/* GET config page. */
router.get('/config', function (req, res) {
   res.send(`
      <script src="reload/reload.js"></script>
      <h1>This is the configuration page</h1>
   `);
});

module.exports = router;
