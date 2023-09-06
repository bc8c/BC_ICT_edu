var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log("in /logout")
  res.clearCookie("USER");
  res.redirect("/")
});

module.exports = router;
