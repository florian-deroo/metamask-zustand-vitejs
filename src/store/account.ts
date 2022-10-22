import { useEffect } from "react";
import create from "zustand";

interface AccountState {
  hasMetamask: boolean;
  address: string;
  chainID: string;
  isConnected: boolean;
  init: () => void;
  connect: () => void;
}

export const useAccountStore = create<AccountState>()((set) => ({
  hasMetamask: true,
  address: "",
  chainID: "",
  isConnected: false,
  connect: () => {
    window.ethereum.request({ method: "eth_requestAccounts" });
  },
  init: () => {
    useEffect(() => {
      const ethereum = window.ethereum;

      if (!ethereum) {
        set(() => ({
          hasMetamask: false,
        }));
        return;
      }

      ethereum.request({ method: "eth_chainId" }).then((chainID: string) => {
        set(() => ({
          chainID: chainID,
        }));
      });

      ethereum
        .request({ method: "eth_accounts" })
        .then((accounts: string[]) => {
          set((acc) =>
            !acc.isConnected && accounts.length !== 0
              ? {
                  isConnected: true,
                  address: accounts[0],
                }
              : {}
          );
        });

      ethereum.on("accountsChanged", (accounts: string[]) => {
        set((acc) => ({
          ...acc,
          address: accounts.length == 0 ? "" : accounts[0],
          isConnected: accounts.length == 0 ? false : true,
        }));
      });

      ethereum.on("chainChanged", (chainID: string) => {
        set((acc) => ({
          ...acc,
          chainID: chainID,
        }));
      });

      return () => {
        ethereum.removeListener("chainChanged", () => null);
        ethereum.removeListener("accountsChanged", () => null);
      };

    }, []);
  },
}));
