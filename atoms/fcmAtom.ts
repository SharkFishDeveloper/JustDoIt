import { create } from 'zustand';

interface FCMState {
    fcmInfo: string | null;
    setFcmInfo: (token: string) => void;
  }

export const fcmAtomStore = create<FCMState>((set) => ({
  fcmInfo: null,
  setFcmInfo: (token:string) => set({ fcmInfo: token }),
}));
