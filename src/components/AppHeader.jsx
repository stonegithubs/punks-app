import React from 'react';
import { Link } from 'react-router-dom';
import AppLogo from './AppLogo';

import './AppHeader.css';

function AppHeader() {
  return (
    <header className="AppHeader">
      <Link className="AnchorText AppHeader-link" to="/mint">
        Mint
      </Link>
      <Link className="AnchorText AppHeader-logo" to="/">
        <AppLogo />
      </Link>
      <Link className="AnchorText AppHeader-link" to="/owners">
        Owners
      </Link>
    </header>
  );
}

export default AppHeader;
