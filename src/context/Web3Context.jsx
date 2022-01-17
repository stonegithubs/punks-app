import React, {
  createContext, useReducer, useMemo, useEffect, useContext,
} from 'react';
import PropTypes from 'prop-types';

import { connect, disconnect } from '../service/web3';

// STATE
const INITIAL_STATE = {
  web3: null,
  provider: null,
  connected: false,
  address: null,
  chainId: 1,
  networkId: 1,
};

// ACTIONS
export const ACTIONS = {
  CONNECT: 'WEB3_CONNECT',
  EVENT_CLOSE: 'WEB3_EVENT_CLOSE',
  EVENT_ACCOUNTS_CHANGE: 'WEB3_EVENT_ACCOUNTS_CHANGE',
  EVENT_CHAIN_CHANGE: 'WEB3_EVENT_CHAIN_CHANGE',
  EVENT_NETWORK_CHANGE: 'WEB3_EVENT_NETWORK_CHANGE',
};
export async function web3Connect() {
  const res = await connect();
  return [ACTIONS.EVENT_NETWORK_CHANGE, res];
}
export async function web3Disconnect() {
  await disconnect();
  return [ACTIONS.EVENT_CLOSE];
}
export function web3HandlerClose() {
  return [ACTIONS.EVENT_NETWORK_CHANGE];
}
export function web3HandlerAccountsChange(accounts) {
  return [ACTIONS.EVENT_NETWORK_CHANGE, { address: accounts[0] }];
}
export async function web3HandlerChainChange(web3, chainId) {
  const networkId = await web3.eth.net.getId();
  return [ACTIONS.EVENT_NETWORK_CHANGE, { chainId, networkId }];
}

// REDUCER
function REDUCER(state, [type, payload]) {
  switch (type) {
    case ACTIONS.CONNECT:
      return {
        ...state,
        connected: true,
        web3: payload.web3,
        provider: payload.provider,
        address: payload.address,
        chainId: payload.chainId,
        networkId: payload.networkId,
      };
    case ACTIONS.EVENT_CLOSE:
      return {
        ...state,
        ...INITIAL_STATE,
        chainId: state.chainId,
      };
    case ACTIONS.EVENT_ACCOUNTS_CHANGE:
      return {
        ...state,
        address: payload.address,
      };
    case ACTIONS.EVENT_CHAIN_CHANGE:
      return {
        ...state,
        chainId: payload.chainId,
        networkId: payload.networkId,
      };
    case ACTIONS.EVENT_NETWORK_CHANGE:
      return {
        ...state,
        chainId: payload.chainId,
        networkId: payload.networkId,
      };
    default:
      return { ...state };
  }
}

const Web3Context = createContext({
  state: INITIAL_STATE,
  connect: () => {},
});

export function Web3Provider({
  children,
}) {
  const [web3State, web3Dispatch] = useReducer(REDUCER, INITIAL_STATE);

  // wrap value in memo so we only re-render when necessary
  const providerValue = useMemo(() => ({
    web3State,
    web3Dispatch,
  }), [web3State, web3Dispatch]);

  // web3 events -> update state
  useEffect(() => {
    if (!web3State.provider || !web3State.provider.on || !web3State.web3) {
      return null;
    }
    web3State.provider.on('disconnect', () => web3Dispatch(web3HandlerClose()));
    web3State.provider.on('accountsChanged', (accounts) => web3Dispatch(web3HandlerAccountsChange(accounts)));
    web3State.provider.on('chainChanged', (chainId) => web3Dispatch(web3HandlerChainChange(web3State.web3, chainId)));

    // unbinds
    return () => {
      // TODO: figure out how to clean up (web3State.provider.off didn't work)
    };
  }, [web3State.provider, web3State.web3]);

  return (
    <Web3Context.Provider value={providerValue}>
      {children}
    </Web3Context.Provider>
  );
}
Web3Provider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export function useWeb3Context() {
  return useContext(Web3Context);
}
