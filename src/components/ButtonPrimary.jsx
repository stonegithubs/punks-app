import './ButtonPrimary.css';
import React from 'react';
import PropTypes from 'prop-types';

function ButtonPrimary({ children, disabled, onClick }) {
  return (
    <button className="ButtonPrimary" type="button" disabled={disabled} onClick={onClick}>{children}</button>
  );
}

ButtonPrimary.defaultProps = {
  disabled: false,
};

ButtonPrimary.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  disabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

export default ButtonPrimary;
