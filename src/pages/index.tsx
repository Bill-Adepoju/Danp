// @ts-nocheck
import type { NextPage } from 'next';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { toast } from 'react-toastify';
import PaymentFactoryABI from '../PaymentFactoryABI.json';

const factoryAddress = "0xFfe3Ac0A460BFb8d33eC28F3feF951bD716f4265"; // deployed contract address

const CreateMerchantContract: React.FC = () => {
  const { address } = useAccount();
  const [merchantContractAddress, setMerchantContractAddress] = useState<string | null>(null);

  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const { data: fetchedAddress, refetch } = useReadContract({
    address: factoryAddress,
    abi: PaymentFactoryABI,
    functionName: 'merchantContracts',
    args: [address],
    enabled: false,
  });

  const handleCreateContract = async () => {
    if (!address) {
      toast.error("Please connect your wallet first");
      return;
    }

    // Hardcoded USDT and BTC token addresses
    const usdtAddress = "0xae2b32de15c685a82cb03c4d5528b6b3fe0ee0d1";
    const btcAddress = "0x03159f1b81661a225c4110e7b4b13ac5310b0b1e";

    try {
      writeContract({
        address: factoryAddress,
        abi: PaymentFactoryABI,
        functionName: 'createMerchantContract',
        args: [usdtAddress, btcAddress],  // Pass the required parameters
      });
    } catch (err) {
      console.error("Error creating merchant contract:", err);
      toast.error("Failed to create merchant contract.");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Merchant contract created successfully!");
      refetch();  // Fetch the newly created contract address
    }
  }, [isSuccess, refetch]);

  useEffect(() => {
    if (fetchedAddress) {
      setMerchantContractAddress(fetchedAddress);
    }
  }, [fetchedAddress]);

  useEffect(() => {
    if (error) {
      console.error("Contract creation error:", error);
      toast.error("Failed to create merchant contract.");
    }
  }, [error]);

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-6">Create Your Merchant Contract</h2>
      <button 
        onClick={handleCreateContract} 
        disabled={isPending || isConfirming}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full text-lg shadow-lg transform transition duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending || isConfirming ? 'Creating...' : 'Create Contract'}
      </button>
      {merchantContractAddress && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg shadow-inner">
          <h3 className="text-xl font-semibold mb-2">Your Merchant Contract Address:</h3>
          <p className="text-blue-600 font-mono break-all">{merchantContractAddress}</p>
        </div>
      )}
    </div>
  );
};

const Home: NextPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Web3 Merchant</title>
        <meta content="Web3 Merchant - Create and manage your merchant contracts" name="description" />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <header className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Web3 Merchant</h1>
          <ConnectButton />
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to <span className="text-blue-600">Web3 Merchant</span>
          </h1>
          <p className="text-xl text-gray-600">Create and manage your merchant contracts with ease <br /> Receive payments in cryptocurrency on your marketplace </p>
        </div>

        <CreateMerchantContract />
      </main>

      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto text-center">
          <a href="" className="hover:underline">Made with ❤️ by Daniel</a>
        </div>
      </footer>
    </div>
  );
};

export default Home;
