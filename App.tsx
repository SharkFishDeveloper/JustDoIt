import React, { useEffect, useState } from 'react';
import { Button, Image, Text, View } from 'react-native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {userAtomStore } from './atoms/userAtom';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { userInfo, setUserInfo, deleteUserInfo } = userAtomStore();

  useEffect(() => {

    GoogleSignin.configure({
      webClientId: '183337893534-uh3p8k550ln34tuhkk4a45pappvfg1q8.apps.googleusercontent.com',
    });

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
  }, [setUserInfo]);



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
        // console.log('Some other error happened:', error);
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
    <View style={{ padding: 20 }}>
      <Text>User - {JSON.stringify(userInfo)}</Text>
      {userInfo ? (
        <>
          <Text>Welcome, {userInfo.name}</Text>
          <Text>Email: {userInfo.email}</Text>
          {userInfo.imageUrl ? (
            <Image
              source={{ uri: userInfo.imageUrl }}
              style={{ width: 100, height: 100, borderRadius: 50, marginVertical: 10 }}
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















  // const [fcm_token, setFcm_token] = useState<string|null>(null);
  // const [userInfo, setUserInfo] = useState(null);
  // const [loginTokenValue,setLoginTokenValue] = useState<string|null>(null);

  // const getPermissonAndFcmToken = async()=>{
  //   requestUserPermission();
  //   const fcmToken = await gettoken();
  //   setFcm_token(fcmToken);
  // };



  // useEffect(()=>{
  //   getPermissonAndFcmToken();

  //   const loginTokenFunction = async()=>{
  //      setLoginTokenValue(await getLoginToken());
  //   };



  //   loginTokenFunction();

  //   const unsubscribe = messaging().onMessage(async remoteMessage => {
  //     Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
  //   });
  //   return unsubscribe;
  // },[]);

