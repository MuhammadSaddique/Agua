"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Web3Modal from "web3modal";
import { Web3Provider } from "@ethersproject/providers";
import { ethers } from "ethers";

// import { ToastContainer, toast } from "react-toastify";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
// import { WalletConnect } from "@web3-react/walletconnect";
("@web3-react/walletconnect");
const usdtABI = [
  {
    inputs: [{ internalType: "address", name: "_owner", type: "address" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    constant: true,
    inputs: [],
    name: "_decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "_name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "_symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "burn",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "subtractedValue", type: "uint256" },
    ],
    name: "decreaseAllowance",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "getOwner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "addedValue", type: "uint256" },
    ],
    name: "increaseAllowance",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "mint",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ internalType: "address", name: "_newOwner", type: "address" }],
    name: "renounceOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { internalType: "address", name: "sender", type: "address" },
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
];
const stakingABI = [
  {
    inputs: [{ internalType: "address", name: "admin_", type: "address" }],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [{ internalType: "address", name: "approver", type: "address" }],
    name: "ERC20BlackListedApprover",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "receiver", type: "address" }],
    name: "ERC20BlackListedReceiver",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "sender", type: "address" }],
    name: "ERC20BlackListedSender",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "spender", type: "address" }],
    name: "ERC20BlackListedSpender",
    type: "error",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "allowance", type: "uint256" },
      { internalType: "uint256", name: "needed", type: "uint256" },
    ],
    name: "ERC20InsufficientAllowance",
    type: "error",
  },
  {
    inputs: [
      { internalType: "address", name: "sender", type: "address" },
      { internalType: "uint256", name: "balance", type: "uint256" },
      { internalType: "uint256", name: "needed", type: "uint256" },
    ],
    name: "ERC20InsufficientBalance",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "approver", type: "address" }],
    name: "ERC20InvalidApprover",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "receiver", type: "address" }],
    name: "ERC20InvalidReceiver",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "sender", type: "address" }],
    name: "ERC20InvalidSender",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "spender", type: "address" }],
    name: "ERC20InvalidSpender",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
];
const preSaleABI = [
  {
    inputs: [
      { internalType: "contract IERC20", name: "__USDT", type: "address" },
      { internalType: "contract IERC20", name: "__GentTop", type: "address" },
      { internalType: "address", name: "_staking", type: "address" },
      { internalType: "address", name: "_owner", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "BronzePercentage",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_usdtAmount", type: "uint256" },
      { internalType: "address", name: "_buyer", type: "address" },
      { internalType: "uint256", name: "_runner", type: "uint256" },
    ],
    name: "Buy",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "GoldPercentage",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "SilverPercentage",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    name: "User",
    outputs: [
      { internalType: "address", name: "userAdd", type: "address" },
      { internalType: "uint256", name: "joinTime", type: "uint256" },
      { internalType: "uint256", name: "joiningAmount", type: "uint256" },
      { internalType: "uint256", name: "percenTage", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "__user", type: "address" }],
    name: "UserPurcahases",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "buyer",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_userAdd", type: "address" },
      { internalType: "uint256", name: "_num", type: "uint256" },
    ],
    name: "getUserData",
    outputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_percentage", type: "uint256" },
      {
        internalType: "uint256",
        name: "_whichTypeOfPercentage",
        type: "uint256",
      },
    ],
    name: "setPercentage",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "staking",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "userPurcahases",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "withdrawAdmin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const usdtAddress = "0xf7F5214E7a29A9bcc14D55630E97Bd63e0Bc2a2c"; // Replace with Contract 1 address
const gentopAddress = "0x7eEdA3FaA9F1316c76A8C2ee3479087CF3550F4F"; // Replace with Contract 2 address
const stakingContractAddress = "0x96A54C5c3B6507dc2CccE7eE6E1fcC053Eb949D3"; // Replace with Contract 3 address
const preSaleContractAddress = "0x8B554BfCB9dd94981e3Da63bc53d963f6fc2419E"; // Replace with Contract 4 address

const providerOptions = {
  coinbasewallet: {
    package: CoinbaseWalletSDK,
    options: {
      appName: "Web3Model Demo",
      infuraId: "https://rpc.testnet.fantom.network",
    },
  },
};

export default function WalletButton() {
  const [selectedOption, setSelectedOption] = useState("1");
  const [web3Provider, setWeb3Provider] = useState<Web3Provider | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [usdtBalance, setUsdtBalance] = useState<string | null>(null);
  const [usdtAmount, setUsdtAmount] = useState("");

  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [contract1, setContract1] = useState<ethers.Contract | null>(null);
  const [contract2, setContract2] = useState<ethers.Contract | null>(null);
  const [contract3, setContract3] = useState<ethers.Contract | null>(null);
  const [contract4, setContract4] = useState<ethers.Contract | null>(null);

  function getSelectedRunner() {
    const runner = parseInt(selectedOption, 10);

    if (runner < 1 || runner > 3) {
      throw new Error("Invalid runner selection");
    }
    return runner;
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };
  async function fetchUsdtBalance(signer: any, address: any) {
    try {
      const usdtContract = new ethers.Contract(usdtAddress, usdtABI, signer);
      const balance = await usdtContract.balanceOf(address);
      const decimals = 18;
      setUsdtBalance(ethers.utils.formatUnits(balance, decimals));
    } catch (error) {
      console.error("Error fetching USDT balance:", error);
    }
  }
  async function connectWallet() {
    try {
      const web3Modal = new Web3Modal({
        cacheProvider: false,
        providerOptions,
      });

      const web3modalInstance = await web3Modal.connect();
      const web3modalProvider = new ethers.providers.Web3Provider(
        web3modalInstance,
      );

      if (web3modalProvider) {
        const signer = web3modalProvider.getSigner();
        const address = await signer.getAddress();

        // Update state with wallet details
        setWalletAddress(address);
        setWeb3Provider(web3modalProvider);

        // Fetch USDT balance right after connection
        await fetchUsdtBalance(signer, address);
      }
    } catch (error) {
      console.log("Error connecting wallet:", error);
    }
  }

  useEffect(() => {
    if (walletAddress && web3Provider) {
      const signer = web3Provider.getSigner();

      // Fetch balance whenever walletAddress or provider changes
      fetchUsdtBalance(signer, walletAddress);

      // Optional: Set up polling to fetch balance periodically (e.g., every 10 seconds)
      const balanceInterval = setInterval(() => {
        fetchUsdtBalance(signer, walletAddress);
      }, 100000); // Fetch balance every 10 seconds

      // Clean up interval when component unmounts
      return () => clearInterval(balanceInterval);
    }
  }, [walletAddress, web3Provider]);
  function convertTo18Decimals(usdtValue: string) {
    const decimals = 18;
    return ethers.utils.parseUnits(usdtValue, decimals);
  }
  // async function fetchUsdtBalance() {
  //   try {
  //     if (web3Provider && walletAddress) {
  //       const signer = web3Provider.getSigner();
  //       const usdtContract = new ethers.Contract(usdtAddress, usdtABI, signer);
  //       const balance = await usdtContract.balanceOf(walletAddress);
  //       const decimals = 18;
  //       setUsdtBalance(ethers.utils.formatUnits(balance, decimals));
  //     }
  //   } catch (error) {
  //     console.log("Error fetching balance:", error);
  //   }
  // }
  async function approveUSDT() {
    if (!web3Provider || !walletAddress) {
      console.log("No provider or wallet connected");
      return;
    }

    try {
      const signer = web3Provider.getSigner();
      const usdtContract = new ethers.Contract(usdtAddress, usdtABI, signer);

      const amountToApprove = convertTo18Decimals(usdtAmount);

      const tx = await usdtContract.approve(
        preSaleContractAddress,
        amountToApprove,
      );
      console.log("Approval transaction hash:", tx.hash);
      setTransactionHash(tx.hash); // Store transaction hash

      // Wait for transaction to be confirmed
      await tx.wait();
      //   toast.success("USDT successfully approved!");
    } catch (error) {
      console.log("Error approving USDT:", error);
      //   toast.error("Error approving USDT. Please try again.");
    }
  }

  async function buyTokens() {
    if (!web3Provider || !walletAddress) {
      console.log("No provider or wallet connected");
      return;
    }

    try {
      const signer = web3Provider.getSigner();
      const preSaleContract = new ethers.Contract(
        preSaleContractAddress,
        preSaleABI,
        signer,
      );

      // Define the values you want to send
      const amountToBuy = convertTo18Decimals(usdtAmount); // Adjust to the correct amount of USDT
      const buyerAddress = walletAddress;
      const runner = selectedOption; // You can replace this with the actual value if needed
      console.log(runner);
      // // Estimate gas limit for the Buy transaction
      // const estimatedGasLimit = await preSaleContract.estimateGas.Buy(
      //   amountToBuy,
      //   buyerAddress,
      //   runner
      // );

      // Call the Buy function
      const tx = await preSaleContract.Buy(amountToBuy, walletAddress, runner, {
        gasLimit: 10000000,
      });
      console.log(amountToBuy, buyerAddress, runner);

      console.log("Transaction: ", tx);
      // setTransactionHash(tx.hash);

      // Wait for the transaction to be confirmed
      // await tx.wait();
      //   toast.success("Tokens purchased successfully!");
    } catch (error) {
      console.log("Error purchasing tokens:", error);
      //   toast.error("Error during token purchase. Please try again.");
    }
  }

  return (
    <div>
      <div className="flex space-x-3 md:order-2 md:space-x-0 rtl:space-x-reverse">
        <span className="rounded-lg border border-white bg-gray-200 px-8 py-2 text-center text-sm font-medium text-black  focus:outline-none focus:ring-4 ">
          {web3Provider == null ? (
            <button className="" onClick={connectWallet}>
              Connect Wallet
            </button>
          ) : (
            <div>
              {/* <p>Connected</p> */}
              {walletAddress ? formatAddress(walletAddress) : ""}
            </div>
          )}
        </span>
      </div>
    </div>
  );
}
