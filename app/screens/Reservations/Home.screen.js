import React from 'react';
import {Layout, List} from '@ui-kitten/components';
import {StyleSheet, View, ScrollView, Dimensions} from 'react-native';
import HeaderComponent from 'components/Header';
import themeConfig from 'configurations/Theme.configuration';
import Typography from 'components/Typography';
import SecondaryHeader from 'components/SecondaryHeader';
import SVGIcon from 'components/Icon';
import {useFocusEffect} from '@react-navigation/native';
import ReservationListItem from './ReservationListItem.component';
import ButtonComponent from 'components/Button';
import {useSelector} from 'react-redux';
import {useState, useEffect, useRef} from 'react';
//API
import Api from 'services/Api';
import {postDataToServer} from 'services/AuthApi';
import Toast from 'react-native-easy-toast';
import Loader from 'components/Loader';
import {strings} from 'i18n/i18n';
import CustomSkeletonList from 'components/CustomSkeleton';
const windowHeight = Dimensions.get('window').height;
import AsyncStorage from '@react-native-async-storage/async-storage';

const ReservationsHomeScreen = ({navigation}) => {
  // const {isSignedIn} = useApplicationContext();
  const [isSignedIn, userProfile, language] = useSelector(state => [
    state.UserReducerData.isSignedIn,
    state.UserReducerData.userProfile,
    state.globalReducerData.language,
  ]);

  const [loading, setloading] = useState(false);
  const [bookingsList, setBookingsList] = useState([]);
  const [servicesList, setServicesList] = useState([]);

  const toast = useRef('');
  const loadData = async () => {
    setloading(true);
    const postData = {
      userid: userProfile.id,
    };
    const {data, error, message, status} = await postDataToServer(
      `${Api.myBooking}`,
      postData,
    );
    console.log('data', data);
    if (status) {
      if (data && data.booking && data.booking.length > 0) {
        setBookingsList(data.booking);
      }
      if (data && data.services && data.services.length > 0) {
        setServicesList(data.services);
      }
      setloading(false);
    } else {
      setloading(false);
      if (error) {
        let errorMessage = error ? error : message;
        toast.current.show(errorMessage);
      }
    }
  };

  useEffect(async () => {
    navigation.setParams({refresh: true});
    const unsubscribe = navigation.addListener('focus', async () => {
      const userProfileString = await AsyncStorage.getItem('userProfile');
      const userProfile = userProfileString
        ? JSON.parse(userProfileString)
        : {};
      if (Object.keys(userProfile).length > 0) {
        loadData();
      }
    });
    return () => {
      unsubscribe;
    };
  }, [navigation]);
  // useFocusEffect(
  //   React.useCallback(async() => {
  //     console.log('skjdksd', isSignedIn, userProfile);
  //     const userProfileString = await AsyncStorage.getItem('userProfile');
  //     const userProfile = userProfileString
  //     ? JSON.parse(userProfileString)
  //     : {};
  //     if(Object.keys(userProfile).length > 0) {
  //       loadData();
  //     }
  //   }, [])
  // );

  return (
    <Layout style={{flex: 1}}>
      <HeaderComponent showBackButton />
      {loading ? (
        <>
          <CustomSkeletonList />
          <CustomSkeletonList />
        </>
      ) : (
        <ScrollView
          bounces={false}
          contentContainerStyle={{paddingBottom: windowHeight / 8}}>
          <Layout level="1" style={styles.container}>
            <View style={[styles.boxStyle, {marginTop: themeConfig.margin}]}>
              <Typography
                category="s1"
                style={{
                  fontWeight: '700',
                  marginVertical: themeConfig.margin * 2,
                  marginBottom: themeConfig.margin,
                }}>
                {strings('my_reservation')}
              </Typography>
              {isSignedIn && (
                <ButtonComponent
                  onPress={() => navigation.navigate('AddReservationScreen')}>
                  <Typography
                    status="control"
                    category="h3"
                    style={{fontWeight: '400'}}>
                    {strings('add_reservation')}
                  </Typography>
                </ButtonComponent>
              )}
              {isSignedIn && bookingsList && bookingsList.length > 0 && (
                <List
                  contentContainerStyle={{
                    flexGrow: 1,
                    backgroundColor: themeConfig.colors.white,
                    marginVertical: themeConfig.margin,
                  }}
                  style={{
                    backgroundColor: themeConfig.colors.white,
                  }}
                  data={bookingsList}
                  renderItem={({item, index}) => {
                    return (
                      <ReservationListItem
                        key={index}
                        item={item}
                        index={index}
                        plain
                        reservations
                        bookFor="location"
                      />
                    );
                  }}
                  ListEmptyComponent={
                    <>
                      <View
                        style={{
                          alignSelf: 'center',
                          justifyContent: 'center',
                          flex: 1,
                        }}>
                        <Typography
                          status="basic"
                          category="s2"
                          style={{
                            marginLeft: themeConfig.margin / 2,
                            fontWeight: '400',
                          }}>
                          {strings('no_record')}
                        </Typography>
                      </View>
                    </>
                  }
                />
              )}

              {isSignedIn && servicesList && servicesList.length > 0 && (
                <List
                  contentContainerStyle={{
                    flexGrow: 1,
                    backgroundColor: themeConfig.colors.white,
                    marginVertical: themeConfig.margin,
                  }}
                  style={{
                    backgroundColor: themeConfig.colors.white,
                  }}
                  data={servicesList}
                  renderItem={({item, index}) => {
                    return (
                      <ReservationListItem
                        key={index}
                        item={item}
                        index={index}
                        plain
                        reservations
                        bookFor="service"
                      />
                    );
                  }}
                />
              )}
            </View>
          </Layout>
        </ScrollView>
      )}
      {isSignedIn ? null : (
        <Layout>
          <View style={styles.boxStyle}>
            <ButtonComponent
              onPress={() => navigation.navigate('UserHome', {screen: 'Login'})}
              style={{marginBottom: windowHeight / 6}}>
              <Typography
                status="control"
                category="s2"
                style={{fontWeight: '400'}}>
                {strings('sign_in')}
              </Typography>
            </ButtonComponent>
          </View>
        </Layout>
      )}

      {/* {Object.keys(userProfile).length === 0 ? (
        <Layout>
          <View style={styles.boxStyle}>
            <ButtonComponent
              onPress={() =>
                navigation.navigate('UserHome', {screen: 'Login'})
              }>
              <Typography
                status="control"
                category="h6"
                style={{fontWeight: '400'}}>
                {strings('sign_in')}
              </Typography>
            </ButtonComponent>
          </View>
        </Layout>
      )
      : null} */}
      <Toast
        ref={toast} //eslint-disable-line
        position="bottom"
        defaultCloseDelay={8000}
        positionValue={200}
      />
    </Layout>
  );
};
export default ReservationsHomeScreen;

const styles = StyleSheet.create({
  container: {flex: 1},
  boxStyle: {
    marginHorizontal: themeConfig.margin * 2,
  },
  detailsContainer: {
    flex: 1,
    marginLeft: themeConfig.margin,
    paddingVertical: themeConfig.padding / 2,
  },
  imageContainer: {
    width: 120,
    height: '100%',
  },
  imageStyle: {
    borderRadius: themeConfig.radius,
    width: 120,
  },
  itemContainer: {
    borderRadius: themeConfig.radius,
    overflow: 'hidden',
    flexDirection: 'row',
    marginBottom: themeConfig.margin * 2,
    position: 'relative',
    flex: 1,
  },
  filterSortContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleBorder: {
    width: 1,
    borderColor: themeConfig.colors.borderColor,
    borderWidth: 0.7,
    height: themeConfig.boxHeightUnit / 2,
  },
  filterSortChild: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: themeConfig.boxHeightUnit,
    flexDirection: 'row',
  },
});
