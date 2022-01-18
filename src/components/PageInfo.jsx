import './PageInfo.css';
import React, { useEffect, useState, useMemo } from 'react';
import classnames from 'classnames';
import { getContract, getContractAddress } from '../service/web3';
import { useWeb3Context } from '../context/Web3Context';
import supportedChains from '../data/supportedChains';
import ButtonConnect from './ButtonConnect';
import { apiGetAccountAssets } from '../service/ethApi';
import AnchorAddress from './AnchorAddress';
import AnchorWalletAddress from './AnchorWalletAddress';

const GENERIC_ERROR = {
  code: -1,
  message: 'Unknown error',
};

function PageInfo() {
  const { web3State } = useWeb3Context();
  const [saleStatus, setSaleStatus] = useState(false);
  const [ownerAddress, setOwnerAddress] = useState(null);
  const [loadingWithdraw, setLoadingWithdraw] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [error, setError] = useState();
  const [success, setSuccess] = useState();
  const [contractBalance, setContractBalance] = useState(0);
  const selectedChain = supportedChains.find((chain) => chain.chain_id === web3State.chainId);
  const contractAddress = useMemo(() => getContractAddress(web3State.chainId), [web3State.chainId]);
  const isOwner = web3State.connected && web3State.address === ownerAddress;

  useEffect(() => {
    if (!web3State.connected) {
      setSaleStatus(false);
      setOwnerAddress(null);
      return;
    }
    (async () => {
      try {
        const contract = await getContract();
        const newSaleStatus = await contract.methods.saleStatus().call();
        const newOwnerAddress = await contract.methods.owner().call();
        setSaleStatus(newSaleStatus);
        setOwnerAddress(newOwnerAddress);
      } catch (err) {
        // setError((err && err.error) || err || GENERIC_ERROR);
      }
    })();
  }, [web3State.connected]);

  useEffect(() => {
    // get contract assets
    if (!web3State.chainId || !contractAddress) return;
    (async () => {
      try {
        const contractAssets = await apiGetAccountAssets(contractAddress, web3State.chainId);
        const newBalance = contractAssets && contractAssets.length && contractAssets[0].balance;
        setContractBalance(newBalance || 0);
      } catch (err) {
        setContractBalance(0);
      }
    })();
  }, [web3State.chainId, contractAddress]);

  // request access to the user's MetaMask account

  async function startSale() {
    try {
      setError(null);
      setSuccess(null);
      setLoadingStatus(true);
      const contract = await getContract();
      await contract.methods.startSale(
        Math.floor((Date.now() + 86400000 * 9) / 1000),
      ).send({
        from: web3State.address,
      });
      setSaleStatus(true);
      setSuccess('Sale started!');
      setLoadingStatus(false);
    } catch (err) {
      setError((err && err.error) || err || GENERIC_ERROR);
      setLoadingStatus(false);
    }
  }

  async function pauseSale() {
    try {
      setError(null);
      setSuccess(null);
      setLoadingStatus(true);
      const contract = await getContract();
      await contract.methods.pauseSale().send({
        from: web3State.address,
      });
      setSaleStatus(false);
      setSuccess('Sale paused!');
      setLoadingStatus(false);
    } catch (err) {
      setError((err && err.error) || err || GENERIC_ERROR);
      setLoadingStatus(false);
    }
  }

  async function withdraw() {
    try {
      setError(null);
      setSuccess(null);
      setLoadingWithdraw(true);
      const contract = await getContract();
      await contract.methods.withdraw().send({
        from: web3State.address,
      });
      setSuccess('Withdraw successful!');
      setLoadingWithdraw(false);
    } catch (err) {
      setError((err && err.error) || err || GENERIC_ERROR);
      setLoadingWithdraw(false);
    }
  }

  return (
    <div className="PageInfo">
      <h1 className="PageInfo-headline">
        Info
      </h1>
      <div className="PageInfo-section">
        <h2 className="PageInfo-sectionHeadline">network: </h2>
        <p>{selectedChain.network}</p>
      </div>
      <div className="PageMint-section">
        <h2 className="PageMint-sectionHeadline">contract: </h2>
        {contractAddress ? (
          <AnchorAddress chainId={web3State.chainId} address={contractAddress} />
        ) : (
          <span>[smart contract has not been deployed on this chain]</span>
        )}
      </div>
      <div className="PageMint-section">
        <h2 className="PageMint-sectionHeadline">owner: </h2>
        {ownerAddress ? (
          <AnchorAddress chainId={web3State.chainId} address={ownerAddress} />
        ) : (
          <span>[cannot retrieve contract owner]</span>
        )}
      </div>
      <div className="PageInfo-section">
        <h2 className="PageInfo-sectionHeadline">wallet: </h2>
        {web3State.connected ? (
          <span className="SectionConnection-address">
            <AnchorWalletAddress />
          </span>
        ) : (
          <ButtonConnect />
        )}
      </div>
      {!isOwner ? '' : (
        <>
          <div className="PageInfo-section">
            <h2 className="PageInfo-sectionHeadline">balance: </h2>
            <p>
              {contractBalance}
              Ξ
            </p>
            <button
              className={
                classnames(
                  'Button',
                  {
                    'Button--disabled': !web3State.connected,
                    'Button--loading': loadingWithdraw,
                  },
                )
              }
              type="button"
              disabled={loadingWithdraw || !web3State.connected}
              onClick={withdraw}
            >
              Withdraw
            </button>
          </div>
          <div className="PageInfo-section">
            <h2 className="PageInfo-sectionHeadline">status: </h2>
            <p>
              {(() => {
                if (!contractAddress) {
                  return 'n/a';
                } if (!saleStatus) {
                  return 'paused';
                }
                return 'active';
              })()}
            </p>
            {saleStatus ? (
              <button
                className={
                  classnames(
                    'Button',
                    {
                      'Button--disabled': !web3State.connected,
                      'Button--loading': loadingStatus,
                    },
                  )
                }
                type="button"
                disabled={!web3State.connected || loadingStatus}
                onClick={pauseSale}
              >
                Pause Sale
              </button>
            ) : (
              <button
                className={
                  classnames(
                    'Button',
                    {
                      'Button--disabled': !web3State.connected,
                      'Button--loading': loadingStatus,
                    },
                  )
                }
                type="button"
                disabled={!web3State.connected || loadingStatus}
                onClick={startSale}
              >
                Start Sale
              </button>
            )}
          </div>
        </>
      )}
      <div className="PageInfo-section">
        {error ? (
          <p style={{ fontSize: '12px', color: 'red' }}>
            {`Error${
              error.code ? ` ${error.code}` : ''
            }: ${error.message || error}`}

          </p>
        ) : (
          ''
        )}
        {success ? (
          <p style={{ fontSize: '12px', color: 'green' }}>{success}</p>
        ) : (
          ''
        )}
      </div>
    </div>
  );
}

export default PageInfo;
