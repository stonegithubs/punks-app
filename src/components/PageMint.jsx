import './PageMint.css';
import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import { getContract, getContractAddress } from '../service/web3';
import supportedChains from '../data/supportedChains';
import { useWeb3Context, web3Disconnect } from '../context/Web3Context';
import { prettyAddress } from '../util/web3Address';
import ButtonConnect from './ButtonConnect';

const TOKEN_PRICE = 0.0001; // in eth

const GENERIC_ERROR = {
  code: -1,
  message: 'Unknown error',
};

function PageMint() {
  const { web3State, web3Dispatch } = useWeb3Context();
  const [numTokens, setNumTokens] = useState(1);
  const [saleStatus, setSaleStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [success, setSuccess] = useState();
  const selectedChain = supportedChains.find((chain) => chain.chain_id === web3State.chainId);
  const contractAddress = getContractAddress(web3State.chainId);
  // Math.round cause of javascript dumbness -- round to 18th decimal cause that's what eth allows
  const ethPrice = Math.round(TOKEN_PRICE * numTokens * 1000000000000000000) / 1000000000000000000;
  useEffect(() => {
    if (!web3State.connected) return;
    (async () => {
      try {
        const contract = await getContract();
        const data = await contract.methods.saleStatus().call();
        setSaleStatus(data);
        setLoading(false);
      } catch (err) {
        // setError((err && err.error) || err || GENERIC_ERROR);
        setLoading(false);
      }
    })();
  }, [web3State.connected]);

  // request access to the user's MetaMask account

  async function mintToken() {
    if (!numTokens) return;
    try {
      setError(null);
      setSuccess(null);
      setLoading(true);
      const contract = await getContract();
      await contract.methods.mintToken(numTokens).send({
        from: web3State.address,
        value: Web3.utils.toWei(`${ethPrice}`, 'ether'),
      });
      setSuccess('Token(s) minted successfully!');
      setLoading(false);
    } catch (err) {
      setError((err && err.error) || err || GENERIC_ERROR);
      setLoading(false);
    }
  }

  return (
    <div className="PageMint">
      <h1 className="PageMint-headline">
        {!saleStatus && web3State.connected ? 'Minting is closed ' : 'Mint Butts ' }
      </h1>
      <div className="PageMint-section">
        <h2 className="PageMint-sectionHeadline">on: </h2>
        <p>{selectedChain.name}</p>
      </div>
      <div className="PageMint-section">
        <h2 className="PageMint-sectionHeadline">with contract: </h2>
        {contractAddress ? (
          <a href={`https://etherscan.io/address/${contractAddress}`} target="_blank" rel="noreferrer">{prettyAddress(contractAddress)}</a>
        ) : (
          <span>[smart contract has not been deployed on this chain]</span>
        )}
      </div>
      <div className="PageMint-section">
        <h2 className="PageMint-sectionHeadline">via wallet: </h2>
        {web3State.connected ? (
          <span className="SectionConnection-address">
            {prettyAddress(web3State.address)}
            <button className="ButtonText" type="button" onClick={async () => web3Dispatch(await web3Disconnect())}>
              (disconnect)
            </button>
          </span>
        ) : (
          <ButtonConnect />
        )}
      </div>
      <div className="PageMint-section">
        <label className="PageMint-inputLabel" htmlFor="token-quantity">
          <span className="PageMint-sectionHeadline">
            qty (
            {TOKEN_PRICE}
            Ξ ea):
          </span>
          <input
            id="token-quantity"
            className="PageMint-input"
            onChange={(e) => setNumTokens(parseInt(e.target.value, 10))}
            type="number"
            min="1"
            max="20"
            required
            value={numTokens}
          />
        </label>
      </div>
      <div className="PageMint-section">
        <button className="Button" type="button" disabled={loading || !saleStatus || !web3State.connected} onClick={mintToken}>Mint ButtPunk(s)</button>
      </div>
      <div className="PageMint-section">
        {error ? (
          <p style={{ fontSize: '12px', color: 'red' }}>
            {`Error${
              error.code ? ` ${error.code}` : ''
            }: ${error.message || error}`}

          </p>
        ) : (
          ''
        )}
        {success ? (
          <p style={{ fontSize: '12px', color: 'green' }}>{success}</p>
        ) : (
          ''
        )}
      </div>
    </div>
  );
}

export default PageMint;
