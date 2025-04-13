import React, { useEffect, useState } from 'react';
import { Button, Text } from 'react-native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';



export default function App() {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '183337893534-uh3p8k550ln34tuhkk4a45pappvfg1q8.apps.googleusercontent.com',
      // offlineAccess: true,
    });
  }, []);



  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      setUserInfo(response);
      console.log('User Info:', response);
    } catch (error) {
      // if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      //   console.log('User cancelled the login flow');
      // } else if (error.code === statusCodes.IN_PROGRESS) {
      //   console.log('Sign in is in progress already');
      // } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      //   console.log('Play services not available or outdated');
      // } else {
        console.log('Some other error happened:', error);
      // }
    }
  };



  return (
      <Text>
        <Button title="Sign in with Google" onPress={signIn} />
        <Text>USER </Text>
      </Text>
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

