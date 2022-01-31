import './PageHome.css';
import React from 'react';
import { Link } from 'react-router-dom';
import SectionMint from './SectionMint';
import ButtPreviewImgSrc from '../media/butt-preview.gif';
import PreviewVideoSrc from '../media/preview.mp4';

function PageHome() {
  return (
    <div className="PageHome">
      <div className="PageHome-section PageHome-section--intro">
        <div className="PageHome-sectionMain">
          <div className="PageHome-sectionMainInner">
            <video className="PageHome-previewVideo" muted autoPlay loop>
              <source src={PreviewVideoSrc} />
            </video>
            <p className="PageHome-blurb">
              Diversify your ASSets!
            </p>
          </div>
          <SectionMint />
        </div>
      </div>
      <div className="PageHome-section PageHome-section--details">
        <div className="PageHome-sectionInner">
          <a
            className="PageHome-sectionImg PageHome-sectionImg--preview"
            href="https://opensea.io/collection/butt-punks"
            target="_blank"
            rel="noreferrer"
          >
            <img src={ButtPreviewImgSrc} alt="A preview of a few ButtPunks" />
          </a>
          <div className="PageHome-sectionMain">
            <h2 className="PageHome-headline">Give me the deets</h2>
            <p className="PageHome-blurb">
              ButtPunks is a limited collection of 10,000 unique NFT butts living on
              the Ethereum blockchain. Each butt is uniquely crafted by combining
              nine traits from a collection of over 100 assets!
            </p>
            <p className="PageHome-blurb">
              Each butt and its metadata is built to last.
              Check out
              {' '}
              <Link to="/provenance">the provenance page</Link>
              {' '}
              for more info.
            </p>
            <p className="PageHome-blurb">
              Ready to dive in? Mint a few butts above and/or trade them on
              {' '}
              <a className="TextIcon TextIcon--opensea" href="https://opensea.io/collection/butt-punks" target="_blank" rel="noreferrer">OpenSea</a>
              !
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageHome;
