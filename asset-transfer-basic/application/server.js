
const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");
const FabricCAServices = require("fabric-ca-client");
const { Wallets } = require("fabric-network");
const fs = require("fs");

const app = express();
const PORT = 3000;
const HOST = "0.0.0.0";

app.use(express.static(path.join(__dirname, "views")));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

//-----------------------------------------------라우터 
// 관리자용 지갑 생성 파트
app.post("/admin", async(req, res)=>{
    const {id, password} = req.body
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
            const res_str = `{"msg":"An identity for the admin user admin already exists in the wallet"}`;
            res.json(JSON.parse(res_str));
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
        const res_str = `{"msg":"관리자 지갑생성이 완료되었습니다."}`;
        res.json(JSON.parse(res_str));
        
    } catch (error) {
        console.error(`Failed to enroll admin user "admin": ${error}`);
        const res_str = `{"msg":"Failed to enroll admin user admin: ${error}"}`;
        res.json(JSON.parse(res_str));
    }
})


app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

