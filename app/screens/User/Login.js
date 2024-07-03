import React, {useEffect, useState, useRef} from 'react';
import {Divider, Layout} from '@ui-kitten/components';
import {
  Linking,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import HeaderComponent from 'components/Header';
import themeConfig from 'configurations/Theme.configuration';
import Typography from 'components/Typography';
import ButtonComponent from 'components/Button';
import {ScrollView} from 'react-native-gesture-handler';
import SVGIcon from 'components/Icon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {
  GraphRequest,
  GraphRequestManager,
  LoginManager,
  AccessToken,
} from 'react-native-fbsdk';
import Toast from 'react-native-easy-toast';
import auth from '@react-native-firebase/auth';
import {
  appleAuth,
  AppleButton,
} from '@invertase/react-native-apple-authentication';
//API
import Api from 'services/Api';
import {postDataToServer} from 'services/AuthApi';
import {strings} from 'i18n/i18n';
import {setUserLoggedIn, setUserProfile} from 'app/redux/actions/userActions';
import {useDispatch, useSelector} from 'react-redux';
import CustomSkeletonList from 'components/CustomSkeleton';
import {setShowBooking} from 'redux/actions';

const LoginScreen = ({navigation}) => {
  const dispatch = useDispatch();
  // const [googleloading, setgoogleloading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const toast = useRef('');
  const [language, showBookingLogin] = useSelector(state => [
    state.globalReducerData.language,
    state.globalReducerData.showBookingLogin,
  ]);

  const signInHandler = async provider => {
    if (provider === 'Email') {
      // googleSignIn()
      return navigation.navigate('LogInWithEmail');
    }
    if (provider === 'Facebook') {
      facebookSignIn();
    }
    if (provider == 'Google') {
      googleSignIn();
    }
  };
  useEffect(async () => {
    const unsubscribe = navigation.addListener('focus', () => {
      let WebClientID =
        '699782965766-kssqrjns3ekgr9tvjscchlqns695vdtd.apps.googleusercontent.com';
      GoogleSignin.configure({
        webClientId: WebClientID,
        accountName: '',
      });
      signOut();
    });
    return () => {
      unsubscribe;
    };
  }, [navigation, language]);

  const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    } catch (error) {}
  };

  const googleSignIn = async () => {
    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices();
      const info = await GoogleSignin.signIn();
      console.log('info', info);
      if (info) {
        const profileFormat = {
          name: `${info.user.givenName || ''} ${info.user.familyName || ''}`,
          firstName: info.user.givenName || '',
          lastName: info.user.familyName || '',
          email: info.user.email || '',
          image: info.user.photo || '',
          uniqueId: info.user.id,
          tokenId: info.idToken,
        };
        const postData = {
          email: profileFormat.email,
          googleId: profileFormat.uniqueId,
          firstname: profileFormat.firstName,
          lastname: profileFormat.lastName,
          profilePic: profileFormat.image,
          loginMethod: 'google',
          mobile: '',
          country: '',
          roles: ['consumer'],
          tokenId: profileFormat.tokenId,
          isMobile: true,
        };
        console.log('postData', postData);
        const {data, message, error, status, success} = await postDataToServer(
          `${Api.socialLogin}`,
          postData,
        );
        console.log('data', data, status, error);
        if (status) {
          await AsyncStorage.setItem('isSignedIn', 'true');
          await AsyncStorage.setItem('userProfile', JSON.stringify(data));
          await AsyncStorage.setItem(
            'auth-token',
            JSON.stringify(data.accessToken),
          );
          dispatch(setUserLoggedIn(true));
          dispatch(setUserProfile(data));
          if (showBookingLogin) {
            navigation.navigate('FinishBooking');
          } else {
            navigation.navigate('User', {screen: 'UserHome'});
          }
          setLoading(false);
        } else {
          let errorMessage = error ? error : message;
          setError(errorMessage);
          setLoading(false);
        }
      }
    } catch (error) {
      setLoading(false);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        setError('User cancelled the login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        setError('In progress already');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        setError('Play services not available or outdated');
      } else {
        setError('Some other error happened');
      }
    }
  };

  const getFBProfileInfo = () => {
    return new Promise((resolve, reject) => {
      const infoRequest = new GraphRequest(
        '/me',
        {
          parameters: {
            fields: {
              string: 'email,first_name,last_name,picture',
            },
          },
        },
        (err, res) => {
          return err ? reject(err) : resolve(res);
        },
      );
      new GraphRequestManager().addRequest(infoRequest).start();
    });
  };
  const facebookSignIn = async () => {
    try {
      if (Platform.OS === 'android') {
        LoginManager.setLoginBehavior('web_only');
      }
      const result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);
      if (result.isCancelled) {
        setError('User Cancelled the Request');
      }
      const profile = await getFBProfileInfo();
      const accessTokenData = await AccessToken.getCurrentAccessToken();
      console.log("profile",profile)
      if (!result.isCancelled && profile) {
        const profileFormat = {
          name: `${profile.first_name || ''} ${profile.last_name || ''}`,
          firstName: profile.first_name || '',
          lastName: profile.last_name || '',
          image: profile.picture.data.url || '',
          email: profile.email || '',
          uniqueId: profile.id,
          accessTokenData,
        };
        const postData = {
          email: profileFormat.email,
          facebookId: profileFormat.uniqueId,
          firstname: profileFormat.firstName,
          lastname: profileFormat.lastName,
          profilePic: profileFormat.image,
          loginMethod: 'facebook',
          mobile: '',
          country: '',
          roles: 'consumer',
        };
        const userId = profileFormat.accessTokenData.userID;
        const token = profileFormat.accessTokenData.accessToken;
        const getGraphApiData = `https://graph.facebook.com/me?access_token=${token}`;
        axios
          .get(getGraphApiData)
          .then(function (response) {
            if (userId === response.data.id) {
              sendToFacebookApi(postData);
            } else {
              setError('Token is not Valid,plz try again later');
            }
          })
          .catch(function (error) {
            setError(error);
          });
      }
    } catch (error) {
      setError(error);
    }
  };

  const sendToFacebookApi = async postData => {
    const {data, message, error, status} = await postDataToServer(
      `${Api.socialLogin}`,
      postData,
    );
    if (status) {
      await AsyncStorage.setItem('isSignedIn', 'true');
      await AsyncStorage.setItem('userProfile', JSON.stringify(data));
      await AsyncStorage.setItem(
        'auth-token',
        JSON.stringify(data.accessToken),
      );
      dispatch(setUserLoggedIn(true));
      dispatch(setUserProfile(data));
      if (showBookingLogin) {
        navigation.navigate('FinishBooking');
      } else {
        navigation.navigate('User', {screen: 'UserHome'});
      }
    } else {
      let errorMessage = error ? error : message;
      setError(errorMessage);
    }
  };

  const onAppleButtonPress = async () => {
    // Start the sign-in request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    // Ensure Apple returned a user identityToken
    if (!appleAuthRequestResponse.identityToken) {
      throw new Error('Apple Sign-In failed - no identify token returned');
    }
    const postData = {
      email: appleAuthRequestResponse.email,
      appleId: appleAuthRequestResponse.identityToken,
      firstname: appleAuthRequestResponse.fullName.nickname,
      lastname: appleAuthRequestResponse.fullName.namePrefix,
      profilePic: '',
      loginMethod: 'apple',
      mobile: '',
      country: '',
      roles: 'consumer',
    };
    if (appleAuthRequestResponse) {
      sendToAppleApi(postData);
    }

    // Create a Firebase credential from the response
    const {identityToken, nonce} = appleAuthRequestResponse;

    const appleCredential = auth.AppleAuthProvider.credential(
      identityToken,
      nonce,
    );

    // Sign the user in with the credential
    return auth().signInWithCredential(appleCredential);
  };

  const sendToAppleApi = async postData => {
    const {data, message, error, status} = await postDataToServer(
      `${Api.socialLogin}`,
      postData,
    );
    if (status) {
      await AsyncStorage.setItem('isSignedIn', 'true');
      await AsyncStorage.setItem('userProfile', JSON.stringify(data));
      await AsyncStorage.setItem(
        'auth-token',
        JSON.stringify(data.accessToken),
      );
      dispatch(setUserLoggedIn(true));
      dispatch(setUserProfile(data));
      if (showBookingLogin) {
        navigation.navigate('FinishBooking');
      } else {
        navigation.navigate('User', {screen: 'UserHome'});
      }
    } else {
      let errorMessage = error ? error : message;
      setError(errorMessage);
    }
  };

  const RenderLogin = () => {
    return (
      <Layout
        level="1"
        style={[
          styles.container,
          {marginTop: themeConfig.margin},
          styles.boxStyle,
        ]}>
        <TouchableOpacity
          onPress={() => signInHandler('Facebook')}
          style={[styles.socialButton, {marginTop: themeConfig.margin}]}>
          <SVGIcon type="Facebook" width={30} height={30} />
          <Typography
            category="s1"
            style={{fontWeight: '400', marginLeft: themeConfig.margin}}>
            {strings('sign_fb')}
          </Typography>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => signInHandler('Google')}
          style={styles.socialButton}>
          <SVGIcon type="Google" width={30} height={30} />
          <Typography
            category="s1"
            style={{fontWeight: '400', marginLeft: themeConfig.margin}}>
            {strings('sign_google')}
          </Typography>
        </TouchableOpacity>
        {Platform.OS === 'ios' ? (
          <TouchableOpacity
            onPress={() => onAppleButtonPress('Apple')}
            style={styles.socialButton}>
            <SVGIcon type="Apple" width={30} height={30} />
            <Typography
              category="s1"
              style={{fontWeight: '400', marginLeft: themeConfig.margin}}>
              {strings('sign_apple')}
            </Typography>
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          onPress={() => signInHandler('Email')}
          style={styles.socialButton}>
          <SVGIcon type="Email" width={30} height={30} />
          <Typography
            category="s1"
            style={{fontWeight: '400', marginLeft: themeConfig.margin}}>
            {strings('sign_email')}
          </Typography>
        </TouchableOpacity>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: themeConfig.margin / 2,
          }}>
          <Typography
            status="basic"
            category="s1"
            style={{fontWeight: '400', marginLeft: themeConfig.margin}}>
            - - {strings('or')} - -
          </Typography>
        </View>
        <ButtonComponent onPress={() => navigation.navigate('CreateAccount')}>
          <Typography
            status="control"
            category="s2"
            style={{fontWeight: '400'}}>
            {strings('create_your_account')}
          </Typography>
        </ButtonComponent>
        <View>
          <Typography category="p1" status="basic">
            {strings('terms_conditionsTitle')}
            <Typography
              category="p2"
              onPress={() =>
                Linking.openURL('https://summerbooking.it/terms-and-conditions')
              }>
              {' '}
              {strings('terms_privacy')}
            </Typography>
          </Typography>
          <View
            style={{
              alignSelf: 'center',
              justifyContent: 'center',
              flex: 1,
            }}>
            <Typography category="p1" status="danger">
              {error}
            </Typography>
          </View>
        </View>
      </Layout>
    );
  };

  return (
    <Layout style={{flex: 1}} level="1">
      <HeaderComponent showBackButton />

      <ScrollView bounces={false}>
        {loading && (
          <>
            <CustomSkeletonList />
            <CustomSkeletonList />
          </>
        )}
        {!loading && <RenderLogin />}
      </ScrollView>
      <Toast
        ref={toast} //eslint-disable-line
        position="bottom"
        defaultCloseDelay={8000}
        style={{backgroundColor: 'red'}}
        positionValue={200}
        textStyle={{color: 'white'}}
      />
    </Layout>
  );
};
export default LoginScreen;

const styles = StyleSheet.create({
  container: {flex: 1},
  boxStyle: {
    marginHorizontal: themeConfig.margin * 2,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: themeConfig.margin,
    padding: themeConfig.padding,
    borderWidth: themeConfig.borderWidth * 1.2,
    borderColor: themeConfig.colors.borderColor,
    borderRadius: themeConfig.radius * 4,
    // backgroundColor: themeConfig.colors.lightBule,
    color: themeConfig.colors.primary,
  },
});
