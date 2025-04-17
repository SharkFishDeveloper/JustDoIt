// import { GoogleSignin } from '@react-native-google-signin/google-signin';
// import { userAtomStore } from '../atoms/userAtom';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Alert } from 'react-native';
// import axios from 'axios';
// import { BACKEND_URL } from '../utils/BACKEND_URL';




// export const signIn = async () => {
//     try {
//       await GoogleSignin.hasPlayServices();
//       const response = await GoogleSignin.signIn();
//       if (response.data?.user) {
//         const { name, email, photo: imageUrl } = response.data.user;

//         // call backend api
//         const body = {
//           email,
//           fcmToken:fcmInfo,
//         };
//         const loginResponse = await axios.post(`${BACKEND_URL}/login`,body);
//         if(loginResponse.status === 200){
//           const setToken = loginResponse.data.token;
//           setUserInfo({
//             name: name || '',
//             email: email || '',
//             imageUrl: imageUrl || '',
//           });
//           await AsyncStorage.setItem(
//             'userInfo',
//             JSON.stringify({ name, email, imageUrl }),
//           );
//           await AsyncStorage.setItem('authToken', setToken as string);
//         }
//       }
//     } catch (error) {
//       Alert.alert('Please try again after some time',JSON.stringify(error));
//     }
//   };
