import './ButtonText.css';
import React from 'react';
import PropTypes from 'prop-types';

function ButtonText({ children, disabled, onClick }) {
  return (
    <button className="ButtonText" type="button" disabled={disabled} onClick={onClick}>{children}</button>
  );
}

ButtonText.defaultProps = {
  disabled: false,
};

ButtonText.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  disabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

export default ButtonText;
