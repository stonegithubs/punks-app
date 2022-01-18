import './AppFooter.css';
import React from 'react';

import AnchorText from './AnchorText';

function AppFooter() {
  return (
    <footer className="AppFooter">
      <p>
        <AnchorText href="/">Terms & Conditions</AnchorText>
      </p>
      <p className="AppFooter-legal">
        ButtPunks is not affiliated with LarvaLabs. It is a parody of CryptoPunks and nothing more.
      </p>
    </footer>
  );
}

export default AppFooter;
