import { PermissionsAndroid } from 'react-native';

export async function requestUserPermission() {
  const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
  if(granted === PermissionsAndroid.RESULTS.GRANTED){
    console.log('Granted');
  }else{
    console.log('Not Granted');
  }
}
