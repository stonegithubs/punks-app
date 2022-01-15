import { ethers } from 'ethers';
// import Web3Modal from 'web3modal';
// import WalletConnect from '@walletconnect/web3-provider';

import PFPTest from '../artifacts/contracts/pfpTest.sol/PFPTest.json';

// const INFURA_ID = process.env.INFRA_ID;
// console.log(INFRA_ID);

export const CONTRACT_ADDRESS = {
  1: '', // mainnet
  3: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9', // ropsten
  4: '0xF5f4A9FB11C56E2663d644bD64C690C58c4c9656', // rinkeby
  5: '', // goerli
  42: '', // kavan
  1337: '0x5fbdb2315678afecb367f032d93f642f64180aa3', // localhost
};

// export async function getContract(signed) {
//   const web3Modal = new Web3Modal({
//     providerOptions: {
//       walletconnect: {
//         package: WalletConnect,
//         options: {
//           infuraId: INFURA_ID,
//         },
//       },
//     },
//   });
//   const instance = await web3Modal.connect();
//   const provider = new ethers.providers.Web3Provider(instance);
//   const signer = signed ? provider.getSigner() : provider;
//   const { chainId } = await provider.getNetwork();
//   console.log(instance, provider);

//   const address = CONTRACT_ADDRESS[chainId];
//   if (!address) throw new Error(`Contract not deployed on network ${chainId}.`);
//   return new ethers.Contract(address, PFPTest.abi, signer);
// }

export async function getContract(signed) {
  if (!window.ethereum) {
    throw new Error('window.ethereum is not defined');
  }
  if (signed) await window.ethereum.request({ method: 'eth_requestAccounts' });
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const { chainId } = await provider.getNetwork();
  const address = CONTRACT_ADDRESS[chainId];
  if (!address) throw new Error(`Contract not deployed on network ${chainId}.`);
  const signer = signed ? provider.getSigner() : provider;
  return new ethers.Contract(address, PFPTest.abi, signer);
}
