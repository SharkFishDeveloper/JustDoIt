import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  ScrollView,
  TextInput,
} from 'react-native';
import { userAtomStore } from '../atoms/userAtom';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fcmAtomStore } from '../atoms/fcmAtom';
import axios from 'axios';
import { BACKEND_URL } from '../utils/BACKEND_URL';
import { PurchasedPack } from '../interface/userInterface';
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get('window');

export default function HomeScreen() {

  const { userInfo, setUserInfo, deleteUserInfo } = userAtomStore();
  const { fcmInfo } = fcmAtomStore();
  const [editingPackId, setEditingPackId] = useState<string | null>(null);

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

  const capitalizeFirstLetter = (text?: string) => {
    if (!text) {return 'Untitled Pack';}
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  const updatePack = async (updatedPack: PurchasedPack) => {
    try {
      if(updatedPack.dailyMoodLevel && updatedPack.dailyMoodLevel?.length >= 10){
        return Toast.show({
          type: 'error',
          text1: 'Edit error',
          text2: 'Moode level length is greater than 10',
          position: 'bottom',
        });
      }
      if(updatedPack.notificationMood && updatedPack.notificationMood?.length >= 15){
        return Toast.show({
          type: 'error',
          text1: 'Edit error',
          text2: 'Notification mood cannot be greater than 15',
          position: 'bottom',
        });
      }
      if(updatedPack.notificationTopic && updatedPack.notificationTopic?.length >= 15){
        return Toast.show({
          type: 'error',
          text1: 'Edit error',
          text2: 'Notification topic cannot be greater than 15',
          position: 'bottom',
        });
      }
      const token = await AsyncStorage.getItem('authToken');
      const response = await axios.put(
        `${BACKEND_URL}/update`,
        {
          updatedPack,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      if (response.status === 200 && userInfo) {

        const updatedPacks = userInfo.purchasePack.map((pack) =>
          pack.id === updatedPack.id ? { ...pack, ...updatedPack } : pack
        );

        setUserInfo({
          ...userInfo,
          purchasePack: updatedPacks,
        });


        return Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Made changes successfully',
            position: 'bottom',
        });
      }
    } catch (err) {
      // @ts-ignore
      if (error.response && error.response.status === 300) {
        return Toast.show({
          type: 'error',
          text1: 'Authentication',
          text2: 'Please sign in again',
          position: 'bottom',
        });
      }
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
        text2: 'Please try again later',
        position: 'bottom',
      });
    }finally{
      setEditingPackId(null);
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

      {userInfo?.purchasePack && userInfo?.purchasePack?.length > 0 && (
        <View style={styles.packSection}>
          <Text style={styles.title}>Purchased Packs</Text>
          {userInfo.purchasePack.map((pack: any, index: number) => (

            <View key={index} style={styles.packContainer} >

                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() =>
                      setEditingPackId(prev => (prev === pack.id ? null : pack.id))
                    }
                  >
                    <Text style={styles.editButtonText}>Edit</Text>
                  </TouchableOpacity>

                  <Text style={styles.packTitle}>{capitalizeFirstLetter(pack.id) || 'Untitled Pack'}</Text>
                  <Text style={styles.moodLevel}>Daily mood level - {capitalizeFirstLetter(pack.dailyMoodLevel)}</Text>
<Text style={styles.notificationTopic}>Notification topic - {capitalizeFirstLetter(pack.notificationTopic)}</Text>
<Text style={styles.notificationMood}>Notification mood - {capitalizeFirstLetter(pack.notificationMood)}</Text>

              {Object.values(pack).some(value => value === undefined || value === null || value === '') && (
                <Text style={styles.warning}>This pack has incomplete or missing fields!</Text>
              )}
              {pack.content?.length > 0 && (
                <View style={styles.contentContainer}>
                  {pack.map((item: any, idx: number) => (
                    <Text key={idx} style={styles.contentText}>• {item}</Text>
                  ))}
                </View>
              )}






                  {editingPackId === pack.id && (
                    // eslint-disable-next-line react-native/no-inline-styles
  <View style={{ marginTop: 10 }}>
    <Text style={styles.editLabel}>Daily Mood Level</Text>
    <TextInput
      style={styles.editValue}
      value={pack.dailyMoodLevel || ''}
      onChangeText={(text) => {
        const newPacks = [...userInfo.purchasePack];
        newPacks[index].dailyMoodLevel = text;
        setUserInfo({ ...userInfo, purchasePack: newPacks });
      }}
      placeholder="Enter mood level"
    />

    <Text style={styles.editLabel}>Notification Topic</Text>
    <TextInput
      style={styles.editValue}
      value={pack.notificationTopic || ''}
      onChangeText={(text) => {
        const newPacks = [...userInfo.purchasePack];
        newPacks[index].notificationTopic = text;
        setUserInfo({ ...userInfo, purchasePack: newPacks });
      }}
      placeholder="Enter topic"
    />

    <Text style={styles.editLabel}>Notification Mood</Text>
    <TextInput
      style={styles.editValue}
      value={pack.notificationMood || ''}
      onChangeText={(text) => {
        const newPacks = [...userInfo.purchasePack];
        newPacks[index].notificationMood = text;
        setUserInfo({ ...userInfo, purchasePack: newPacks });
      }}
      placeholder="Enter mood"
    />

    <TouchableOpacity
      // eslint-disable-next-line react-native/no-inline-styles
      style={[styles.button, { marginTop: 10 }]}
      onPress={() => updatePack(userInfo.purchasePack[index])}
    >
      <Text style={styles.buttonText}>Save Changes</Text>
    </TouchableOpacity>
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
  editLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 10,
    color: '#333',
  },
  editValue: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
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
  moodLevel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#343634', // blue-ish
    marginBottom: 4,
  },
  notificationTopic: {
    fontSize: 16,
    fontWeight: '600',
    color: '#343634', // reddish
    marginBottom: 4,
  },
  notificationMood: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50', // greenish
    marginBottom: 4,
  },
});
