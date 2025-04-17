import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { Button, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { signOut } from '../hooks/signOut';
import { userAtomStore } from '../atoms/userAtom';
import { BACKEND_URL } from '../utils/BACKEND_URL';
import axios from 'axios';

const PacksScreen = () => {
    const { deleteUserInfo } = userAtomStore();

    const buyButton = async()=>{
        const token = await AsyncStorage.getItem('authToken');
        if(!token || token === undefined){
            Toast.show({
                type: 'error',
                text1: 'Authentication',
                text2: 'Please sign in again',
                position: 'bottom',
            });
            return;
        }
        const response = await axios.post(`${BACKEND_URL}/buy`,{
            id:'premium-1',
        },{
            headers:{
                Authorization:token,
            },
        });
        if(response.status === 900){
            Toast.show({
                type: 'error',
                text1: 'Authentication',
                text2: 'Please sign in again',
                position: 'bottom',
            });
            // Alert.alert("Token present",token as string)
            await signOut(deleteUserInfo);
            return;
        }
        //razor pay
    };

  return (
    <View>
        <Text> Packs Screen</Text>
        <Button title="Buy packs screen 1" onPress={async()=> await buyButton()}/>
    </View>
  );
};

export default PacksScreen;
