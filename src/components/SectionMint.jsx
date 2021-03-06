import React, { useCallback, useEffect, useState } from 'react';
import classnames from 'classnames';
import Web3 from 'web3';
import supportedChains from '../data/supportedChains';
import { useWeb3Context } from '../context/Web3Context';
import AnchorAddress from './AnchorAddress';
import ButtonConnect from './ButtonConnect';
import AnchorWalletAddress from './AnchorWalletAddress';

import './SectionMint.css';

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
    setError(null);
    if (!web3State.connected) {
      return;
    }
    const isProd = false && process.env.NODE_ENV !== 'development'; // TODO: UPDATE WHEN WE GO LIVE FOR REAL
    const isWrongChain = (isProd && web3State.chainId !== 1)
      || (!isProd && !web3State.buttpunkContractAddress);
    const targetChain = isProd
      ? supportedChains.find((chain) => chain.network === 'mainnet')
      : supportedChains.find((chain) => chain.network === 'rinkeby');
    if (isWrongChain) {
      setError(`Your wallet is currently connected to the wrong chain. Please connect to ${targetChain.name} to mint butts.`);
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
  }, [
    web3State.connected,
    web3State.chainId,
    web3State.buttpunkContract,
    web3State.buttpunkContractAddress,
  ]);

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
    <div className={classnames('SectionMint', { 'SectionMint--connected': web3State.connected })}>
      {web3State.buttpunkContractAddress ? (
        <>
          <div className="SectionMint-section SectionMint-section--wallet">
            <span className="SectionMint-sectionHeadline">
              wallet:
            </span>
            <AnchorWalletAddress />
          </div>
          <div className="SectionMint-section SectionMint-section--contract">
            <h2 className="SectionMint-sectionHeadline">smart contract: </h2>
            <AnchorAddress
              className="SectionMint-value"
              chainId={web3State.chainId}
              address={web3State.buttpunkContractAddress}
            />
          </div>
          <div className="SectionMint-section SectionMint-section--qty">
            <label className="SectionMint-inputLabel" htmlFor="token-quantity">
              <span className="SectionMint-sectionHeadline">
                qty of butts:
              </span>
              <div className="SectionMint-inputNoteWrapper">
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
                  ??
                </p>
              </div>
            </label>
          </div>
          <div className="SectionMint-section SectionMint-section--confirm">
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
              Confirm Butts
            </button>
          </div>
        </>
      ) : (
        <div className="SectionMint-section SectionMint-section--connect">
          <p className="SectionMint-headline">Connect to the Ethereum network to mint tokens.</p>
          {!web3State.connected ? (
            <ButtonConnect className="SectionMint-connect" />
          ) : (
            <AnchorWalletAddress />
          )}
        </div>
      )}
      {error || success ? (
        <div className="SectionMint-section SectionMint-section--messages">
          {error ? (
            <p className="SectionMint-message SectionMint-message--error">
              {`Error${
                error.code ? ` ${error.code}` : ''
              }: ${error.message || error}`}

            </p>
          ) : (
            ''
          )}
          {success ? (
            <p className="SectionMint-message SectionMint-message--success">{success}</p>
          ) : (
            ''
          )}
        </div>
      ) : (
        ''
      )}
    </div>
  );
}

export default SectionMint;
