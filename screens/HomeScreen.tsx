import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { userAtomStore } from '../atoms/userAtom';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fcmAtomStore } from '../atoms/fcmAtom';
import axios from 'axios';
import { BACKEND_URL } from '../utils/BACKEND_URL';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { userInfo, setUserInfo, deleteUserInfo } = userAtomStore();
  const { fcmInfo} = fcmAtomStore();

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userInfo');
      deleteUserInfo();
    } catch (error) {
      console.log('Sign out error:', error);
    }
  };

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (response.data?.user) {
        const { name, email, photo: imageUrl } = response.data.user;

        // call backend api
        const body = {
          email,
          fcmToken:fcmInfo,
        };
        const loginResponse = await axios.post(`${BACKEND_URL}/login`,body);
        if(loginResponse.status === 200){
          const setToken = loginResponse.data.token;
          setUserInfo({
            name: name || '',
            email: email || '',
            imageUrl: imageUrl || '',
          });
          await AsyncStorage.setItem(
            'userInfo',
            JSON.stringify({ name, email, imageUrl }),
          );
          await AsyncStorage.setItem('authToken', setToken as string);
        }
      }
    } catch (error) {
      Alert.alert('Please try again after some time',JSON.stringify(error));
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          {/* <Text>{fcmInfo}</Text> */}
          <Text style={styles.helloText}>
            Hello, <Text style={styles.bold}>{userInfo?.name || 'Guest'}</Text>
          </Text>
          <Text style={styles.subText}>Welcome to Quote-wise</Text>
        </View>
        {userInfo?.imageUrl && (
          <Image source={{ uri: userInfo.imageUrl }} style={styles.avatar} />
        )}
      </View>

      {/* Centered Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={async()=>userInfo ? signOut() : await signIn()}>
        <Text style={styles.buttonText}>{userInfo ? 'Logout' : 'Sign In'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: '5%',
    paddingHorizontal: 20,
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  helloText: {
    fontSize: 24,
    fontWeight: '500',
    color: '#111',
  },
  bold: {
    fontWeight: 'bold',
  },
  subText: {
    fontSize: 16,
    color: '#555',
    marginTop: 2,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    marginTop: 40,
    backgroundColor: '#222',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    alignSelf: 'center',
    width: width * 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});
