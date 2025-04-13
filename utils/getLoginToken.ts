import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getLoginToken() {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token !== null) {
        return token;
      } else {
        return null;
      }
    } catch (e) {
        console.error('Error retrieving token', e);
        return null;
    }
}
