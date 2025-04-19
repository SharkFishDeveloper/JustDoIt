import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  ScrollView,
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
  const { fcmInfo } = fcmAtomStore();

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userInfo');
      deleteUserInfo();
    } catch (error) {
      Alert.alert('Sign out failed', JSON.stringify(error));
    }
  };

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (response.data?.user) {
        const { name, email, photo: imageUrl } = response.data.user;

        const body = {
          email,
          fcmToken: fcmInfo,
        };

        const loginResponse = await axios.post(`${BACKEND_URL}/login`, body);
        if (loginResponse.status === 200) {
          const setToken = loginResponse.data.token;
          setUserInfo({
            name: name || '',
            email: email || '',
            imageUrl: imageUrl || '',
            purchasePack: loginResponse.data.purchasedPacks || [],
          });
          await AsyncStorage.setItem(
            'userInfo',
            JSON.stringify({ name, email, imageUrl }),
          );
          await AsyncStorage.setItem('authToken', setToken as string);
        }
      }
    } catch (error) {
      Alert.alert('Please try again after some time', JSON.stringify(error));
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.helloText}>
            Hello, <Text style={styles.bold}>{userInfo?.name || 'Guest'}</Text>
          </Text>
          <Text style={styles.subText}>Welcome to Quote-wise</Text>
        </View>
        {userInfo?.imageUrl && (
          <Image source={{ uri: userInfo.imageUrl }} style={styles.avatar} />
        )}
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={async () => (userInfo ? signOut() : await signIn())}
      >
        <Text style={styles.buttonText}>{userInfo ? 'Logout' : 'Sign In'}</Text>
      </TouchableOpacity>

      {userInfo?.purchasePack?.length > 0 && (
        <View style={styles.packSection}>
          <Text style={styles.title}>Purchased Packs</Text>
          {userInfo.purchasePack.map((pack: any, index: number) => (
            <View key={index} style={styles.packContainer}>
              <TouchableOpacity style={styles.editButton}>
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
              <Text style={styles.packTitle}>{pack.title || 'Untitled Pack'}</Text>
              {(!pack.content || pack.content.length === 0) && (
                <Text style={styles.warning}>This pack has no content!</Text>
              )}
              {/* Display pack content if any */}
              {pack.content?.length > 0 && (
                <View style={styles.contentContainer}>
                  {pack.content.map((item: any, idx: number) => (
                    <Text key={idx} style={styles.contentText}>• {item}</Text>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: '5%',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    paddingBottom: 100,
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
    marginTop: 30,
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
  packSection: {
    marginTop: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  packContainer: {
    width: '100%',
    padding: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    position: 'relative',
  },
  editButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#222',
    borderRadius: 6,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  packTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  warning: {
    color: 'red',
    fontSize: 14,
    fontWeight: '500',
  },
  contentContainer: {
    marginTop: 10,
  },
  contentText: {
    fontSize: 14,
    color: '#333',
  },
});
