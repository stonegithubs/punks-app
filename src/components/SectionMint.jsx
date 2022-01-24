import './SectionMint.css';
import React, { useCallback, useEffect, useState } from 'react';
import classnames from 'classnames';
import Web3 from 'web3';
import supportedChains from '../data/supportedChains';
import { useWeb3Context } from '../context/Web3Context';
import ButtonConnect from './ButtonConnect';
import AnchorAddress from './AnchorAddress';

const TOKEN_PRICE = 0.0001; // in eth

const GENERIC_ERROR = {
  code: -1,
  message: 'Unknown error',
};

function SectionMint() {
  const { web3State } = useWeb3Context();
  const [numTokens, setNumTokens] = useState(1);
  const [saleStatus, setSaleStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [success, setSuccess] = useState();
  // Math.round cause of javascript dumbness -- round to 18th decimal cause that's what eth allows
  const ethPrice = Math.round(TOKEN_PRICE * numTokens * 1000000000000000000) / 1000000000000000000;
  useEffect(() => {
    if (!web3State.connected) {
      return;
    }
    const selectedChain = supportedChains.find((chain) => chain.chain_id === web3State.chainId);
    if (process.env.NODE_ENV === 'development' && (!web3State.buttpunkContractAddress)) {
      setError(`You are currently connected to ${(selectedChain && selectedChain.name) || `chain ${web3State.chainId}`}. Change your wallet chain to Ethereum to mint butts.`);
      return;
    }
    if (process.env.NODE_ENV !== 'development' && (!selectedChain || selectedChain.chain_id !== 1)) {
      setError(`You are currently connected to ${(selectedChain && selectedChain.name) || `chain ${web3State.chainId}`}. Change your wallet chain to Ethereum Mainnet to mint butts.`);
      return;
    }
    setError(null);

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
    <div className="SectionMint">
      {web3State.buttpunkContractAddress ? (
        <>
          <div className="SectionMint-section">
            <h2 className="SectionMint-sectionHeadline">smart contract: </h2>
            <AnchorAddress
              className="SectionMint-value"
              chainId={web3State.chainId}
              address={web3State.buttpunkContractAddress}
            />
          </div>
          <div className="SectionMint-section">
            <div className="SectionMint-section">
              <label className="SectionMint-inputLabel" htmlFor="token-quantity">
                <span className="SectionMint-sectionHeadline">
                  qty of butts:
                </span>
                <input
                  id="token-quantity"
                  className="SectionMint-input SectionMint-value"
                  onChange={(e) => setNumTokens(parseInt(e.target.value, 10))}
                  type="number"
                  min="1"
                  max="20"
                  required
                  value={numTokens}
                />
                <p className="SectionMint-inputNote">
                  {TOKEN_PRICE}
                  Ξ
                </p>
              </label>
            </div>
          </div>
          <div className="SectionMint-section">
            <button
              className={
                classnames(
                  'SectionMint-confirm',
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
        </>
      ) : (
        <div className="SectionMint-section">
          <p className="SectionMint-headline">Connect to the Ethereum network to mint tokens.</p>
          {!web3State.connected ? (
            <ButtonConnect className="SectionMint-connect" />
          ) : ''}
        </div>
      )}
      <div className="SectionMint-section">
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

export default SectionMint;
