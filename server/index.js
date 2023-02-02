const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const secp = require("ethereum-cryptography/secp256k1");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

app.use(cors());
app.use(express.json());

const balances = {
  "0x26025b8b45778f15c1459bdb199ddc76ebb18a61": 100,
  "0x216f86afaa3d8084aa3a624ed6f9e7a623275a06": 50,
  "0xeb36324128451bbe6fb945bdfb6a0ac6a97e3e1c": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  //TODO:  get a signature from client-side application
  const { amount, recipient, msg, signature } = req.body;
  
  // recover the public key from the signature and get the address to use as the sender below
  try {
    // const sign = signature[0];
    // const rBit = signature[1];
    // const recoveredPublicKey = secp.recoverPublicKey(hash, sign, rBit);
  
    // const sender = `0x${toHex(keccak256(recoveredPublicKey.slice(1)).slice(-20))}`;

    
    const messageInBytes = utf8ToBytes(msg);
    const hash = keccak256(messageInBytes);
    const formattedSignature =Uint8Array.from(Object.values(signature[0]));
    const recoveredPublicKey = secp.recoverPublicKey(hash, formattedSignature, signature[1]);
    // console.log(recoveredPublicKey);
    const sender = `0x${toHex(keccak256(recoveredPublicKey.slice(1)).slice(-20))}`;
    // console.log(sender);

    setInitialBalance(sender);
    setInitialBalance(recipient);


    //verify
    const verification = secp.verify(formattedSignature,  hash, recoveredPublicKey);

    if(!verification) {
      res.status(400).send({message: 'Verification failed'})
    }
    else if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender], message: 'Transfer successful' });
    }
  } catch (error) {
      console.log(error.message)
    }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
