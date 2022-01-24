import './PageHome.css';
import React from 'react';
import AnchorAddress from './AnchorAddress';
import SectionMint from './SectionMint';
import PinataImgSrc from '../media/pinata.png';
import PreviewVideoSrc from '../media/preview.mp4';
import { BUTTPUNK_CONTRACT_MAP } from '../service/web3';

function PageHome() {
  return (
    <div className="PageHome">
      <div className="PageHome-section PageHome-section--intro">
        <div className="PageHome-sectionMain">
          <video className="PageHome-previewVideo" muted autoPlay loop>
            <source src={PreviewVideoSrc} />
          </video>
          <p className="PageHome-blurb">
            What&apos;s better than one punk? How about two of them smashed together and
            then decorated with nine unique traits!
          </p>
        </div>
      </div>
      <div className="PageHome-section PageHome-section--details">
        <div className="PageHome-sectionInner">
          <div className="PageHome-sectionImg PageHome-sectionImg--pinata">
            <img src={PinataImgSrc} alt="Pinata Logo" />
          </div>
          <div className="PageHome-sectionMain">
            <h2 className="PageHome-headline">Give me the deets!</h2>
            <p className="PageHome-blurb">
              ButtPunks is a limited collection of 10,000 unique NFT butts living on
              the Ethereum blockchain. Each butt is made unique by randomly generating a
              combination of nine traits from a collection of over 50 of them.
            </p>
            <p className="PageHome-blurb">
              Each butt and its metadata is stored on IPFS via Pinata
              and you can assure there is no funny business since the directory CID
              is stored right there in the smart contract:
              {' '}
              <AnchorAddress chainId={1} address={BUTTPUNK_CONTRACT_MAP[1]} />
              . There&apos;s more information on that over on
              {' '}
              <a href="https://docs.pinata.cloud/nfts" target="_blank" rel="noreferrer">the Pinata website</a>
              {' '}
              but the tldr is that it&apos;s impossible for us to change the contents!
            </p>
          </div>
        </div>
      </div>
      <div className="PageHome-section PageHome-section--butts">
        <div className="PageHome-sectionInner">
          <h2 className="PageHome-headline">Mint Some Butts!</h2>
          <SectionMint />
        </div>
      </div>
    </div>
  );
}

export default PageHome;
