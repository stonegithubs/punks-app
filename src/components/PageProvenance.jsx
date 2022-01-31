import React, { useEffect, useState } from 'react';
import AnchorAddress from './AnchorAddress';
import { BUTTPUNK_CONTRACT_MAP } from '../service/web3';

import './PageProvenance.css';

async function sha256(message) {
  // encode as UTF-8
  const msgBuffer = new TextEncoder().encode(message);

  // hash the message
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

  // convert ArrayBuffer to Array
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  // convert bytes to hex string
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

function PageProvenance() {
  const [shas, setShas] = useState({});
  const [provenance, setProvenance] = useState('');
  // const [combinedShas, setCombinedShas] = useState('');
  useEffect(() => {
    fetch('https://d207ap6gpsm7q4.cloudfront.net/metadata/_sha256s.json')
      .then((response) => response.json())
      .then((data) => setShas(data));
  }, []);
  useEffect(() => {
    (async () => {
      const shaVals = Object.values(shas);
      if (!shaVals.length) return;
      const shasString = shaVals.join();
      setProvenance(await sha256(shasString));
      // setCombinedShas(shasString);
    })();
  }, [shas]);
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
            {provenance}
          </p>
          <h2 className="PageProvenance-headline">Provenance Record</h2>
          <table>
            <thead>
              <tr>
                <th>tokenId</th>
                <th>sha256</th>
                <th>arweaveId</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(shas).map((shaKey) => (
                <tr key={shaKey}>
                  <td>{shaKey}</td>
                  <td>{shas[shaKey]}</td>
                  <td>TBD</td>
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
