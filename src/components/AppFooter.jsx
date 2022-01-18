import './AppFooter.css';
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import AnchorText from './AnchorText';

function AppFooter({ className }) {
  return (
    <footer className={classnames('AppFooter', className)}>
      <p>
        <AnchorText href="/">Terms & Conditions</AnchorText>
      </p>
      <p className="AppFooter-legal">
        ButtPunks is not affiliated with LarvaLabs. It is a parody of CryptoPunks and nothing more.
      </p>
    </footer>
  );
}

AppFooter.defaultProps = {
  className: '',
};

AppFooter.propTypes = {
  className: PropTypes.string,
};

export default AppFooter;
