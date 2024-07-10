import { create } from "zustand";


interface currencyValue {
  mETH: number;
  mGOLD: number;
  mBTC: number;
}

interface CentralStoreTypes {
  address: string;
  setAddress: (address: string) => void;

  currency: currencyValue;
  setETH: (value: number) => void;
  setUSDC: (value: number) => void;
  setBTC: (value: number) => void;
}

export const useCentralStore = create<CentralStoreTypes>((set) => ({
  //TODO: Inko 0 krna hai last mei aur fetch krna hai
  address: "34567890abcdef1234567890abcdef12345678",
  setAddress: (address: string) => set({ address }),

  currency: {
    mETH: 3500.45,
    mGOLD: 1.03,
    mBTC: 65152,
  },
  setETH: (value: number) =>
    set((state) => ({ currency: { ...state.currency, mETH: value } })),
  setUSDC: (value: number) =>
    set((state) => ({ currency: { ...state.currency, mGOLD: value } })),
  setBTC: (value: number) =>
    set((state) => ({ currency: { ...state.currency, mBTC: value } })),
}));
