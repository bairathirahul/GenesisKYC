#!/usr/bin/env bash

# Remove containers
docker rm -f cli.compx.org
docker rm -f orderer.compx.org
docker rm -f kafka1.compx.org
docker rm -f kafka2.compx.org
docker rm -f kafka3.compx.org
docker rm -f kafka4.compx.org
docker rm -f zookeeper1.compx.org
docker rm -f zookeeper2.compx.org
docker rm -f zookeeper3.compx.org
docker rm -f couchdb.peer0.compx.org
docker rm -f peer0.compx.org
docker rm -f couchdb.peer1.compx.org
docker rm -f peer1.compx.org

# Prune network and volume
docker network prune -f
docker volume prune -f

# Regenerate channel config
export CHANNEL_NAME=invoice
configtxgen -profile InvoiceGenesis -outputBlock ./channel-artifacts/genesis.block
configtxgen -profile InvoiceChannel -outputCreateChannelTx ./channel-artifacts/channel.tx -channelID $CHANNEL_NAME
configtxgen -profile InvoiceChannel -outputAnchorPeersUpdate ./channel-artifacts/CompXMSP.tx -channelID $CHANNEL_NAME -asOrg CompX

# Re-create containers
docker-compose up -d