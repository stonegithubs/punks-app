import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import AppLogoSrc from '../media/logo.jpg';

import './AppHeader.css';

function AppHeader({ className }) {
  return (
    <header className={classnames('AppHeader', className)}>
      <Link className="AppHeader-logo" to="/">
        <img className="AppHeader-logoImg" src={AppLogoSrc} alt="ButtPunks logo" />
      </Link>
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
