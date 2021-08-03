#!/usr/bin/env bash

ckbIndexerBinary="./ckb-indexer"
indexerDataPath="./data/db"
snapshot=20210801-nervos-ckb-node-0.43.1-testnet-snapshot.7z

if [ ! -f ./$ckbIndexerBinary ]; then
	echo "The ckb-indexer binary was not found in the current directory. This script should only be executed from the ckb-indexer directory."
	exit 1
fi

if [ ! -f ./$snapshot ]; then
	curl -O https://s3.amazonaws.com/cdn.ckb.tools/snapshots/$snapshot -L
fi

if [ -d $indexerDataPath ]; then
	rm -r $indexerDataPath
fi

7z x $snapshot -o$indexerDataPath -aoa
