import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

interface WalletContextValue {
  account: string | null;
  formattedAccount: string | null;
  isModalOpen: boolean;
  isConnecting: boolean;
  error: string | null;
  openModal: () => void;
  closeModal: () => void;
  connectMetaMask: () => Promise<void>;
  disconnect: () => void;
  resetError: () => void;
}

const WalletContext = createContext<WalletContextValue | undefined>(undefined);

const truncateAddress = (address: string) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const WalletProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectMetaMask = useCallback(async () => {
    const provider = window.ethereum;

    if (!provider || !provider.isMetaMask) {
      setError('MetaMask is not installed. Please install it to continue.');
      return;
    }

    try {
      setIsConnecting(true);
      setError(null);
      const accounts = (await provider.request({ method: 'eth_requestAccounts' })) as string[];

      if (!accounts || accounts.length === 0) {
        setError('No accounts found in MetaMask.');
        return;
      }

      setAccount(accounts[0]);
    } catch (err: unknown) {
      const errorMessage =
        typeof err === 'object' && err !== null && 'code' in err
          ? (err as { code: number; message?: string }).code === 4001
            ? 'Connection request was rejected.'
            : (err as { message?: string }).message ?? 'Failed to connect to MetaMask.'
          : 'Failed to connect to MetaMask.';
      setError(errorMessage);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAccount(null);
  }, []);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
    setError(null);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setIsConnecting(false);
    setError(null);
  }, []);

  useEffect(() => {
    const provider = window.ethereum;
    if (!provider) {
      return;
    }

    provider
      .request({ method: 'eth_accounts' })
      .then((accounts: unknown) => {
        if (Array.isArray(accounts) && accounts.length > 0) {
          setAccount(accounts[0]);
        }
      })
      .catch(() => undefined);

    const handleAccountsChanged = (accounts: string[]) => {
      if (!accounts || accounts.length === 0) {
        setAccount(null);
      } else {
        setAccount(accounts[0]);
      }
    };

    provider.on?.('accountsChanged', handleAccountsChanged);

    return () => {
      provider.removeListener?.('accountsChanged', handleAccountsChanged);
    };
  }, []);

  const formattedAccount = useMemo(() => (account ? truncateAddress(account) : null), [account]);

  const resetError = useCallback(() => setError(null), []);

  const value = useMemo<WalletContextValue>(
    () => ({
      account,
      formattedAccount,
      isModalOpen,
      isConnecting,
      error,
      openModal,
      closeModal,
      connectMetaMask,
      disconnect,
      resetError,
    }),
    [account, formattedAccount, isModalOpen, isConnecting, error, openModal, closeModal, connectMetaMask, disconnect]
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
