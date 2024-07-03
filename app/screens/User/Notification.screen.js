import React, {useState, useEffect, useRef} from 'react';
import {Divider, Layout, Toggle} from '@ui-kitten/components';
import {StyleSheet, View} from 'react-native';
import HeaderComponent from 'components/Header';
import themeConfig from 'configurations/Theme.configuration';
import Typography from 'components/Typography';
import ButtonComponent from 'components/Button';
import {ScrollView} from 'react-native-gesture-handler';
import InputComponent from 'components/Input';
import SelectComponent from 'components/Select';
import SVGIcon from 'components/Icon';
import {strings} from 'i18n/i18n';

//API
import Api from 'services/Api';
import {postDataToServer} from 'services/AuthApi';
import Toast from 'react-native-easy-toast';

import {useSelector} from 'react-redux';
import CustomSkeletonList from 'components/CustomSkeleton';

const NotificationScreen = ({navigation}) => {
  const [showAddCard, setShowAddcard] = useState(false);
  const [userProfile, language] = useSelector(state => [
    state.UserReducerData.userProfile,
    state.globalReducerData.language,
  ]);
  const [activeChecked, setActiveChecked] = React.useState(true);
  const [notificationActive, setNotificationActive] = useState(false);
  const [userNotification, setUserNotification] = useState(0);
  const [loading, setloading] = useState(false);
  const toast = useRef('');

  const onActiveCheckedChange = isChecked => {
    setNotificationActive(isChecked);
  };

  const loadData = async () => {
    setloading(true);
    const postData = {
      userid: userProfile.id,
    };
    const {data, error, message, status} = await postDataToServer(
      `${Api.getUserDetails}`,
      postData,
    );
    if (status) {
      if (data && data.data && data.data.length > 0) {
        setUserNotification(data.data[0].disableNotification);
        setNotificationActive(
          data.data[0].disableNotification === 0 ? false : true,
        );
      }
      setloading(false);
    } else {
      setloading(false);
      let errorMessage = error ? error : message;
      toast.current.show(errorMessage);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });
    return () => {
      unsubscribe;
    };
  }, [navigation]);

  const onSave = async () => {
    const postData = {
      userid: userProfile.id,
      notificationStatus: userNotification == 0 ? '1' : '0',
    };
    const {error, message, sucess} = await postDataToServer(
      `${Api.disableNotification}`,
      postData,
    );
    if (sucess) {
      loadData();
    } else {
      setloading(false);
      let errorMessage = error ? error : message;
      toast.current.show(errorMessage);
    }
  };

  const ToggleNotification = () => {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Typography
          status="basic"
          category="s2"
          style={{
            fontWeight: '500',
            fontSize: 14,
            marginHorizontal: themeConfig.margin * 2,
          }}>
          {strings('enable_disable_notification')}
        </Typography>

        <Toggle
          style={styles.toggle}
          checked={notificationActive}
          status="primary"
          onChange={onActiveCheckedChange}
        />
      </View>
    );
  };

  const NoticationsCard = () => {
    return (
      <>
        <View
          style={{
            flexDirection: 'row',
            marginHorizontal: themeConfig.margin * 2,
            margin: themeConfig.margin,
            alignItems: 'center',
          }}>
          <SVGIcon
            type="Notification"
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
              marginHorizontal: themeConfig.margin * 2,
            }}>
            {strings('Notications')}
          </Typography>
        </View>

        <ScrollView bounces={false}>
          <Layout
            level="1"
            style={[
              styles.container,
              {
                marginTop: themeConfig.margin,
                borderRadius: themeConfig.radius * 2,
                padding: themeConfig.padding * 2,
                shadowColor: '#000000',
                shadowOffset: {width: 0, height: 1},
                shadowOpacity: 0.2,
                shadowRadius: 2,
                elevation: 2,
              },
              styles.boxStyle,
            ]}>
            <ToggleNotification />
          </Layout>

          <Layout
            style={{
              backgroundColor: '#F6F6F6',
              margin: themeConfig.margin * 2,
            }}>
            <Divider />
            <View
              style={[
                styles.boxStyle,
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              ]}>
              <ButtonComponent
                onPress={() => navigation.goBack()}
                style={{
                  marginRight: themeConfig.margin,
                  borderRadius: themeConfig.radius * 4,
                  flex: 1,
                }}
                size="small">
                <Typography
                  status="control"
                  category="s2"
                  style={{fontWeight: '400'}}>
                  {strings('cancel')}
                </Typography>
              </ButtonComponent>

              <ButtonComponent
                onPress={() => onSave()}
                style={{
                  marginRight: themeConfig.margin,
                  borderRadius: themeConfig.radius * 4,
                  flex: 1,
                }}
                size="small">
                <Typography
                  status="control"
                  category="s2"
                  style={{fontWeight: '400'}}>
                  {strings('save')}
                </Typography>
              </ButtonComponent>
            </View>
          </Layout>
        </ScrollView>
      </>
    );
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

      {!loading && (
        <>
          <NoticationsCard />
        </>
      )}
      <Toast
        ref={toast} //eslint-disable-line
        position="bottom"
        defaultCloseDelay={8000}
        positionValue={200}
      />
    </Layout>
  );
};
export default NotificationScreen;

const styles = StyleSheet.create({
  container: {flex: 1},
  boxStyle: {
    marginHorizontal: themeConfig.margin,
  },
  leftSection: {
    width: 100,
    marginBottom: themeConfig.margin / 2,
  },
  rightSection: {
    flex: 1,
    marginBottom: themeConfig.margin / 2,
  },
  toggle: {
    padding: themeConfig.margin * 2,
  },
});
