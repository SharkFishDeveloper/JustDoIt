import React, { useEffect, useState } from 'react';
import { View, Text, PermissionsAndroid, Alert } from 'react-native';
import { getApp } from '@react-native-firebase/app';
import messaging , {
  getMessaging,
  getToken,
} from '@react-native-firebase/messaging';

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
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18 }}>HELLO, there</Text>
      <Text selectable> TOKEN - {fcm_token}</Text>
    </View>
  );
}
