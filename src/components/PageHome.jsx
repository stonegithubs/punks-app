import './PageHome.css';
import React from 'react';
import { useWeb3Context } from '../context/Web3Context';
import { getContractAddress } from '../service/web3';

function PageHome() {
  const { web3State } = useWeb3Context();
  const contractAddress = getContractAddress(web3State.chainId);
  return (
    <div className="PageHome">
      <div className="PageHome-section">
        <img src="//placekitten.com/g/1000/500" alt="A sample grid of ButtPunks" />
        <h1 className="PageHome-headline">WELCOME TO BUTTPUNKS</h1>
        <p className="PageHome-blurb">
          ButtPunks is a limited collection of 10,000 unique NFT butts living on
          the Ethereum blockchain. Each butt was carefully crafted by smashing
          two punks together and then assigning it a unique combination of nine traits.
        </p>
        <p className="PageHome-blurb">
          NFT Integrety. IPFS/Pinata provenance record.
          No fishy business.
          Verified smart contract address:
          {' '}
          <a href={`https://etherscan.io/address/${contractAddress}`} target="_blank" rel="noreferrer">{contractAddress}</a>
        </p>
      </div>
    </div>
  );
}

export default PageHome;
