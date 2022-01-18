import './PageHome.css';
import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import { getContract } from '../service/web3';
import { useWeb3Context } from '../context/Web3Context';
import supportedChains from '../data/supportedChains';
import SectionConnect from './SectionConnect';

const TOKEN_PRICE = 0.0001; // in eth

const GENERIC_ERROR = {
  code: -1,
  message: 'Unknown error',
};

function App() {
  const { web3State } = useWeb3Context();
  const [numTokens, setNumTokens] = useState(1);
  const [saleStatus, setSaleStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [success, setSuccess] = useState();
  const selectedChain = supportedChains.find((chain) => chain.chain_id === web3State.chainId);
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

  async function startSale() {
    try {
      setError(null);
      setSuccess(null);
      setLoading(true);
      const contract = await getContract();
      await contract.methods.startSale(
        Math.floor((Date.now() + 86400000 * 9) / 1000),
      ).send({
        from: web3State.address,
      });
      setSaleStatus(true);
      setSuccess('Sale started!');
      setLoading(false);
    } catch (err) {
      setError((err && err.error) || err || GENERIC_ERROR);
      setLoading(false);
    }
  }

  async function pauseSale() {
    try {
      setError(null);
      setSuccess(null);
      setLoading(true);
      const contract = await getContract();
      await contract.methods.pauseSale().send({
        from: web3State.address,
      });
      setSaleStatus(false);
      setSuccess('Sale paused!');
      setLoading(false);
    } catch (err) {
      setError((err && err.error) || err || GENERIC_ERROR);
      setLoading(false);
    }
  }

  async function mintToken() {
    if (!numTokens) return;
    try {
      setError(null);
      setSuccess(null);
      setLoading(true);
      const contract = await getContract();
      await contract.methods.mintToken(numTokens).send({
        from: web3State.address,
        value: Web3.utils.toWei(`${TOKEN_PRICE * numTokens}`, 'ether'),
      });
      setSuccess('Token(s) minted successfully!');
      setLoading(false);
    } catch (err) {
      setError((err && err.error) || err || GENERIC_ERROR);
      setLoading(false);
    }
  }

  async function withdraw() {
    if (!numTokens) return;
    try {
      setError(null);
      setSuccess(null);
      setLoading(true);
      const contract = await getContract();
      await contract.methods.withdraw().send({
        from: web3State.address,
      });
      setSuccess('Withdraw successful!');
      setLoading(false);
    } catch (err) {
      setError((err && err.error) || err || GENERIC_ERROR);
      setLoading(false);
    }
  }
  return (
    <div className="PageHome">
      <div>
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
      <div>
        <div>
          <div>
            <h1>
              PFP Test
            </h1>
            <h4 style={{ fontWeight: '400' }}>
              {!web3State.connected ? (
                'Connect to mint a token'
              ) : (
                <>
                  Connected to
                  {' '}
                  <span style={{ fontWeight: 'bold' }}>{selectedChain.name}</span>
                  {' '}
                  as...
                </>
              )}
            </h4>
            <SectionConnect />
          </div>
          {!web3State.connected ? (
            ''
          ) : (
            <div>
              <h4>
                Minting (
                {saleStatus ? 'open' : 'closed'}
                )
              </h4>
              <input
                onChange={(e) => setNumTokens(parseInt(e.target.value, 10))}
                type="number"
                min="1"
                max="20"
                required
                value={numTokens}
                disabled={loading || !saleStatus}
              />
              <button type="button" disabled={loading || !saleStatus} onClick={mintToken}>Mint Token(s)</button>
              <h4>Owner Controls</h4>
              {saleStatus ? (
                <button type="button" disabled={loading} onClick={pauseSale}>Pause Sale</button>
              ) : (
                <button type="button" disabled={loading} onClick={startSale}>Start Sale</button>
              )}
              <button type="button" disabled={loading} onClick={withdraw}>Withdraw</button>
            </div>
          )}

          {/* <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          maxWidth: '600px',
          margin: '0 auto',
        }}
        >
          <p style={{ textAlign: 'left' }}>
            {accountState && accountState.assets && accountState.assets.name}
          </p>
          <p style={{ textAlign: 'right' }}>
            {accountState && accountState.assets && accountState.assets.balance}
            {' '}
            {accountState && accountState.assets && accountState.assets.symbol}
          </p>
        </div> */}
        </div>
      </div>
    </div>
  );
}

export default App;
