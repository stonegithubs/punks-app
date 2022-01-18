import './AppFooter.css';
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Link } from 'react-router-dom';

function AppFooter({ className }) {
  return (
    <footer className={classnames('AppFooter', className)}>
      <p>
        <Link className="AnchorText" to="/terms">Terms & Conditions</Link>
      </p>
      <p className="AppFooter-legal">
        ButtPunks is not affiliated with LarvaLabs. ButtPunks is a parody of CryptoPunks.
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
