import './PageMint.css';
import React, { useCallback, useEffect, useState } from 'react';
import classnames from 'classnames';
import Web3 from 'web3';
import supportedChains from '../data/supportedChains';
import { useWeb3Context } from '../context/Web3Context';
import ButtonConnect from './ButtonConnect';
import AnchorAddress from './AnchorAddress';
import AnchorWalletAddress from './AnchorWalletAddress';

const TOKEN_PRICE = 0.0001; // in eth

const GENERIC_ERROR = {
  code: -1,
  message: 'Unknown error',
};

function PageMint() {
  const { web3State } = useWeb3Context();
  const [numTokens, setNumTokens] = useState(1);
  const [saleStatus, setSaleStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [success, setSuccess] = useState();
  const selectedChain = supportedChains.find((chain) => chain.chain_id === web3State.chainId);
  // Math.round cause of javascript dumbness -- round to 18th decimal cause that's what eth allows
  const ethPrice = Math.round(TOKEN_PRICE * numTokens * 1000000000000000000) / 1000000000000000000;
  useEffect(() => {
    if (!web3State.buttpunkContract || !web3State.connected) return;
    (async () => {
      try {
        const data = await web3State.buttpunkContract.methods.saleStatus().call();
        setSaleStatus(data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [web3State]);

  // request access to the user's MetaMask account

  const mintToken = useCallback(async () => {
    if (!numTokens) return;
    try {
      setError(null);
      setSuccess(null);
      setLoading(true);
      await web3State.buttpunkContract.methods.mintToken(numTokens).send({
        from: web3State.address,
        value: Web3.utils.toWei(`${ethPrice}`, 'ether'),
      });
      setSuccess('Token(s) minted successfully!');
      setLoading(false);
    } catch (err) {
      setError((err && err.error) || err || GENERIC_ERROR);
      setLoading(false);
    }
  }, [numTokens, web3State, ethPrice]);

  return (
    <div className="PageMint">
      <h1 className="PageMint-headline">
        {!saleStatus && web3State.connected ? 'Minting is closed ' : 'Mint ButtPunks ' }
      </h1>
      <div className="PageMint-section">
        <h2 className="PageMint-sectionHeadline">on: </h2>
        <p>{selectedChain.network}</p>
      </div>
      <div className="PageMint-section">
        <h2 className="PageMint-sectionHeadline">with contract: </h2>
        {web3State.buttpunkContractAddress ? (
          <AnchorAddress chainId={web3State.chainId} address={web3State.buttpunkContractAddress} />
        ) : (
          <span>[smart contract has not been deployed on this chain]</span>
        )}
      </div>
      <div className="PageMint-section">
        <h2 className="PageMint-sectionHeadline">via wallet: </h2>
        {web3State.connected ? (
          <span className="SectionConnection-address">
            <AnchorWalletAddress />
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
        <button
          className={
            classnames(
              'Button',
              {
                'Button--disabled': !saleStatus || !web3State.connected,
                'Button--loading': loading,
              },
            )
          }
          type="button"
          disabled={loading || !saleStatus || !web3State.connected}
          onClick={mintToken}
        >
          Confirm
        </button>
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
