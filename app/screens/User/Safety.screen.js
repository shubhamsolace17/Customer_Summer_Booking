import React, {useState, useRef} from 'react';
import {Divider, Layout} from '@ui-kitten/components';
import {StyleSheet, View, Alert} from 'react-native';
import HeaderComponent from 'components/Header';
import themeConfig from 'configurations/Theme.configuration';
import Typography from 'components/Typography';
import ButtonComponent from 'components/Button';
import {ScrollView} from 'react-native-gesture-handler';
import SecondaryHeader from 'components/SecondaryHeader';
import InputComponent from 'components/Input';
import SelectComponent from 'components/Select';
import SVGIcon from 'components/Icon';
import AsyncStorage from '@react-native-async-storage/async-storage';
//Translation
import {strings} from 'i18n/i18n';

//API
import Api from 'services/Api';
import {postDataToServer} from 'services/AuthApi';
import Toast from 'react-native-easy-toast';

import {useSelector, useDispatch} from 'react-redux';
import CustomSkeletonList from 'components/CustomSkeleton';
import {
  setUserLoggedIn,
  setUserProfile,
  logout,
} from 'app/redux/actions/userActions';
import {setLanguage, initApp} from 'app/redux/actions/globalActions';
import {string} from 'prop-types';

const SafetyScreen = ({navigation}) => {
  const [userProfile, language] = useSelector(state => [
    state.UserReducerData.userProfile,
  ]);
  const [loading, setloading] = useState(false);
  const dispatch = useDispatch();
  const toast = useRef('');

  const confirmDeleteAccount = card => {
    const postData = {
      userid: userProfile.id,
    };
    Alert.alert(strings('delete_account'), strings('delete_Account_Popup'), [
      // The "Yes" button
      {
        text: strings('yes'),
        onPress: () => {
          deleteAccount(postData);
        },
      },
      // The "No" button
      // Does nothing but dismiss the dialog when tapped
      {
        text: strings('no'),
      },
    ]);
  };

  const deleteAccount = async () => {
    setloading(true);
    const postData = {
      userid: userProfile.id,
    };
    const {error, message, data, status, sucess} = await postDataToServer(
      `${Api.deleteAccount}`,
      postData,
    );
    if (status) {
      AsyncStorage.clear();
      // setUserLoggedIn(false);
      navigation.navigate('UserHome');
      dispatch(setUserLoggedIn(false));
      dispatch(setUserProfile({}));
      dispatch(initApp({isSignedIn: 'false', userProfile: {}}));
      dispatch(setLanguage('it'));
      setloading(false);
      // dispatch(logout());
    } else {
      setloading(false);
      let errorMessage = error ? error : message;
      toast.current.show(errorMessage);
    }
  };

  return (
    <Layout style={{flex: 1, backgroundColor: '#F6F6F6'}} level="1">
      <HeaderComponent showBackButton />
      {loading && (
        <>
          <CustomSkeletonList />
          <CustomSkeletonList />
        </>
      )}
      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: themeConfig.margin * 2,
          margin: themeConfig.margin,
          alignItems: 'center',
        }}>
        <SVGIcon
          type="Safety"
          color={themeConfig.colors.primary}
          width={themeConfig.margin * 6}
          height={themeConfig.margin * 6}
        />
        <Typography
          status="basic"
          category="h3"
          style={{
            fontWeight: '500',
            color: themeConfig.colors.primary,
            fontSize: 16,
            marginHorizontal: themeConfig.margin * 2,
          }}>
          {strings('Safety')}
        </Typography>
      </View>

      <ScrollView bounces={false}>
        <Layout
          level="1"
          style={[
            styles.container,
            {
              marginTop: themeConfig.margin,
              padding: themeConfig.padding * 6,
            },
            styles.boxStyle,
          ]}>
          <ButtonComponent
            onPress={() => navigation.navigate('ResetPassword')}
            style={{
              marginRight: themeConfig.margin,
              borderRadius: themeConfig.radius * 4,
              marginBottom: themeConfig.margin,
              flex: 1,
            }}
            size="large">
            <Typography status="control" category="s2">
              {strings('reset_password')}
            </Typography>
          </ButtonComponent>

          <ButtonComponent
            style={{
              marginRight: themeConfig.margin,
              borderRadius: themeConfig.radius * 4,
              flex: 1,
            }}
            size="large"
            onPress={() => confirmDeleteAccount()}>
            <Typography status="control" category="s2">
              {strings('deleteThe_Account')}
            </Typography>
          </ButtonComponent>
        </Layout>
      </ScrollView>
      <Toast
        ref={toast} //eslint-disable-line
        position="bottom"
        defaultCloseDelay={8000}
        positionValue={200}
      />
    </Layout>
  );
};
export default SafetyScreen;

const styles = StyleSheet.create({
  container: {flex: 1},
  boxStyle: {
    backgroundColor: '#F6F6F6',
  },
  leftSection: {
    width: 100,
    marginBottom: themeConfig.margin / 2,
  },
  rightSection: {
    flex: 1,
    marginBottom: themeConfig.margin / 2,
  },
});
