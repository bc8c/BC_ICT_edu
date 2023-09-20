#!/bin/bash

pushd network

./networkdown.sh

popd

pushd application

rm -rf wallet

popd