import './App.css';
import React, { useContext, useEffect, useState } from 'react';
import Web3 from 'web3';
import Web3Context from './context/Web3';
import supportedChains from './data/supportedChains';

const TOKEN_PRICE = 0.0001; // in eth

const GENERIC_ERROR = {
  code: -1,
  message: 'Unknown error',
};

function App() {
  const {
    state: web3State, connect, getContract, disconnect,
  } = useContext(Web3Context);
  const selectedChain = supportedChains.find((chain) => chain.chain_id === web3State.chainId);
  const [numTokens, setNumTokens] = useState(1);
  const [saleStatus, setSaleStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [success, setSuccess] = useState();
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
  }, [web3State, getContract]);

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
    <div className="App">
      <header className="App-header">
        <div style={{ textAlign: 'left' }}>
          <p style={{ fontSize: '13px' }}>Connected to</p>
          <p style={{ fontSize: '13px', fontWeight: 'bold' }}>{selectedChain.name}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          {!web3State.connected ? (
            <button disabled={loading} type="button" onClick={() => connect()}>Connect</button>
          ) : (
            <>
              <p style={{ fontSize: '16px' }}>
                {`${web3State.address.slice(0, 10)}...${web3State.address.slice(-10)}`}
              </p>
              <button disabled={loading} style={{ fontSize: '12px' }} type="button" onClick={() => disconnect()}>Disconnect</button>
            </>
          )}
        </div>
      </header>
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
          {!web3State.connected ? (
            <div>
              <h1>
                PFP Test
              </h1>
              <h4>Connect to mint a token</h4>
              <button disabled={loading} type="button" onClick={() => connect()}>Connect</button>
            </div>
          ) : (
            <div>
              <h1>
                PFP Test
              </h1>
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
            display: 'flex', justifyContent: 'space-between', maxWidth: '600px', margin: '0 auto',
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
        {/* {loading ? (<h4>Loading...</h4>) : ''}
        {saleStatus ? (
          <>
            <input
              onChange={(e) => setNumTokens(parseInt(e.target.value, 10))}
              type="number"
              min="1"
              max="20"
              required
              value={numTokens}
              disabled={loading}
            />
            <button type="button" disabled={loading} onClick={mintToken}>Mint Token(s)</button>
            <button type="button" disabled={loading} onClick={pauseSale}>Pause Sale</button>
          </>
        ) : (<button type="button" disabled={loading} onClick={startSale}>Start Sale</button>)}
        <button type="button" disabled={loading} onClick={withdraw}>Withdraw</button>
        */}
      </div>
    </div>
  );
}

export default App;
