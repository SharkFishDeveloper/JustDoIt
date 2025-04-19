import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {  ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { signOut } from '../hooks/signOut';
import { userAtomStore } from '../atoms/userAtom';
import { BACKEND_URL } from '../utils/BACKEND_URL';
import axios from 'axios';
import { PACKS } from '../utils/Packs';

const PacksScreen = () => {
    const { deleteUserInfo } = userAtomStore();

    const buyButton = async(packId:string)=>{
        try {
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
            id:packId,
        },{
            headers:{
                Authorization:token,
            },
        });
        if(response.status === 300){
            Toast.show({
                type: 'error',
                text1: 'Authentication',
                text2: 'Please sign in again',
                position: 'bottom',
            });
            await signOut(deleteUserInfo);
            return;
        }
        else if(response.status === 200){
            return Toast.show({
                type: 'success',
                text1: 'Successfully purchased',
                text2: `${response.data.message}`,
                position: 'bottom',
            });
        }
        } catch (error) {
            //@ts-ignore
            if (error.response && error.response.status === 400) {
                return Toast.show({
                  type: 'error',
                  text1: 'Please try again later',
                  //@ts-ignore
                  text2: `${error.response.data.message}`,
                  position: 'bottom',
                });
              }

              // Generic fallback
              Toast.show({
                type: 'error',
                text1: 'Something went wrong',
                text2: 'Please try again later',
                position: 'bottom',
              });
            }
        };



  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Available Packs</Text>
      {PACKS.map(pack => (
        <View key={pack.id} style={styles.card}>
          <Text style={styles.title}>{pack.title}</Text>
          <Text style={styles.price}>{pack.price}</Text>
          <View style={styles.benefitsContainer}>
            {pack.benefits.map((benefit, index) => (
              <Text key={index} style={styles.benefit}>• {benefit}</Text>
            ))}
          </View>
          <TouchableOpacity
            onPress={() => buyButton(pack.id)}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
      paddingVertical: 20,
      paddingHorizontal: 16,
      backgroundColor: '#fff',
    },
    header: {
      fontSize: 26,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
    },
    card: {
      backgroundColor: '#f7f7f7',
      padding: 16,
      borderRadius: 12,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 2,
    },
    title: {
      fontSize: 20,
      fontWeight: '600',
    },
    price: {
      fontSize: 16,
      color: '#888',
      marginBottom: 10,
    },
    benefitsContainer: {
      marginBottom: 12,
    },
    benefit: {
      fontSize: 14,
      color: '#444',
      marginBottom: 4,
    },
    button: {
      backgroundColor: '#222',
      paddingVertical: 10,
      borderRadius: 8,
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontWeight: '600',
    },
  });


export default PacksScreen;
