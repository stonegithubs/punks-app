import './AppLogo.css';
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

function AppLogo({ className }) {
  return (
    <div className={classnames('AppLogo', className)}>
      <span className="AppLogo-abbr">BUTT</span>
      <h1 className="AppLogo-title">ButtPunks</h1>
      <p className="AppLogo-tagline">Let&apos;s fighting love!</p>
    </div>
  );
}

AppLogo.defaultProps = {
  className: '',
};

AppLogo.propTypes = {
  className: PropTypes.string,
};

export default AppLogo;
