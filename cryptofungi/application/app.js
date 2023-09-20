var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var fs = require("fs")
const FabricCAServices = require("fabric-ca-client");
const { Wallets } = require("fabric-network");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//-----------------------------------------------라우터 
// 관리자용 지갑 생성 파트
 async function makeAdminWallet(){
  const id = "admin"
  const password = "adminpw"
  console.log(id, password)

  //  CA에 접속해서 관리자 지갑을 생성해서 wallet 폴더에 잘 저장하는 코드
  try {
      // load the network configuration
      const ccpPath = path.resolve(__dirname, "ccp", "connection-org1.json");
      const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

      // Create a new CA client for interacting with the CA.
      const caInfo = ccp.certificateAuthorities["ca.org1.example.com"];
      const caTLSCACerts = caInfo.tlsCACerts.pem;
      const ca = new FabricCAServices(
          caInfo.url,
          { trustedRoots: caTLSCACerts, verify: false },
          caInfo.caName
      );

      // Create a new file system based wallet for managing identities.
      const walletPath = path.join(process.cwd(), "wallet");
      const wallet = await Wallets.newFileSystemWallet(walletPath);
      console.log(`Wallet path: ${walletPath}`);

      // Check to see if we've already enrolled the admin user.
      const identity = await wallet.get(id);
      if (identity) {
          console.log(
              'An identity for the admin user "admin" already exists in the wallet'
          );          
          return;
      }
      // Enroll the admin user, and import the new identity into the wallet.
      const enrollment = await ca.enroll({
          enrollmentID: id,
          enrollmentSecret: password,
      });
      const x509Identity = {
          credentials: {
              certificate: enrollment.certificate,
              privateKey: enrollment.key.toBytes(),
          },
          mspId: "Org1MSP",
          type: "X.509",
      };
      await wallet.put(id, x509Identity);
      console.log(
          'Successfully enrolled admin user "admin" and imported it into the wallet'
      );
      console.log(`{"msg":"관리자 지갑생성이 완료되었습니다."}`);
      
  } catch (error) {
      console.error(`Failed to enroll admin user "admin": ${error}`);      
  }
}

makeAdminWallet()

module.exports = app;
