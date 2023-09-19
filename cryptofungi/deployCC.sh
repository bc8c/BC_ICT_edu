#!/bin/bash

pushd network

./deployFungusCC.sh
sleep 5

./deployFeedCC.sh
sleep 5

popd