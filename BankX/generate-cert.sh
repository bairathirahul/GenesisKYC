#!/usr/bin/env bash

# Parameters
ORGNAME=compx
ORGHOST=compx.org
CASERVER=ca.${ORGHOST}:8054
ADMINUNAME=admin
ADMINSECRET=adminpw
ADMINCAURL=https://${ADMINUNAME}:${ADMINSECRET}@${CASERVER}

# Environment variable
export FABRIC_CA_CLIENT_HOME=${PWD}/fabric-ca/client

# Copy the TLS certificate from server
cp ${PWD}/fabric-ca/server/ca-cert.pem ${PWD}/fabric-ca/client

# Enroll the admin user
fabric-ca-client enroll -u ${ADMINCAURL}

# Delete directory if exists
rm -r ${PWD}/crypto-config

# Create Directory
mkdir ${PWD}/crypto-config

# Get CA Certificates
fabric-ca-client getcacert -u ${ADMINCAURL} -M ${PWD}/crypto-config/msp

# Register Admin user
fabric-ca-client register --id.name Admin --id.secret Adminpw --id.type user --id.affiliation compx
fabric-ca-client enroll -u https://Admin:Adminpw@${CASERVER} -M ${PWD}/crypto-config/users/Admin/msp

# Client user registration
# fabric-ca-client register --id.name Client --id.secret Clientpw --id.type user --id.affiliation compx
# fabric-ca-client enroll -u https://Client:Clientpw@${CASERVER} -M ${PWD}/crypto-config/users/Client@compx.org/msp

#### Node certificates

# TLS Enrollment Certificates
fabric-ca-client enroll -u ${ADMINCAURL} --csr.hosts orderer.${ORGHOST} --enrollment.profile tls -M ${PWD}/crypto-config/orderers/orderer.${ORGHOST}/tls

fabric-ca-client enroll -u ${ADMINCAURL} --csr.hosts peer0.${ORGHOST} --enrollment.profile tls -M ${PWD}/crypto-config/peers/peer0.${ORGHOST}/tls

fabric-ca-client enroll -u ${ADMINCAURL} --csr.hosts peer1.${ORGHOST} --enrollment.profile tls -M ${PWD}/crypto-config/peers/peer1.${ORGHOST}/tls

# Nodes identity certificate
fabric-ca-client register --id.name orderer.${ORGHOST} --id.secret pw --id.type node --id.affiliation compx
fabric-ca-client enroll -u https://orderer.${ORGHOST}:pw@${CASERVER} -M ${PWD}/crypto-config/orderers/orderer.${ORGHOST}/msp

fabric-ca-client register --id.name peer0.${ORGHOST} --id.secret pw --id.type node --id.affiliation compx
fabric-ca-client enroll -u https://peer0.${ORGHOST}:pw@${CASERVER} -M ${PWD}/crypto-config/peers/peer0.${ORGHOST}/msp

fabric-ca-client register --id.name peer1.${ORGHOST} --id.secret pw --id.type node --id.affiliation compx
fabric-ca-client enroll -u https://peer1.${ORGHOST}:pw@${CASERVER} -M ${PWD}/crypto-config/peers/peer1.${ORGHOST}/msp