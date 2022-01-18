import React from 'react';
import { Link } from 'react-router-dom';
import AppLogo from './AppLogo';

import './AppHeader.css';

function AppHeader() {
  return (
    <header className="AppHeader">
      <Link className="AnchorText AppHeader-link" to="/">
        About
      </Link>
      <AppLogo />
      <Link className="AnchorText AppHeader-link" to="/mint">
        Mint
      </Link>
    </header>
  );
}

export default AppHeader;
