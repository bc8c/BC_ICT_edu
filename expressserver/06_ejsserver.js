

const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;
const HOST = "0.0.0.0";

app.use(express.static(path.join(__dirname, "views")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// ejs 뷰 엔진 세팅
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/ejsrender', (req, res)=>{
    console.log("in /ejsrender")
    res.render('first', {title: "ejs test", name: "BOB", age: 56})
})

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
