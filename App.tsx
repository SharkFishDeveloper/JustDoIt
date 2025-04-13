import React, { useEffect, useState } from 'react';
import { Alert, Button, Image, StyleSheet, Text, View } from 'react-native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {userAtomStore } from './atoms/userAtom';
import { fcmAtomStore } from './atoms/fcmAtom';
import { gettoken } from './utils/getFCMtoken';
import { requestUserPermission } from './utils/getUserPermission';
import messaging from '@react-native-firebase/messaging';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { userInfo, setUserInfo, deleteUserInfo } = userAtomStore();
  const { fcmInfo, setFcmInfo} = fcmAtomStore();



  useEffect(() => {

    GoogleSignin.configure({
      webClientId: '183337893534-uh3p8k550ln34tuhkk4a45pappvfg1q8.apps.googleusercontent.com',
    });

   const getPermissonAndFcmToken = async()=>{
    requestUserPermission();
    const fcmToken = await gettoken();
    setFcmInfo(fcmToken);
  };


    // Checking login
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        const user = await AsyncStorage.getItem('userInfo');
        if (user) {
          setUserInfo(JSON.parse(user));
        }
      }
      setIsLoading(false);
    };

    checkLogin();
    getPermissonAndFcmToken();

      const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert(
        `${remoteMessage.notification?.title}|| ''`,
        `${remoteMessage.notification?.body || ''}`
      );
    });
    return unsubscribe;


  }, [setFcmInfo, setUserInfo]);


   // Doing signin
  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (response.data?.user) {
        const { name, email, photo: imageUrl } = response.data.user;
        setUserInfo({
          name: name || '',
          email: email || '',
          imageUrl: imageUrl || '',
        });

        // axios reaquest to backend to save user
        await AsyncStorage.setItem('userInfo', JSON.stringify({
          name,
          email,
          imageUrl: imageUrl, // not "photo"
        }));
        await AsyncStorage.setItem('authToken', response.data.idToken as string);

      }
    } catch (error) {
        Alert.alert('Please try again after some time');
    }
  };

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



  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
        <Text>FCM - {fcmInfo}</Text>
      {userInfo ? (
        <>
          <Text style={styles.text}>Welcome, {userInfo.name}</Text>
          <Text style={styles.text}>Email: {userInfo.email}</Text>
          {userInfo.imageUrl ? (
            <Image
              source={{ uri: userInfo.imageUrl }}
              style={styles.profileImage}
            />
          ) : null}
          <Button title="Sign out" onPress={signOut} />
        </>
      ) : (
        <Button title="Sign in with Google" onPress={signIn} />
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginVertical: 10,
  },
});

