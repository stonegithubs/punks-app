import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import AnchorAddress from './AnchorAddress';

import './AnchorWalletAddress.css';
import { useWeb3Context, web3Disconnect } from '../context/Web3Context';

function AnchorWalletAddress({ className }) {
  const { web3State, web3Dispatch } = useWeb3Context();
  const [loadingConnection, setLoadingConnection] = useState(false);
  async function disconnect() {
    try {
      setLoadingConnection(true);
      web3Dispatch(await web3Disconnect());
    } catch (err) {
      console.error((err && err.error) || err);
      setLoadingConnection(false);
    }
  }
  return (
    <span className={classnames('AnchorWalletAddress', className)}>
      <AnchorAddress chainId={web3State.chainId} address={web3State.address} />
      <button
        className="ButtonText"
        disabled={loadingConnection}
        type="button"
        onClick={disconnect}
      >
        (disconnect)
      </button>
    </span>
  );
}

AnchorWalletAddress.defaultProps = {
  className: '',
};

AnchorWalletAddress.propTypes = {
  className: PropTypes.string,
};

export default AnchorWalletAddress;
