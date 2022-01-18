import './PageHome.css';
import React from 'react';
import { useWeb3Context } from '../context/Web3Context';
import AnchorAddress from './AnchorAddress';

function PageHome() {
  const { web3State } = useWeb3Context();
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
          Blurb about NFT Integrety. IPFS/Pinata provenance record.
          No fishy business.
          Verified smart contract address:
          {' '}
          <AnchorAddress chainId={web3State.chainId} address={web3State.buttpunkContractAddress} />
        </p>
      </div>
    </div>
  );
}

export default PageHome;
