import { getApp } from '@react-native-firebase/app';
import { getMessaging, getToken } from '@react-native-firebase/messaging';

  export async function gettoken(){
    const app = getApp();
    const messagingInstance = getMessaging(app);
    const token = await getToken(messagingInstance);
    return token;
}

