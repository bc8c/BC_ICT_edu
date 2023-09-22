const path = require("path")
const fs = require("fs")
const { Wallets, Gateway } = require("fabric-network")



async function cc_call(id, fn_name, args){

    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname,"..", "ccp", "connection-org1.json");
        let ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), "wallet");
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get(id);
        if (!identity) {
            console.log(
                'An identity for the user "appUser" does not exist in the wallet'
            );
            console.log("Run the registerUser.js application before retrying");
            console.error(`Failed to submit transaction: ${error}`);            
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: id,
            discovery: { enabled: true, asLocalhost: true },
        });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork("mychannel");

        // Get the contract from the network.
        const contract = network.getContract("fungusfactory");
        var result

        if (fn_name == "GetFungiByOwner") {
            // GetFungiByOwner 호출시
            result = await contract.evaluateTransaction(fn_name);
        } else if (fn_name == "CreateRandomFungus"){
            // CreateRandomFungus 호출시
            result = await contract.submitTransaction(fn_name, args)
        } else if (fn_name == "Feed"){
            // CreateRandomFungus 호출시
            result = await contract.submitTransaction(fn_name, args[0], args[1])
        } else if (fn_name == "TransferFrom"){
            // CreateRandomFungus 호출시
            result = await contract.submitTransaction(fn_name, args[0], args[1], args[2])
        } else result = "not supported function name"        

        console.log("Transaction has been submitted");
        
        // Disconnect from the gateway.
        await gateway.disconnect();

        return result;
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);        
    }
}

module.exports.cc_call = cc_call;