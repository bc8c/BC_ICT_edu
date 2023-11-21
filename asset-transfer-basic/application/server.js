
const express = require("express")
const bodyParser = require("body-parser");
const path = require("path")
const cookieParser = require("cookie-parser")
const fs = require("fs");

const { Gateway, Wallets } = require("fabric-network");

const app = express()

const PORT = 3000;
const HOST = "0.0.0.0";

app.use(express.static(path.join(__dirname, "views")));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get("/", (req,res)=>{
    res.render("index")
})

app.get("/asset/create", (req,res)=>{
    res.render("assetcreate")
})

app.get("/asset/read", (req,res)=>{
    res.render("assetread")
})

app.post("/asset/create", async (req,res)=>{
    const id = req.body.ID
    const color = req.body.COLOR
    const size = req.body.SIZE
    const owner = req.body.OWNER
    const apvalue = req.body.APVALUE
    console.log("in /asset/create")
    console.log(id, color, size, owner, apvalue)

    // 자산생성 수행
    // 블록체인 네트워크에 있는 asset-transfer-basic 체인코드 호출
    // 체인코드내에 있는 CreateAsset 함수를 호출해야함

    // 블록체인 연동후 체인코드 호출이 정상적으로 잘 처리된경우 

    // 그 실행 결과를 받아와서 response를 만들어 웹 브라우저에 전달

    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, "ccp", "connection-org1.json");
        let ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), "wallet");
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get("appUser");
        if (!identity) {
            console.log(
                'An identity for the user "appUser" does not exist in the wallet'
            );
            console.log("Run the registerUser.js application before retrying");
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: "appUser",
            discovery: { enabled: true, asLocalhost: true },
        });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork("mychannel");

        // Get the contract from the network.
        const contract = network.getContract("basic");

        // Submit the specified transaction.
        // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR12', 'Dave')
        await contract.submitTransaction(
            "CreateAsset",
            id,
            color,
            size,
            owner,
            apvalue
        );        
        console.log("Transaction has been submitted");        

        // Disconnect from the gateway.
        await gateway.disconnect();
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        res_str = `{"resultcode":"failed", "msg":"자산생성을 실패하였습니다."}`
        res.json(JSON.parse(res_str))
    }
    
    res_str = `{"resultcode":"success", "msg":"자산생성이 정상적으로 완료되었습니다."}`
    res.json(JSON.parse(res_str))
})

app.post("/asset/read", async (req,res)=>{
    const id = req.body.ID
   
    console.log("in /asset/read")
    console.log(id)

    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, "ccp", "connection-org1.json");
        let ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), "wallet");
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get("appUser");
        if (!identity) {
            console.log(
                'An identity for the user "appUser" does not exist in the wallet'
            );
            console.log("Run the registerUser.js application before retrying");
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: "appUser",
            discovery: { enabled: true, asLocalhost: true },
        });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork("mychannel");

        // Get the contract from the network.
        const contract = network.getContract("basic");

        // Submit the specified transaction.
        // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR12', 'Dave')
        result = await contract.evaluateTransaction(
            "ReadAsset",
            id
        );        
        console.log("Transaction has been submitted");

        // 1. result 직접 편집 하는 방법
        // data = JSON.parse(result)
        // res_str = `{"resultcode":"success", "ID":"${data.ID}","color":"${data.color}","size":${data.size},"owner":"${data.owner}","appraisedValue":${data.appraisedValue}}`

        // 2. result 그대로 사용하는 방법
        res_str = `{"resultcode":"success", "msg":${result}}`
        res.json(JSON.parse(res_str))       

        // Disconnect from the gateway.
        await gateway.disconnect();
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        res_str = `{"resultcode":"failed", "msg":"자산조회를 실패하였습니다."}`
        res.json(JSON.parse(res_str))
    }
    
    
})

app.listen(PORT, HOST)
console.log(`Running on http://${HOST}:${PORT}`)
