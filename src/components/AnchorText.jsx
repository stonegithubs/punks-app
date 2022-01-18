import './AnchorText.css';
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

function AnchorText({
  children, className, disabled, href,
}) {
  return (
    <a className={classnames('AnchorText', className)} disabled={disabled} href={href}>{children}</a>
  );
}

AnchorText.defaultProps = {
  href: '',
  disabled: false,
  className: '',
};

AnchorText.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  disabled: PropTypes.bool,
  href: PropTypes.string,
  className: PropTypes.string,
};

export default AnchorText;
