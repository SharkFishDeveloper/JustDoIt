import React, { useEffect, useState } from 'react';
import { View, Text, PermissionsAndroid, Alert, Button } from 'react-native';
import { getApp } from '@react-native-firebase/app';
import messaging , {
  getMessaging,
  getToken,
} from '@react-native-firebase/messaging';
import { GoogleSignin } from '@react-native-google-signin/google-signin';


GoogleSignin.configure({
  webClientId: '694047354212-gpa9mc89aj0phtqlu9fs83an8n9qjd2f.apps.googleusercontent.com',
});




async function requestUserPermission() {
  const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
  if(granted === PermissionsAndroid.RESULTS.GRANTED){
    console.log('Granted');
  }else{
    console.log('Not Granted');
  }
}


export default function App() {
  const [fcm_token, setFcm_token] = useState<string>('');
  const [userInfo, setUserInfo] = useState(null);

  const signInWithGoogle = async () => {
    try {
      const user = await GoogleSignin.signIn();
      setUserInfo(user);
      console.log('User Info:', user);
      // Send the user ID token to your backend if needed
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      Alert.alert('Error', 'Google sign-in failed. Please try again.');
    }
  };

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      setUserInfo(null);
      console.log('User signed out');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };


  useEffect(()=>{
    requestUserPermission();
    gettoken();
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  },[]);

  async function gettoken(){
    const app = getApp();
    const messagingInstance = getMessaging(app);
    const token = await getToken(messagingInstance);
    console.log(token);
    setFcm_token(token);
  }

  return (
    <View>
      {!userInfo ? (
        <Button title="Sign In with Google" onPress={signInWithGoogle} />
      ) : (
        <View>
          <Text>Welcome, {userInfo.user.name}</Text>
          <Button title="Sign Out" onPress={signOut} />
        </View>
      )}
    </View>
  );
}
