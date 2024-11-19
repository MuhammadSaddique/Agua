'use client';
import React, { useState } from 'react';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';

const providerOptions = {
  walletconnect: {
    package: require('@walletconnect/web3-provider'),
    options: {
      rpc: {
        1: 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY',
        5: 'https://goerli.infura.io/v3/YOUR_INFURA_KEY',
        137: 'https://polygon-rpc.com/',
      },
      chainId: 5, // Default to Goerli for testing
    },
  },
};

const App = () => {
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [networkName, setNetworkName] = useState<string>('');

  async function connectWallet() {
    try {
      const web3Modal = new Web3Modal({
        cacheProvider: false,
        providerOptions,
      });

      const instance = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(instance);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setWalletAddress(address);

      const chainId = await provider.send('eth_chainId', []);
      let network = '';

      if (chainId === '0x1') {
        network = 'Ethereum Mainnet';
      } else if (chainId === '0x5') {
        network = 'Goerli Testnet';
      } else if (chainId === '0x89') {
        network = 'Polygon Mainnet';
      } else {
        network = `Unknown Network (Chain ID: ${chainId})`;
      }
      setNetworkName(network);

      if (chainId !== '0x5') {
        try {
          await provider.send('wallet_switchEthereumChain', [{ chainId: '0x5' }]);
        } catch (error: any) {
          if (error.code === 4902) {
            try {
              await provider.send('wallet_addEthereumChain', [
                {
                  chainId: '0x5',
                  chainName: 'Goerli Testnet',
                  rpcUrls: ['https://goerli.infura.io/v3/YOUR_INFURA_KEY'],
                  nativeCurrency: {
                    name: 'Goerli ETH',
                    symbol: 'ETH',
                    decimals: 18,
                  },
                  blockExplorerUrls: ['https://goerli.etherscan.io'],
                },
              ]);
            } catch (addError) {
              console.error('Error adding Goerli Testnet:', addError);
            }
          } else {
            console.error('Error switching network:', error);
          }
        }
      }

      console.log('Connected Chain ID:', chainId);
      console.log('Connected Wallet Address:', address);
    } catch (error) {
      console.error('Error connecting to wallet:', error);
    }
  }

  return (
    <div>
      <h1>Web3 Modal Wallet Connection</h1>
      <button onClick={connectWallet}>Connect Wallet</button>
      {walletAddress && <p>Connected Wallet Address: {walletAddress}</p>}
      {networkName && <p>Connected Network: {networkName}</p>}
    </div>
  );
};

export default App;
