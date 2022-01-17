import './AppHeader.css';
import React from 'react';
import { useWeb3Context, web3Connect, web3Disconnect } from '../context/Web3Context';
import supportedChains from '../data/supportedChains';

function App() {
  const {
    web3State,
    web3Dispatch,
  } = useWeb3Context();
  const selectedChain = supportedChains.find((chain) => chain.chain_id === web3State.chainId);
  return (
    <header className="AppHeader">
      <div style={{ textAlign: 'left' }}>
        <p style={{ fontSize: '13px' }}>Connected to</p>
        <p style={{ fontSize: '13px', fontWeight: 'bold' }}>{selectedChain.name}</p>
      </div>
      <div style={{ textAlign: 'right' }}>
        {!web3State.connected ? (
          <button type="button" onClick={() => () => web3Dispatch(web3Connect())}>Connect</button>
        ) : (
          <>
            <p style={{ fontSize: '16px' }}>
              {`${web3State.address.slice(0, 10)}...${web3State.address.slice(-10)}`}
            </p>
            <button style={{ fontSize: '12px' }} type="button" onClick={() => () => web3Dispatch(web3Disconnect())}>Disconnect</button>
          </>
        )}
      </div>
    </header>
  );
}

export default App;
