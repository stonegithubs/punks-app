import './AppFooter.css';
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Link } from 'react-router-dom';

function AppFooter({ className }) {
  return (
    <footer className={classnames('AppFooter', className)}>
      <p className="AppFooterSection AppFooterSection--contact">
        <div className="AppFooterContactLink">
          ButtPunks is a
          {' '}
          <a href="https://discord.gg/XcYPjZ3TH9" className="AnchorText TextIcon TextIcon--discord">Hella Sick Tight</a>
          {' '}
          collab
        </div>
      </p>
      <p className="AppFooterSection AppFooterSection--contact">
        <div className="AppFooterContactLink">
          Art by
          {' '}
          <a href="https://twitter.com/patricklawler" className="AnchorText TextIcon TextIcon--twitter">Patrick Lawler</a>
        </div>
        <div className="AppFooterContactLink">
          Code by
          {' '}
          <a href="https://twitter.com/itsdustn" className="AnchorText TextIcon TextIcon--twitter">Dustin Boersma</a>
        </div>
      </p>
      <p className="AppFooterSection AppFooterSection--terms">
        <Link className="AnchorText" to="/terms">Terms & Conditions</Link>
      </p>
      <p className="AppFooterSection AppFooterSection--legal">
        ButtPunks is not affiliated with LarvaLabs or CryptoPunks.
        ButtPunks is a parody of CryptoPunks.
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
