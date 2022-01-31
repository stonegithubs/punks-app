import React, { useEffect, useState } from 'react';
import AnchorAddress from './AnchorAddress';
import { BUTTPUNK_CONTRACT_MAP } from '../service/web3';

import './PageProvenance.css';

function PageProvenance() {
  const [shas, setShas] = useState([]);
  useEffect(() => {
    fetch('https://d207ap6gpsm7q4.cloudfront.net/metadata/_sha256s.json')
      .then((response) => response.json())
      .then((data) => setShas(data));
  }, []);
  return (
    <div className="PageProvenance">
      <div className="PageProvenance-inner">
        <div className="PageProvenance-section">
          <h1 className="PageProvenance-headline">BUTTPUNK PROVENANCE RECORD</h1>
          <p className="PageProvenance-blurb">This page presents the provenance record of each token that will ever exist. Each token image is firstly hashed using SHA-256 algorithm. A combined string is obtained by concatenating SHA-256 of each token image in the specific order as listed below. The final proof is obtained by SHA-256 hashing this combined string. This is the final provenance record stored on the smart contract.</p>
          <h2 className="PageProvenance-headline">Important Info</h2>
          <p>
            ButtPunks Contract Address:
            {' '}
            <AnchorAddress chainId={1} address={BUTTPUNK_CONTRACT_MAP[1]} />
          </p>
          <p>
            Final Proof Hash:
            {' '}
            sadfasdfdasbdfbfdgfdgdfsgdfsgdfadsfasdfsdaf
          </p>
          <h2 className="PageProvenance-headline">Provenance Record</h2>
          <table>
            <thead>
              <tr>
                <th>tokenId</th>
                <th>sha256</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(shas).map((shaKey) => (
                <tr>
                  <td>{shaKey}</td>
                  <td>{shas[shaKey]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PageProvenance;
