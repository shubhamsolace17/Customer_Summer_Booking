import React, {useState, useRef, useEffect} from 'react';
import {Layout, Icon, Modal} from '@ui-kitten/components';
import {StyleSheet, View, TouchableOpacity, Alert, Image} from 'react-native';
import HeaderComponent from 'components/Header';
import themeConfig from 'configurations/Theme.configuration';
import Typography from 'components/Typography';
import {ScrollView} from 'react-native-gesture-handler';
import SecondaryHeader from 'components/SecondaryHeader';
import * as Yup from 'yup';
import ButtonComponent from 'components/Button';
//API
import Api from 'services/Api';
import {postDataToServer} from 'services/AuthApi';
//Translation
import {strings} from 'i18n/i18n';
import Toast from 'react-native-easy-toast';
import {useSelector} from 'react-redux';
import moment, {utc} from 'moment';
import CustomCalendar from 'components/CustomCalendar';
import {_formatDate} from 'resources/CommonFunction';
import CustomSkeletonList from 'components/CustomSkeleton';

const SharingScreen = ({navigation, route}) => {
  const [loading, setloading] = useState(false);
  const {data} = route.params || {};
  const bookingData = data;
  const startDate = _formatDate(
    new Date(moment(utc(bookingData.startDate)).format('YYYY-MM-DD')),
  );
  const endDate = _formatDate(
    new Date(moment(utc(bookingData.endDate)).startOf('YYYY-MM-DD')),
  );
  const [range, setRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [showCalendar, setShowCalendar] = useState(false);
  const [markedDates, setMarkerDate] = useState({});
  const [disabledDate, setDisabledDate] = useState([]);
  const [error, setError] = useState('');
  const [totalCreditsEarned, setotalCreditEarned] = useState('');
  const [selectedDate, SetSelectedDate] = useState([]);
  const [absenceDates, setAbsenceDates] = useState([]);
  const [totalCreditEarned, settotalCreditEarned] = useState(null);
  const [disableShareDates, setDisableShareDates] = useState([]);
  const [disableAbsenceDates, setDisableAbsenceDates] = useState([]);
  const [showAlldisableDates, setshowAlldisableDates] = useState([]);
  const [shareAllRes, setShareAllRes] = useState([]);
  const [takeOnlyIsBooked, setOnlyIsBooked] = useState([]);
  const [markedDatesSelect, setMarkedDatesSelect] = useState({});
  const [sharingArr, setSharingArray] = useState([]);

  const toast = useRef('');
  // const {language} = useApplicationContext();
  const [language, userProfile] = useSelector(state => [
    state.globalReducerData.language,
    state.UserReducerData.userProfile,
  ]);
  const renderDate = date => {
    return (
      <Typography
        category="h6"
        style={[styles.primaryText, {fontSize: 12}]}
        status="basic">
        {date}
      </Typography>
    );
  };
  const loadDisabledDate = async () => {
    setloading(true);
    const postData = {
      booking_id: bookingData.id,
    };
    const {data, error, message, status} = await postDataToServer(
      `${Api.getSharingDates}`,
      postData,
    );
    console.log('data', data);
    setSharingArray(data?.sharing_dates);
    if (status) {
      if (data?.sharing_dates.length > 0) {
        const disableArray = [];
        data?.sharing_dates.forEach(day => {
          var date = moment(day.sharing_date, 'DD-MM-YYYY');
          let convertedDate = moment(date).format('YYYY-MM-DD');
          var isBooked = day.isBooked;
          disableArray.push({shareDate: convertedDate, isBooked: isBooked});
          console.log('disableArray', disableArray);
          SetSelectedDate(disableArray);
        });
        let mark = {};
        disableArray.forEach(day => {
          mark = day;
          mark = {
            disabled: true,
            // disableTouchEvent: true,
            customStyles: {
              container: {
                backgroundColor: mark.isBooked == '1' ? 'red' : 'blue', //
              },
              text: {
                color: 'white',
                fontWeight: 'bold',
              },
            },
          };
        });
        console.log('aftermark', mark);
        // let startDate = moment(bookingData.startDate).format('YYYY-MM-DD');
        // let endDate = moment(bookingData.endDate).format('YYYY-MM-DD');
        let date = [];
        for (var m = moment(startDate); m.isBefore(endDate); m.add(1, 'days')) {
          date.push(m.format('YYYY-MM-DD'));
        }
        date.forEach(day => {
          mark[day] = {
            customStyles: {
              container: {
                backgroundColor: themeConfig.colors.lightBule,
              },
              text: {
                color: 'black',
                fontWeight: 'bold',
              },
            },
          };
        });
        setMarkerDate(mark);
        setloading(false);
      } else {
        setloading(false);
        toast.current.show(message);
      }
    } else {
      setloading(false);
      if (error) {
        let errorMessage = error ? error : message;
        toast.current.show(errorMessage);
      }
    }
  };

  useEffect(() => {
    navigation.setParams({refresh: true});
    const unsubscribe = navigation.addListener('focus', async () => {
      SetSelectedDate([]);
      loadDisabledDate();
      loadCreditsEarnedBookingId();
      loadAbsenceDates();
    });
    return () => {
      unsubscribe;
    };
  }, [navigation]);

  const collectDates = (absence, sharing) => {
    const showdisableDates = [...sharing, ...absence];
    setshowAlldisableDates(showdisableDates);
  };
  const loadAbsenceDates = async () => {
    setloading(true);
    const postData = {
      booking_id: bookingData.id,
    };
    const {data, error, message, success} = await postDataToServer(
      `${Api.getAbsenceDates}`,
      postData,
    );
    console.log('absence res', data);

    if (success) {
      if (data.status) {
        let tempArr = data?.absence_dates;
        const result = tempArr.map(date => +date.split('-')[0]);
        collectDates(result, disableShareDates);
        setDisableAbsenceDates(result);
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

  const loadCreditsEarnedBookingId = async () => {
    setloading(true);
    const postData = {
      booking_id: bookingData.id,
    };
    const {data, error, message, success} = await postDataToServer(
      `${Api.getCreditsEarnedByBookingId}`,
      postData,
    );
    if (success) {
      setotalCreditEarned(data.total_credit_earned);
      setloading(false);
    } else {
      setloading(false);
      if (error) {
        let errorMessage = error ? error : message;
        toast.current.show(errorMessage);
      }
    }
  };

  const onDaySelect = item => {
    let dateArray = [];
    let sharingArray = [];
    sharingArray = sharingArr;

    console.log('sharingArray111', sharingArray);

    if (
      selectedDate &&
      selectedDate.length > 0 &&
      selectedDate.includes(item.dateString)
    ) {
      setShowCalendar(false);
    } else {
      markedDatesSelect[item.dateString] = {
        selected: true,
        color: themeConfig.colors.primary,
        textColor: '#FFFFFF',
      };
      let serviceDate = moment(item.dateString);
      serviceDate = serviceDate.format('YYYY-MM-DD');
      dateArray.push(serviceDate);
      SetSelectedDate([...selectedDate, ...dateArray]);
      var json = markedDatesSelect;
      setMarkedDatesSelect(json);
      setMarkerDate(markedDatesSelect);
      setShowCalendar(false);
      let sharingDate = moment(item.dateString);

      sharingDate = sharingDate.format('DD-MM-YYYY');
      console.log('sharingDate', sharingDate);

      var sharingJson = {
        booked_by: null,
        isApplied: 0,
        isBooked: 0,
        sharing_date: sharingDate,
      };
      console.log('sharingJson', sharingJson);
      sharingArray.push(sharingJson);
      console.log('sharingArray', sharingArray);
      setSharingArray(sharingArray);
    }
  };

  const onDayUnSelect = item => {
    console.log('item', item);
    let sharingDate = moment(item);
    h;
    sharingDate = sharingDate.format('DD-MM-YYYY');
    console.log('removesharingDate', sharingDate);

    setSharingArray(canceldate =>
      canceldate.filter(dates => {
        // 👇️ remove object that has id equal to 2
        return dates.sharing_date !== sharingDate;
      }),
    );

    let markedDatesUnselect = [];
    markedDatesUnselect[item] = {
      selected: false,
      color: themeConfig.colors.black,
      textColor: themeConfig.colors.black,
    };

    setMarkerDate(markedDatesUnselect);
  };

  const navigateMyBooking = () => {
    navigation.navigate('ReservationScreen');
  };

  const createSharing = async () => {
    // navigateMyBooking()
    console.log('sharingDate Arr', sharingArr);

    setloading(true);
    const postData = {
      booking_id: bookingData.id,
      sharing_date: sharingArr,
      credit_value: bookingData.credit_value,
      number_of_credit: userProfile.totalCreditsEarned,
    };
    console.log('postdata', postData);
    const {data, error, message, status} = await postDataToServer(
      `${Api.createSharing}`,
      postData,
    );
    console.log('data', data);
    if (status) {
      SetSelectedDate([]);
      Alert.alert(
        strings('success'),
        strings('sharing_sucessfully_msg'),
        [
          {
            text: strings('ok'),
            onPress: () => navigateMyBooking(),
          },
        ],
        {
          cancelable: false,
        },
      );
    } else {
      setloading(false);
      if (error) {
        let errorMessage = error ? error : message;
        toast.current.show(errorMessage);
      }
    }
  };
  return (
    <Layout style={{flex: 1}} level="1">
      <HeaderComponent showBackButton />
      <SecondaryHeader title={strings('sharing')} />
      {loading ? (
        <>
          <CustomSkeletonList />
          <CustomSkeletonList />
        </>
      ) : (
        <>
          <ScrollView bounces={false}>
            <Layout
              level="1"
              style={[styles.container, {margin: themeConfig.margin}]}>
              <Layout>
                <View
                  style={{
                    alignItems: 'flex-end',
                    justifyContent: 'flex-end',
                    margin: themeConfig.margin,
                  }}>
                  <View style={styles.creditEarnContainer}>
                    <Typography
                      category="s2"
                      style={{
                        justifyContent: 'center',
                        alignContent: 'center',
                      }}>
                      {strings('Credit_earned')}:{' '}
                      {totalCreditsEarned ? totalCreditsEarned : 0}
                    </Typography>
                  </View>
                  <Typography
                    category="s2"
                    style={{
                      justifyContent: 'center',
                      alignContent: 'center',
                    }}>
                    1 {strings('Credit')} = {bookingData.credit_value} €
                  </Typography>
                </View>
              </Layout>
            </Layout>
            <Layout>
              <View style={[styles.boxStyle]}>
                <Typography
                  category="s1"
                  style={styles.blacktext}
                  status="basic">
                  {strings('your_reservation')}:
                </Typography>
                <Typography
                  category="s1"
                  style={[styles.titleText, {fontSize: 12}]}
                  status="basic">
                  {strings('from')} {renderDate(`${startDate}`)} {strings('to')}{' '}
                  {renderDate(`${endDate}`)}
                </Typography>
              </View>
            </Layout>

            <Layout
              style={[
                {
                  margin: themeConfig.margin * 2,
                  marginHorizontal: themeConfig.margin * 2,
                },
              ]}>
              <Typography
                category="h6"
                style={[styles.primaryText, {fontSize: 14}]}
                status="basic">
                {strings('select_date_on_Which')}
              </Typography>

              <Typography
                category="h6"
                style={[styles.primaryText, {fontSize: 14}]}
                status="basic">
                {strings('booked_free')} :
              </Typography>
            </Layout>
            <Layout>
              {/* <View style={[styles.boxStyle]}>
                <TouchableOpacity onPress={() => setShowCalendar(true)}>
                  <DateRangePickerComponent
                    leftIcon="calendar-outline"
                    placeholder={strings('SelectDate')}
                    date={'01/09/2021'}
                    defaultValue={'01/09/2021'}
                    placement="bottom"
                    range={range}
                    disabled
                    onSelect={nextRange => {
                      console.log("nextRange",nextRange)
                    }}
                  />
                </TouchableOpacity>
              </View> */}
            </Layout>

            {selectedDate &&
              selectedDate.length > 0 &&
              selectedDate.map((item, i) => {
                return (
                  <Layout
                    style={[
                      {
                        marginVertical: themeConfig.margin,
                        marginHorizontal: themeConfig.margin * 2,
                        flexDirection: 'row',
                      },
                    ]}
                    key={i}>
                    <Typography
                      category="h6"
                      style={[styles.primaryText, {fontSize: 14}]}
                      status="basic">
                      {item}
                    </Typography>
                    <TouchableOpacity
                      style={{
                        width: 30,
                        height: 30,
                      }}
                      onPress={() => {
                        selectedDate.splice(i, 1);
                        onDayUnSelect(item, i);
                      }}>
                      <Image
                        style={styles.cancelImg}
                        source={require('../../resources/images/cancel.png')}
                      />
                    </TouchableOpacity>
                  </Layout>
                );
              })}

            {selectedDate && selectedDate.length > 0 && (
              <Layout
                style={[
                  {
                    margin: themeConfig.margin * 2,
                    marginHorizontal: themeConfig.margin * 2,
                  },
                ]}>
                <ButtonComponent onPress={() => createSharing()}>
                  <Typography
                    status="control"
                    category="h6"
                    style={{fontWeight: '400'}}>
                    {strings('submit')}
                  </Typography>
                </ButtonComponent>
              </Layout>
            )}

            <TouchableOpacity onPress={() => setShowCalendar(!showCalendar)}>
              <Layout
                style={{
                  margin: themeConfig.margin * 2,
                  marginHorizontal: themeConfig.margin * 2,
                  flexDirection: 'row',
                }}>
                <View style={styles.iconButtonContainer}>
                  <Icon
                    style={styles.icon}
                    fill={themeConfig.colors.white}
                    name="plus-outline"
                  />
                </View>
                <Typography
                  category="s1"
                  style={[styles.primaryText, {fontSize: 15}]}
                  status="basic">
                  {strings('add_date')}
                </Typography>
              </Layout>
            </TouchableOpacity>
          </ScrollView>

          {showCalendar && (
            <Modal
              style={{
                backgroundColor: themeConfig.colors.white,
                width: '80%',
                height: '60%',
                justifyContent: 'center',
                flex: 1,
                alignItems: 'center',
                borderRadius: themeConfig.radius * 2,
              }}
              backdropStyle={styles.backdrop}
              visible={showCalendar}
              onBackdropPress={() => setShowCalendar(false)}>
              <CustomCalendar
                markingType={'custom'}
                minDate={moment(bookingData.startDate).format('YYYY-MM-DD')}
                maxDate={moment(bookingData.endDate).format('YYYY-MM-DD')}
                markDates={markedDates}
                onDayPress={day => onDaySelect(day)}
              />
            </Modal>
          )}
        </>
      )}

      <Toast
        ref={toast} //eslint-disable-line
        position="center"
        defaultCloseDelay={10000}
        positionValue={200}
      />
    </Layout>
  );
};
export default SharingScreen;

const styles = StyleSheet.create({
  container: {flex: 1},
  boxStyle: {
    marginHorizontal: themeConfig.margin * 2,
    backgroundColor: themeConfig.colors.lightBule,
    borderRadius: themeConfig.radius * 4,
    padding: themeConfig.padding * 3,
  },
  icon: {
    height: 20,
    width: 20,
    padding: 12,
  },
  navigationButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: themeConfig.radius,
    borderWidth: themeConfig.borderWidth,
    borderColor: themeConfig.colors.borderColor,
    padding: themeConfig.padding + 4,
    marginBottom: themeConfig.margin,
  },
  creditEarnContainer: {
    backgroundColor: themeConfig.colors.white,
    borderRadius: themeConfig.radius * 2,
    padding: themeConfig.padding,
    shadowColor: '#fff',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 9,
    elevation: 2,
  },
  titleText: {
    fontWeight: '600',
    marginTop: themeConfig.margin,
    color: '#5e5e5e',
  },
  blacktext: {
    fontSize: 13,
    fontWeight: '500',
    color: '#5e5e5e',
  },
  primaryText: {
    fontWeight: '700',
    color: themeConfig.colors.primary,
  },
  iconButtonContainer: {
    backgroundColor: themeConfig.colors.primary,
    borderWidth: themeConfig.borderWidth,
    borderRadius: themeConfig.radius * 5,
    borderColor: themeConfig.colors.primary,
    marginRight: themeConfig.margin,
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  cancelImg: {
    width: 20,
    height: 20,
    margin: 5,
  },
});
