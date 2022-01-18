import './SectionConnect.css';
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { useWeb3Context, web3Connect, web3Disconnect } from '../context/Web3Context';
import ButtonPrimary from './ButtonPrimary';
import ButtonText from './ButtonText';

function SectionConnect({ className }) {
  const {
    web3State,
    web3Dispatch,
  } = useWeb3Context();
  return (
    <div className={classnames('SectionConnect', className)}>
      {!web3State.connected ? (
        <ButtonPrimary onClick={async () => web3Dispatch(await web3Connect())}>
          Connect Wallet
        </ButtonPrimary>
      ) : (
        <>
          <p style={{ fontSize: '16px' }}>
            {`${web3State.address.slice(0, 10)}...${web3State.address.slice(-10)}`}
          </p>
          <ButtonText onClick={async () => web3Dispatch(await web3Disconnect())}>
            Disconnect
          </ButtonText>
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
