import Web3Modal from 'web3modal';
import WalletConnect from '@walletconnect/web3-provider';
import Web3 from 'web3';

const INFURA_ID = '6ae4bfa571f34170800e16cf72824270'; // process.env.INFRA_ID;

export const BUTTPUNK_CONTRACT_MAP = {
  1: '', // mainnet
  3: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9', // ropsten
  4: '0xF5f4A9FB11C56E2663d644bD64C690C58c4c9656', // rinkeby
  5: '', // goerli
  42: '', // kavan
  1337: '0x0165878A594ca255338adfa4d48449f69242Eb8F', // localhost
};

export const WEB3_MODAL = new Web3Modal({
  // cacheProvider: true,
  providerOptions: {
    walletconnect: {
      package: WalletConnect,
      options: {
        infuraId: INFURA_ID,
      },
    },
  },
});

export async function connect() {
  const provider = await WEB3_MODAL.connect();
  await provider.enable();
  const web3 = new Web3(provider);
  web3.eth.extend({
    methods: [
      {
        name: 'chainId',
        call: 'eth_chainId',
        outputFormatter: web3.utils.hexToNumber,
      },
    ],
  });

  return {
    web3,
    provider,
  };
}

export async function clearModalCache() {
  await WEB3_MODAL.clearCachedProvider();
}

export async function disconnect(web3) {
  if (web3 && web3.currentProvider && web3.currentProvider.disconnect) {
    await web3.currentProvider.disconnect();
  }
  await clearModalCache();
}
