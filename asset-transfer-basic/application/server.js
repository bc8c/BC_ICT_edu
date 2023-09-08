
const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");
const FabricCAServices = require("fabric-ca-client");
const { Wallets, Gateway } = require("fabric-network");
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

app.post("/user", async(req, res)=>{
    const {id} = req.body
    console.log(id)

    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, "ccp", "connection-org1.json");
        const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

        // Create a new CA client for interacting with the CA.
        const caURL = ccp.certificateAuthorities["ca.org1.example.com"].url;
        const ca = new FabricCAServices(caURL);

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), "wallet");
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userIdentity = await wallet.get(id);
        if (userIdentity) {
            console.log(
                'An identity for the user "appUser" already exists in the wallet'
            );
            const res_str = `{"msg":"An identity for the user "appUser" already exists in the wallet"}`;
            res.json(JSON.parse(res_str));
            return;
        }

        // Check to see if we've already enrolled the admin user.
        const adminIdentity = await wallet.get("admin");
        if (!adminIdentity) {
            console.log(
                'An identity for the admin user "admin" does not exist in the wallet'
            );
            console.log("Run the enrollAdmin.js application before retrying");
            const res_str = `{"msg":"Run the enrollAdmin.js application before retrying"}`;
            res.json(JSON.parse(res_str));
            return;
        }

        // build a user object for authenticating with the CA
        const provider = wallet
            .getProviderRegistry()
            .getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, "admin");

        // Register the user, enroll the user, and import the new identity into the wallet.
        const secret = await ca.register(
            {
                affiliation: "org1.department1",
                enrollmentID: id,
                role: "client",
            },
            adminUser
        );
        const enrollment = await ca.enroll({
            enrollmentID: id,
            enrollmentSecret: secret,
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
            'Successfully registered and enrolled admin user "appUser" and imported it into the wallet'
        );
        const res_str = `{"msg":"사용자 지갑생성이 완료되었습니다."}`;
        res.json(JSON.parse(res_str));
    } catch (error) {
        console.error(`Failed to register user "appUser": ${error}`);
        const res_str = `{"msg":"Failed to register user appUser: ${error}"}`;
        res.json(JSON.parse(res_str));
    }
})

app.post("/createasset", async(req, res)=>{
    const {cert, id, color, size, owner, appraisedValue} = req.body

    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, "ccp", "connection-org1.json");
        let ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), "wallet");
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get(cert);
        if (!identity) {
            console.log(
                'An identity for the user "appUser" does not exist in the wallet'
            );
            console.log("Run the registerUser.js application before retrying");
            console.error(`Failed to submit transaction: ${error}`);
            res.send(`Failed to submit transaction: ${error}`)
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: cert,
            discovery: { enabled: true, asLocalhost: true },
        });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork("mychannel");

        // Get the contract from the network.
        const contract = network.getContract("basic");

        await contract.submitTransaction(
            "CreateAsset",
            id, color, size, owner, appraisedValue
        );
        console.log("Transaction has been submitted");
        res.send("Transaction has been submitted")

        // Disconnect from the gateway.
        await gateway.disconnect();
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        res.send(`Failed to submit transaction: ${error}`)
    }
})

app.get("/readasset", async(req, res)=>{
    const {cert, id} = req.query
    console.log(cert, id)

    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, "ccp", "connection-org1.json");
        let ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), "wallet");
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get(cert);
        if (!identity) {
            console.log(
                'An identity for the user "appUser" does not exist in the wallet'
            );
            console.log("Run the registerUser.js application before retrying");
            console.error(`Failed to submit transaction: ${error}`);
            const res_str = `{"msg":"Failed to submit transaction: ${error}"}`;
            res.json(JSON.parse(res_str));
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: cert,
            discovery: { enabled: true, asLocalhost: true },
        });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork("mychannel");

        // Get the contract from the network.
        const contract = network.getContract("basic");

        const result = await contract.evaluateTransaction(
            "ReadAsset",
            id
        );
        console.log("Transaction has been submitted");

        const res_str = `{"msg":${result}}`;
        res.json(JSON.parse(res_str));

        // Disconnect from the gateway.
        await gateway.disconnect();
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        const res_str = `{"msg":"Failed to submit transaction: ${error}"}`;
        res.json(JSON.parse(res_str));
    }
})


app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

