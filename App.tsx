import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './screens/HomeScreen';
import CustomTabBar from './components/CustomTabBar';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { requestUserPermission } from './utils/getUserPermission';
import { userAtomStore } from './atoms/userAtom';
import { fcmAtomStore } from './atoms/fcmAtom';
import { gettoken } from './utils/getFCMtoken';
import { Alert } from 'react-native';
import PacksScreen from './screens/PacksScreen';
import Toast from 'react-native-toast-message';

const Tab = createBottomTabNavigator();

export default function App() {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(true);
  const { setUserInfo} = userAtomStore();
  const { setFcmInfo} = fcmAtomStore();


  useEffect(() => {

    GoogleSignin.configure({
      webClientId: '183337893534-uh3p8k550ln34tuhkk4a45pappvfg1q8.apps.googleusercontent.com',
    });

   const getPermissonAndFcmToken = async()=>{
    requestUserPermission();
    const fcmToken = await gettoken();
    setFcmInfo(fcmToken);
  };

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


  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{headerShown: false}}
        tabBar={renderCustomTabBar}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Packs" component={PacksScreen} />
      </Tab.Navigator>
      <Toast />
    </NavigationContainer>
  );
}


const renderCustomTabBar = (props: BottomTabBarProps) => <CustomTabBar {...props} />;

