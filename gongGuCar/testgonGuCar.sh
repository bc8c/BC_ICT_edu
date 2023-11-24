#!/bin/bash

C_YELLOW='\033[1;33m'
C_BLUE='\033[0;34m'
C_RESET='\033[0m'

# subinfoln echos in blue color
function infoln() {
  echo -e "${C_YELLOW}${1}${C_RESET}"
}

function subinfoln() {
  echo -e "${C_BLUE}${1}${C_RESET}"
}

# add PATH to ensure we are picking up the correct binaries
export PATH=${HOME}/fabric-samples/bin:$PATH
export FABRIC_CFG_PATH=${PWD}/network/config

# Test Setting
CC_NAME="gongGuCar"
CHANNEL_NAME="mychannel"
PEER_CONN_PARMS="--peerAddresses localhost:7051 --tlsRootCertFiles ${PWD}/network/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles ${PWD}/network/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt --peerAddresses localhost:11051 --tlsRootCertFiles ${PWD}/network/organizations/peerOrganizations/org3.example.com/peers/peer0.org3.example.com/tls/ca.crt"
ORDERER_CA=${PWD}/network/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem

## Set the peer on peer0.org1
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/network/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/network/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051


# Test 수행
## TEST1 : Invoking the chaincode
infoln "TEST1-1 : Invoking the chaincode (RegisterCar)"
set -x
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile $ORDERER_CA -C $CHANNEL_NAME -n ${CC_NAME} $PEER_CONN_PARMS -c '{"function":"RegisterCar","Args":["admin", "eliceCar", "purple", "300"]}' >&log.txt
{ set +x; } 2>/dev/null
cat log.txt
sleep 3


## TEST2 : Invoking the chaincode
infoln "TEST1-2 : Invoking the chaincode (RegisterCar)"
set -x
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile $ORDERER_CA -C $CHANNEL_NAME -n ${CC_NAME} $PEER_CONN_PARMS -c '{"function":"RegisterCar","Args":["choi0516", "porsche-7", "black", "30000"]}' >&log.txt
{ set +x; } 2>/dev/null
cat log.txt
sleep 3

## TEST3 : Invoking the chaincode
infoln "TEST2-1 : Query the chaincode (QueryCarInfo)"
set -x
peer chaincode query -C $CHANNEL_NAME -n ${CC_NAME} -c '{"function":"QueryCarInfo","Args":["CAR8"]}' >&log.txt
{ set +x; } 2>/dev/null
cat log.txt
sleep 3

## TEST4 : Invoking the chaincode
infoln "TEST2-2 : Query the chaincode (QueryCarInfo)"
set -x
peer chaincode query -C $CHANNEL_NAME -n ${CC_NAME} -c '{"function":"QueryCarInfo","Args":["CAR2"]}' >&log.txt
{ set +x; } 2>/dev/null
cat log.txt
sleep 3