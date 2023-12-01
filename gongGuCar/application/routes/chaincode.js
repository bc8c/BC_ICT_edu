

const express = require("express")
const path = require("path")
const fs = require("fs");
const { Gateway, Wallets } = require("fabric-network");

var router = express.Router()


router.post("/registercar", async(req,res)=>{
   
    // 차량 등록하기 화면에서 사용자가 입력한 정보를 읽어오기
    const {carname,carcolor,carprice} = req.body
    // + 쿠키에서 사용자 ID 를 읽어와야함
    const userCookie = req.cookies[`USER`]
    userData = JSON.parse(userCookie)
    // userData.userid

    // 체인코드에 있는 RegisterCar 함수를 호출해야함
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname,"..", "ccp", "connection-org1.json");
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
        const contract = network.getContract("gongGuCar");

        // Submit the specified transaction.
        // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR12', 'Dave')
        await contract.submitTransaction(
            "RegisterCar",
            userData.userid,
            carname,
            carcolor,
            carprice
        );        
        console.log("Transaction has been submitted");        

        // Disconnect from the gateway.
        await gateway.disconnect();
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        // res_str = `{"resultcode":"failed", "msg":"자산생성을 실패하였습니다."}`
        // res.json(JSON.parse(res_str))
        res.write(`<script>alert("failed Register CAR")</script>`);
        return
    }
    // 호출한 결과를 WB에게 전송함(res)
    res.redirect("/")    
})


router.post("/purchasecar", async(req,res)=>{
   
    // 차량 등록하기 화면에서 사용자가 입력한 정보를 읽어오기
    const {carid,newOwner} = req.body
    // + 쿠키에서 사용자 ID 를 읽어와야함
    const userCookie = req.cookies[`USER`]
    userData = JSON.parse(userCookie)
    // userData.userid

    // 체인코드에 있는 RegisterCar 함수를 호출해야함
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname,"..", "ccp", "connection-org1.json");
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
        const contract = network.getContract("gongGuCar");

        // Submit the specified transaction.
        // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR12', 'Dave')
        await contract.submitTransaction(
            "PurchaseCar",
            userData.userid,
            carid,
            newOwner
        );        
        console.log("Transaction has been submitted");        

        // Disconnect from the gateway.
        await gateway.disconnect();
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        res_str = `{"resultcode":"failed", "msg":"차량 소유 등록에 실패하였습니다."}`
        res.json(JSON.parse(res_str))
        return
    }
    // 호출한 결과를 WB에게 전송함(res)
    res_str = `{"resultcode":"success", "msg":"차량 소유 등록에 성공하였습니다."}`
    res.json(JSON.parse(res_str))    
})

router.post("/querycarinfo", async(req,res)=>{
   
    // 차량 등록하기 화면에서 사용자가 입력한 정보를 읽어오기
    const {carid} = req.body
   

    // 체인코드에 있는 RegisterCar 함수를 호출해야함
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname,"..", "ccp", "connection-org1.json");
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
        const contract = network.getContract("gongGuCar");

        // Submit the specified transaction.
        // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR12', 'Dave')
        result = await contract.evaluateTransaction(
            "QueryCarInfo",
            carid
        );        
        console.log("Transaction has been submitted");        

        // Disconnect from the gateway.
        await gateway.disconnect();
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        res_str = `{"resultcode":"failed", "msg":"차량 조회에 실패하였습니다."}`
        res.json(JSON.parse(res_str))
        return
    }
    // 호출한 결과를 WB에게 전송함(res)
    res_str = `{"resultcode":"success", "msg":${result}}`
    res.json(JSON.parse(res_str))
})

router.post("/renteCar", async(req,res)=>{
   
    // 차량 등록하기 화면에서 사용자가 입력한 정보를 읽어오기
    const {carid} = req.body
    // + 쿠키에서 사용자 ID 를 읽어와야함
    const userCookie = req.cookies[`USER`]
    userData = JSON.parse(userCookie)
    // userData.userid

    // 체인코드에 있는 RegisterCar 함수를 호출해야함
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname,"..", "ccp", "connection-org1.json");
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
        const contract = network.getContract("gongGuCar");

        // Submit the specified transaction.
        // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR12', 'Dave')
        await contract.submitTransaction(
            "RenteCar",
            userData.userid,
            carid
        );        
        console.log("Transaction has been submitted");        

        // Disconnect from the gateway.
        await gateway.disconnect();
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        res_str = `{"resultcode":"failed", "msg":"차량 대여를 실패하였습니다."}`
        res.json(JSON.parse(res_str))
        return
    }
    // 호출한 결과를 WB에게 전송함(res)
    res_str = `{"resultcode":"success", "msg":"차량 대여를 성공하였습니다."}`
    res.json(JSON.parse(res_str))    
})


router.post("/returnCar", async(req,res)=>{
   
    // 차량 등록하기 화면에서 사용자가 입력한 정보를 읽어오기
    const {carid} = req.body
    // + 쿠키에서 사용자 ID 를 읽어와야함
    const userCookie = req.cookies[`USER`]
    userData = JSON.parse(userCookie)
    // userData.userid

    // 체인코드에 있는 RegisterCar 함수를 호출해야함
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname,"..", "ccp", "connection-org1.json");
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
        const contract = network.getContract("gongGuCar");

        // Submit the specified transaction.
        // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR12', 'Dave')
        await contract.submitTransaction(
            "ReturnCar",
            userData.userid,
            carid
        );        
        console.log("Transaction has been submitted");        

        // Disconnect from the gateway.
        await gateway.disconnect();
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        res_str = `{"resultcode":"failed", "msg":"차량 반납을 실패하였습니다."}`
        res.json(JSON.parse(res_str))
        return
    }
    // 호출한 결과를 WB에게 전송함(res)
    res_str = `{"resultcode":"success", "msg":"차량 반납을 성공하였습니다."}`
    res.json(JSON.parse(res_str))    
})

async function QueryOwnedCarList(userid) {
   
    // 체인코드에 있는 RegisterCar 함수를 호출해야함
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname,"..", "ccp", "connection-org1.json");
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
        const contract = network.getContract("gongGuCar");

        // Submit the specified transaction.
        // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR12', 'Dave')
        result = await contract.evaluateTransaction(
            "QueryOwnedCarList",
            userid
        );        
        console.log("Transaction has been submitted");        

        // Disconnect from the gateway.
        await gateway.disconnect();
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        res_str = `{"resultcode":"failed", "msg":"소유 차량 조회에 실패하였습니다."}`
        return res_str
    }
    // 호출한 결과를 WB에게 전송함(res)
    res_str = `{"resultcode":"success", "msg":${result}}`
    return res_str   
}




module.exports = router
module.exports.QueryOwnedCarList = QueryOwnedCarList
