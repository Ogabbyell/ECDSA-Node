import { useState } from "react";
import server from "./server";
import { utf8ToBytes, toHex  } from 'ethereum-cryptography/utils';
import { keccak256 } from 'ethereum-cryptography/keccak';
import * as secp from 'ethereum-cryptography/secp256k1';

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  //generate a signature with recipient and send to the server

  async function transfer(evt) {
    evt.preventDefault();

    //create a signature with given private key 
    const msg = recipient;
    const msgToBytes = utf8ToBytes(msg);
    const hash = keccak256(msgToBytes);
    let signature = await secp.sign(hash, privateKey, { recovered: true });

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        // sender: address,
        amount: parseInt(sendAmount),
        recipient,
        msg,
        signature,
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
