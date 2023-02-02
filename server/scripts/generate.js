const secp = require("ethereum-cryptography/secp256k1");
const { hexToBytes, toHex, utf8ToBytes } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");
// const publicKeyToAddress = require("ethereum-public-key-to-address")

// generate random private key
const privateKey = secp.utils.randomPrivateKey();
console.log("Private key: " + toHex(privateKey));

// get publicKey from privateKey
const publicKey = secp.getPublicKey(privateKey);
console.log("Public key: " + toHex(publicKey));

// get address from publicKey
const Address = keccak256(publicKey.slice(1)).slice(-20);
console.log("Address: " + toHex(Address));

const walletAddress = '0x' + toHex(Address);
console.log("walletAddress: " + walletAddress);

// const address = publicKeyToAddress(Buffer.from(publicKey, 'hex')).toLowerCase();
// console.log("Address: " + address);

   


