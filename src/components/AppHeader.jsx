import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { useWeb3Context } from '../context/Web3Context';
import AppLogo from './AppLogo';
import ButtonConnect from './ButtonConnect';
import AnchorWalletAddress from './AnchorWalletAddress';

import './AppHeader.css';

function AppHeader({ className }) {
  const { web3State } = useWeb3Context();
  return (
    <header className={classnames('AppHeader', className)}>
      <Link className="AppHeader-logo" to="/">
        <AppLogo />
      </Link>
      <div className="AppHeader-connect">
        {web3State.connected ? (
          <span className="SectionConnection-address">
            <AnchorWalletAddress />
          </span>
        ) : (
          <ButtonConnect />
        )}
      </div>
    </header>
  );
}

AppHeader.defaultProps = {
  className: '',
};

AppHeader.propTypes = {
  className: PropTypes.string,
};

export default AppHeader;
