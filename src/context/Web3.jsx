import React, {
  createContext, useReducer, useMemo, useEffect,
} from 'react';
import PropTypes from 'prop-types';

import SmartContract from '../artifacts/contracts/pfpTest.sol/PFPTest.json';
import { connect as web3Connect, disconnect as web3Disconnect } from '../service/web3';

export const CONTRACT_ADDRESS = {
  1: '', // mainnet
  3: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9', // ropsten
  4: '0xF5f4A9FB11C56E2663d644bD64C690C58c4c9656', // rinkeby
  5: '', // goerli
  42: '', // kavan
  1337: '0x5fbdb2315678afecb367f032d93f642f64180aa3', // localhost
};

const INITIAL_STATE = {
  web3: null,
  provider: null,
  connected: false,
  address: null,
  chainId: 1,
  networkId: 1,
};
const ACTIONS = {
  CONNECT: 'WEB3_CONNECT',
  EVENT_CLOSE: 'WEB3_EVENT_CLOSE',
  EVENT_ACCOUNTS_CHANGE: 'WEB3_EVENT_ACCOUNTS_CHANGE',
  EVENT_CHAIN_CHANGE: 'WEB3_EVENT_CHAIN_CHANGE',
  EVENT_NETWORK_CHANGE: 'WEB3_EVENT_NETWORK_CHANGE',
};
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
  const [state, dispatch] = useReducer(REDUCER, INITIAL_STATE);

  // wrap value in memo so we only re-render when necessary
  const providerValue = useMemo(() => ({
    state,
    getContract: async () => {
      const address = CONTRACT_ADDRESS[state.chainId];
      if (!address) throw new Error(`Contract not deployed on network ${state.chainId}.`);
      return new state.web3.eth.Contract(SmartContract.abi, address);
    },
    connect: async () => {
      const res = await web3Connect();
      dispatch([ACTIONS.CONNECT, res]);
    },
    disconnect: async () => {
      web3Disconnect();
      dispatch([ACTIONS.EVENT_CLOSE]);
    },
  }), [state]);

  // web3 events -> update state
  useEffect(() => {
    if (!state.provider || !state.provider.on || !state.web3) {
      return null;
    }

    // disconnect
    const closeHandler = () => async () => {
      web3Disconnect();
      dispatch([ACTIONS.EVENT_CLOSE]);
    };
    state.provider.on('disconnect', closeHandler);

    // accounts change
    const accountsChangedHandler = async (accounts) => {
      dispatch([ACTIONS.EVENT_ACCOUNTS_CHANGE, { address: accounts[0] }]);
    };
    state.provider.on('accountsChanged', accountsChangedHandler);

    // chain change
    const chainChangedHandler = async (chainId) => {
      const networkId = await state.web3.eth.net.getId();
      dispatch([ACTIONS.EVENT_CHAIN_CHANGE, { chainId, networkId }]);
    };
    state.provider.on('chainChanged', chainChangedHandler);

    // unbinds
    return () => {
      // TODO: figure out how to clean up
      // state.provider.off('disconnect', closeHandler);
      // state.provider.off('accountsChanged', accountsChangedHandler);
      // state.provider.off('chainChanged', chainChangedHandler);
    };
  }, [state.provider, state.web3]);

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

export default Web3Context;
