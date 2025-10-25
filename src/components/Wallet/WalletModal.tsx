import React, { MouseEvent } from 'react';
import { Wallet as WalletIcon, X, ExternalLink } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';

export const WalletModal: React.FC = () => {
  const {
    isModalOpen,
    closeModal,
    connectMetaMask,
    account,
    formattedAccount,
    isConnecting,
    error,
    disconnect,
  } = useWallet();

  if (!isModalOpen) {
    return null;
  }

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  };

  const renderError = () => {
    if (!error) return null;

    const isInstallMessage = /install/i.test(error);

    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        <p>{error}</p>
        {isInstallMessage && (
          <a
            href="https://metamask.io/download/"
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex items-center gap-2 text-red-600 underline hover:text-red-700"
          >
            Get MetaMask
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl border border-white/40 bg-white/95 shadow-2xl transition-all">
        <button
          onClick={closeModal}
          className="absolute right-4 top-4 rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="space-y-6 p-6">
          <div className="space-y-2 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-emerald-500 text-white">
              <WalletIcon className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">Connect your wallet</h2>
            <p className="text-sm text-gray-600">
              Choose a wallet provider to link with PropChain and unlock blockchain-powered experiences.
            </p>
          </div>

          {account ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-emerald-600">
                  <WalletIcon className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-emerald-700">Connected with MetaMask</p>
                  <p className="font-mono text-sm text-emerald-900">{formattedAccount}</p>
                  <p className="text-xs text-emerald-600">You can now access token-gated listings and NFT features.</p>
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={disconnect}
                  className="flex-1 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
                >
                  Disconnect
                </button>
                <button
                  onClick={closeModal}
                  className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-[1.01] hover:shadow-xl"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <button
                onClick={connectMetaMask}
                disabled={isConnecting}
                className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white p-4 text-left transition-all hover:border-blue-300 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 via-orange-400 to-yellow-400 text-white">
                    <WalletIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">MetaMask</p>
                    <p className="text-xs text-gray-500">Browser extension & mobile wallet</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-blue-600">
                  {isConnecting ? 'Connecting...' : 'Connect'}
                </span>
              </button>

              {renderError()}

              <p className="text-xs text-gray-500">
                By connecting a wallet, you agree to our Terms of Service and acknowledge our Privacy Policy.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
