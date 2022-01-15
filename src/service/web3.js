import Web3Modal from 'web3modal';
import WalletConnect from '@walletconnect/web3-provider';

import Web3 from 'web3';

const INFURA_ID = '6ae4bfa571f34170800e16cf72824270'; // process.env.INFRA_ID;

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
  const chainId = await web3.eth.chainId();

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
