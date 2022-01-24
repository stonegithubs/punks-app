import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import AnchorAddress from './AnchorAddress';
import { useWeb3Context, web3Disconnect } from '../context/Web3Context';
import supportedChains from '../data/supportedChains';

import './AnchorWalletAddress.css';

function AnchorWalletAddress({ className }) {
  const { web3State, web3Dispatch } = useWeb3Context();
  const [loadingConnection, setLoadingConnection] = useState(false);
  const selectedChain = supportedChains.find((chain) => chain.chain_id === web3State.chainId);
  async function disconnect() {
    try {
      setLoadingConnection(true);
      web3Dispatch(await web3Disconnect(web3State.web3));
    } catch (err) {
      console.error((err && err.error) || err);
      setLoadingConnection(false);
    }
  }
  return (
    <div className={classnames('AnchorWalletAddress', className)}>
      <span className="AnchorWalletAddress-chain">
        {(selectedChain && selectedChain.name) || 'Unknown Chain'}
      </span>
      <AnchorAddress
        className="AnchorWalletAddress-address"
        chainId={web3State.chainId}
        address={web3State.address}
      />
      <button
        className="AnchorWalletAddress-disconnect ButtonText"
        disabled={loadingConnection}
        type="button"
        onClick={disconnect}
      >
        disconnect wallet
      </button>
    </div>
  );
}

AnchorWalletAddress.defaultProps = {
  className: '',
};

AnchorWalletAddress.propTypes = {
  className: PropTypes.string,
};

export default AnchorWalletAddress;
