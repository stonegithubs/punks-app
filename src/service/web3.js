import Web3Modal from 'web3modal';
import WalletConnect from '@walletconnect/web3-provider';
import Web3 from 'web3';

import SmartContract from '../artifacts/contracts/pfpTest.sol/PFPTest.json';

const INFURA_ID = '6ae4bfa571f34170800e16cf72824270'; // process.env.INFRA_ID;

export const CONTRACT_ADDRESS = {
  1: '', // mainnet
  3: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9', // ropsten
  4: '0xF5f4A9FB11C56E2663d644bD64C690C58c4c9656', // rinkeby
  5: '', // goerli
  42: '', // kavan
  1337: '0x5fbdb2315678afecb367f032d93f642f64180aa3', // localhost
};

export const WEB3_MODAL = new Web3Modal({
  providerOptions: {
    walletconnect: {
      package: WalletConnect,
      options: {
        infuraId: INFURA_ID,
      },
    },
  },
});

let provider = null;
let web3 = null;
let chainId = null;

export async function connect() {
  provider = await WEB3_MODAL.connect();

  await provider.enable();

  web3 = new Web3(provider);
  web3.eth.extend({
    methods: [
      {
        name: 'chainId',
        call: 'eth_chainId',
        outputFormatter: web3.utils.hexToNumber,
      },
    ],
  });

  const accounts = await web3.eth.getAccounts();
  const address = accounts[0];
  const networkId = await web3.eth.net.getId();
  chainId = await web3.eth.chainId();

  return {
    web3,
    provider,
    connected: true,
    address,
    chainId,
    networkId,
  };
}

export async function disconnect() {
  if (web3 && web3.currentProvider && web3.currentProvider.disconnect) {
    await web3.currentProvider.disconnect();
    web3 = null;
    provider = null;
  }
  await WEB3_MODAL.clearCachedProvider();
}

export async function getContract() {
  const address = CONTRACT_ADDRESS[chainId];
  if (!address) throw new Error(`Contract not deployed on network ${chainId}.`);
  return new web3.eth.Contract(SmartContract.abi, address);
}
