import React from 'react';
import AppLogo from './AppLogo';
import AnchorText from './AnchorText';

import './AppHeader.css';

function AppHeader() {
  return (
    <header className="AppHeader">
      <AnchorText className="AppHeader-link">Mint</AnchorText>
      <AnchorText className="AppHeader-logo" href="/">
        <AppLogo />
      </AnchorText>
      <AnchorText className="AppHeader-link">Owners</AnchorText>
    </header>
  );
}

export default AppHeader;
