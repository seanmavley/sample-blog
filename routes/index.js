var express = require('express');
var router = express.Router();


router.get('/', function (req, res) {
  res.json({ title: 'welcome home' });
});


module.exports = router;
