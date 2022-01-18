import './SectionConnect.css';
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { useWeb3Context, web3Connect, web3Disconnect } from '../context/Web3Context';

function SectionConnect({ className }) {
  const {
    web3State,
    web3Dispatch,
  } = useWeb3Context();
  return (
    <div className={classnames('SectionConnect', className)}>
      {!web3State.connected ? (
        <button className="ButtonPrimary" type="button" onClick={async () => web3Dispatch(await web3Connect())}>
          Connect Wallet
        </button>
      ) : (
        <>
          <p style={{ fontSize: '16px' }}>
            {`${web3State.address.slice(0, 10)}...${web3State.address.slice(-10)}`}
          </p>
          <button className="ButtonText" type="button" onClick={async () => web3Dispatch(await web3Disconnect())}>
            Disconnect
          </button>
        </>
      )}
    </div>
  );
}

SectionConnect.defaultProps = {
  className: '',
};

SectionConnect.propTypes = {
  className: PropTypes.string,
};

export default SectionConnect;
