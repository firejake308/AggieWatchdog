import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';

export const SERVER_URL = 'https://the-12th-eye.herokuapp.com';

export async function registerPushNotifications() {
    // check if we already have permission
    const {status: existingStatus} = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;

    // if not, then ask nicely
    if (existingStatus !== 'granted') {
        const {status} = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
    }

    // if user refuses to give permissions, return false
    if (finalStatus !== 'granted')
        return false;
    
    // get token that uniquely identifies this device
    let token = await Notifications.getExpoPushTokenAsync();

    // push token to backend
    const res = await fetch(SERVER_URL + `/users/${token}`, {method: 'PUT'});
    if (res.ok)
        return true;
    else
        return false;
}