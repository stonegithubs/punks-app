import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { useWeb3Context, web3Connect } from '../context/Web3Context';

function ButtonConnect({ className }) {
  const {
    web3Dispatch,
  } = useWeb3Context();
  return (
    <button className={classnames('ButtonConnect', 'Button', className)} type="button" onClick={async () => web3Dispatch(await web3Connect())}>
      Connect Wallet
    </button>
  );
}

ButtonConnect.defaultProps = {
  className: '',
};

ButtonConnect.propTypes = {
  className: PropTypes.string,
};

export default ButtonConnect;
