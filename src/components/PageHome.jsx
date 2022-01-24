import './PageHome.css';
import React from 'react';
import { useWeb3Context } from '../context/Web3Context';
import AnchorAddress from './AnchorAddress';
import SectionMint from './SectionMint';
import GridImgSrc from '../images/grid.jpg';

function PageHome() {
  const { web3State } = useWeb3Context();
  return (
    <div className="PageHome">
      <div className="PageHome-section PageHome-section--butts">
        <h2 className="PageHome-headline">Mint Some Butts!</h2>
        <SectionMint />
      </div>
      <div className="PageHome-section">
        <img className="PageHome-mainImg" src={GridImgSrc} alt="A sample grid of ButtPunks" />
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
