import {
  requestMultiple,
  checkMultiple,
  PERMISSIONS,
  RESULTS,
  check,
  request,
} from 'react-native-permissions';
import {Platform} from 'react-native';
const requestArray = () => {
  return Platform.select({
    android: [
      PERMISSIONS.ANDROID.CAMERA,
      PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      // PERMISSIONS.ANDROID.LOCATION_WHEN_IN_USE,
    ],
    ios: [PERMISSIONS.IOS.CAMERA],
  });
};

export const checkMultiplePermission = async () => {
  const permissionRequired = requestArray();
  const result = await checkMultiple(permissionRequired);
  const blockedRequests = permissionRequired.filter((permissionKey, index) => {
    return result[permissionKey] !== RESULTS.GRANTED;
  });
  if (blockedRequests.length) {
    return {
      complete: false,
      permissionRequired: blockedRequests,
    };
  }
  return {
    complete: true,
  };
};
export const requestMultiplePermission = async () => {
  const permissionRequired = await checkMultiplePermission();
  if (permissionRequired.complete) {
    return {complete: true};
  }
  await requestMultiple(permissionRequired.permissionRequired);
  return await checkMultiplePermission();
};
