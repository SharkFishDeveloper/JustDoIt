import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export const signOut = async (deleteUserInfo: () => void) => {
    try {
      await GoogleSignin.signOut();
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userInfo');
      deleteUserInfo();
    } catch (error) {
      console.log('Sign out error:', error);
    }
  };
