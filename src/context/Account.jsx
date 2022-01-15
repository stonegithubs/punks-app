import React, {
  createContext, useReducer, useMemo, useEffect, useContext,
} from 'react';
import PropTypes from 'prop-types';

import { apiGetAccountAssets } from '../service/ethApi';
import Web3Context from './Web3';

const INITIAL_STATE = {
  address: null,
  chainId: 1,
  assets: null,
};
const ACTIONS = {
  SET: 'ACCOUNT_SET',
  SET_ASSETS: 'ACCOUNT_ASSETS_ASSETS',
  RESET: 'ACCOUNT_RESET',
};
function REDUCER(state, [type, payload]) {
  switch (type) {
    case ACTIONS.SET:
      return {
        ...INITIAL_STATE,
        address: payload.address,
        chainId: payload.chainId,
      };
    case ACTIONS.SET_ASSETS:
      return {
        ...state,
        assets: payload.assets,
      };
    case ACTIONS.RESET:
      return {
        ...state,
        ...INITIAL_STATE,
      };
    default:
      return { ...state };
  }
}

const AccountContext = createContext({
  state: INITIAL_STATE,
  connect: () => {},
});

export function AccountProvider({
  children,
}) {
  const { state: web3State } = useContext(Web3Context);
  const [state, dispatch] = useReducer(REDUCER, INITIAL_STATE);

  // wrap value in memo so we only re-render when necessary
  const providerValue = useMemo(() => ({
    state,
  }), [state]);

  // fetch account assets
  useEffect(() => {
    if (!web3State.address || !web3State.chainId) return;
    async function updateAssets() {
      dispatch([ACTIONS.SET, { address: web3State.address, chainId: web3State.chainId }]);
      const data = await apiGetAccountAssets(web3State.address, web3State.chainId);
      if (data) {
        dispatch([ACTIONS.SET_ASSETS, { assets: data[0] }]);
      }
    }
    updateAssets();
  }, [web3State.address, web3State.chainId]);

  return (
    <AccountContext.Provider value={providerValue}>
      {children}
    </AccountContext.Provider>
  );
}

AccountProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default AccountContext;
