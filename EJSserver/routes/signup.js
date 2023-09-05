var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('signup', {title: "회원가입"})
});

router.post('/', function(req, res, next) {
  //  사용자가 입력한 값을 req 에서 꺼내와야함 => DATA
  //  DATA 를 DB에 저장 (sql, mongoDB.... => json 파일로 작성해서 저장)
  //  로그인이 된 상태 or 가입만 완료하고 로그인은 별도로 해야하는지
})

module.exports = router;
