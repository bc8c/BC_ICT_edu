#!/bin/bash

pushd application

rm -rf wallet/*

./public/ccp/ccp-generate.sh

npm install

sleep 2

npm start

popd