export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/users/Admin/msp
export CORE_PEER_ADDRESS=peer0.compx.org:7051
export CORE_PEER_LOCALMSPID=CompXMSP
export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peers/peer0.compx.org/tls/ca.crt


export CHANNEL_NAME=invoice
peer channel create -o orderer.compx.org:7050 -c $CHANNEL_NAME -f ./channel-artifacts/channel.tx --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/orderers/orderer.compx.org/msp/tlscacerts/tlsca.compx.org-cert.pem


export CHANNEL_NAME=invoice 
configtxgen -profile InvoiceChannel -outputCreateChannelTx ./channel-artifacts/channel.tx -channelID $CHANNEL_NAME
configtxgen -profile InvoiceChannel -outputAnchorPeersUpdate ./channel-artifacts/CompXMSPAnchors.tx -channelID $CHANNEL_NAME -asOrg CompX

peer channel create -o orderer.compx.org:7050 -c $CHANNEL_NAME -f ./channel-artifacts/channel.tx --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/orderers/orderer.compx.org/msp/tlscacerts/tlsca.compx.org-cert.pem