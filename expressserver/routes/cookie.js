
const path = require("path");
var express = require('express');
var router = express.Router();



router.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, "..", "views", "cookie.html"));
})

// url : /cookie/request
router.get('/request', (req, res)=>{
    console.log("in /cookie/request")
    res.cookie("firstcookie", {
        school: "ICT",
        class: "Blockchain",
        authorized: true
    })
    res.redirect('/cookie/showCookie');
})

router.route('/showCookie').get(function(req, res) {
    console.log('/cookie/showCookie 호출됨.');

    res.send(req.cookies);
});


module.exports = router;

