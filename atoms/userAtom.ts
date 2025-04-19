import { create } from 'zustand';
import { PurchasedPack, UserInterface } from '../interface/userInterface';

interface UserAtomStore {
  userInfo: UserInterface | null;
  setUserInfo: (user: UserInterface) => void;
  deleteUserInfo: () => void;
  purchasedPacks: PurchasedPack[];
}


export const userAtomStore = create<UserAtomStore>((set) => ({
  userInfo: null,
  setUserInfo: (user: any) => set({ userInfo: user }),
  deleteUserInfo: () => set({ userInfo: null }),
  purchasedPacks: [],
}));
