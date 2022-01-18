import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { prettyAddress } from '../util/web3Address';
import supportedChains from '../data/supportedChains';

import './AnchorAddress.css';

function AnchorAddress({ chainId, address, className }) {
  const selectedChain = supportedChains.find((chain) => chain.chain_id === chainId);
  const url = chainId === 1 ? 'https://etherscan.io' : `https://${selectedChain.network}.etherscan.io`;
  return (
    <a
      className={classnames('AnchorAddress', 'AnchorText', className)}
      href={`${url}/address/${address}`}
      target="_blank"
      rel="noreferrer"
    >
      {prettyAddress(address)}
    </a>
  );
}

AnchorAddress.defaultProps = {
  chainId: 1,
  className: '',
  address: '0x0000000000000000000000000000000000000000',
};

AnchorAddress.propTypes = {
  className: PropTypes.string,
  chainId: PropTypes.number,
  address: PropTypes.string,
};

export default AnchorAddress;
