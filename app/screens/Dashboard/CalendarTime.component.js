import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import Typography from 'components/Typography';
import {strings} from 'i18n/i18n';
import {Button} from '@ui-kitten/components';
import {Icon, Calendar, NativeDateService} from '@ui-kitten/components';
import ButtonComponent from 'components/Button';
import themeConfig from 'configurations/Theme.configuration';
import {_getDateGreaterToday} from 'resources/CommonFunction';
import GLOBAL from 'resources/constant';
import {_checkIsNumberFloat} from 'resources/ArithmaticService';

const i18n = {
  dayNames: {
    short: ['S', 'l', 'm', 'm', 'g', 'V', 'S'],
    long: [
      'Domenica',
      'Lunedi',
      'Martedì',
      'Mercoledì',
      'Giovedì',
      'Venerdì',
      'Sabato',
    ],
  },
  monthNames: {
    short: [
      'gen',
      'febbraio',
      'Marzo',
      'aprile',
      'Maggio',
      'Giugno',
      'Luglio',
      'agosto',
      'sett',
      'ottobre',
      'nov',
      'dic',
    ],
    long: [
      'Gennaio',
      'febbraio',
      'Marzo',
      'aprile',
      'Maggio',
      'Giugno',
      'Luglio',
      'agosto',
      'settembre',
      'ottobre',
      'novembre',
      'Dicembre',
    ],
  },
};

const localeDateService = new NativeDateService('it', {
  i18n,
  startDayOfWeek: 1,
});
const formatDateService = new NativeDateService('en', {format: 'DD/MM/YYYY'});

const CalendarTime = ({
  isopenHousrlyPopup,
  onClose,
  selectedHourlyService,
  wrapSelectedDatesFunc,
  hourServiceData,
  setHourlyService,
  language,
  addSurcharge,
}) => {
  const [selectedService, setSelectedService] = useState('');
  const [displayCalendar, setDisplayCalendar] = useState(false);
  const [selectedHoursdata, setSelectedHoursdata] = useState({});
  const [choosedHoursData, setChoosedHoursData] = useState({});
  const [chooseHoursError, setChooseHoursError] = useState('');
  const [displayChooseTime, setDisplayChooseTime] = useState(false);
  const [displayHourTime, setdisplayHourTime] = useState(true);
  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  });
  const [dateSelected, setDateSelected] = useState(new Date());

  const [isRanegSelected, setIsRanegSelected] = useState(false);
  const [checkDateFlag, setcheckDateFlag] = useState(null);
  const [chooseHours, SetChooseHours] = useState(GLOBAL.CHOOSEHOURS);
  const [choosedHour, setChoosedHour] = useState('');
  const handleChange = data => {
    setSelectedService(data.id);
    setDisplayCalendar(true);
    setSelectedHoursdata(data);
    setdisplayHourTime(false);
  };

  const goBackStep = async e => {
    if (displayCalendar) {
      setdisplayHourTime(true);
      setDisplayCalendar(true);
      setDisplayChooseTime(false);
    }
    if (displayChooseTime) {
      setdisplayHourTime(false);
      setDisplayCalendar(true);
      setDisplayChooseTime(false);
    }
  };
  const closeAlert = () => {
    onClose();
  };

  const closecalendar = e => {
    setdisplayHourTime(true);
    setDisplayChooseTime(false);
    setDisplayCalendar(false);
    setSelectionRange({
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    });
  };

  const closeTime = () => {
    setDisplayChooseTime(false);
    setDisplayCalendar(true);
    setdisplayHourTime(false);
    setChoosedHoursData({});
    setChooseHoursError('');
  };

  const handleSelect = async from => {
    let checkReturn = await _getDateGreaterToday(from);
    setSelectionRange({
      startDate: from,
    });
    setIsRanegSelected(true);
    setDisplayChooseTime(true);
    setDisplayCalendar(false);
    setdisplayHourTime(false);
    setDateSelected(from);
    setcheckDateFlag(checkReturn);
  };

  const timeslots =
    selectedHourlyService &&
    selectedHourlyService.timeslot_constants.filter(item => item.price);
  if (
    selectedHourlyService &&
    selectedHourlyService.manual_timeslot &&
    selectedHourlyService.manual_timeslot.status &&
    selectedHourlyService.manual_timeslot.status.price != ''
  ) {
    timeslots.push(selectedHourlyService.manual_timeslot);
  }
  let tempday = selectedHourlyService && selectedHourlyService.day_constant;
  let filteredData = tempday && tempday.filter(item => !item.status);
  let tempConst = [];
  filteredData &&
    filteredData &&
    filteredData.length > 0 &&
    filteredData.forEach(item =>
      item.name == 'Sun'
        ? (item.day = 0)
        : item.name == 'Mon'
        ? (item.day = 1)
        : item.name == 'Tue'
        ? (item.day = 2)
        : item.name == 'Wed'
        ? (item.day = 3)
        : item.name == 'Thu'
        ? (item.day = 4)
        : item.name == 'Fri'
        ? (item.day = 5)
        : item.name == 'Sat'
        ? (item.day = 6)
        : '',
    );

  filteredData &&
    filteredData &&
    filteredData.length > 0 &&
    filteredData.forEach(item => tempConst.push(item.day));

  let temp_hours =
    selectedHourlyService &&
    chooseHours.filter(item => {
      return (
        parseInt(item.name) >= parseInt(selectedHourlyService.HourFrom) &&
        parseInt(item.name) < parseInt(selectedHourlyService.HourTo)
      );
    });

  const checkValue = day => {
    if (tempConst.includes(day)) {
      return day;
    }
  };

  const handleClick = async data => {
    const range = await calculatedtime(data.name);
    const selected = data.name + ' - ' + range;
    data.selectedPeriod = selected;
    setChoosedHour(data.id);
    setChoosedHoursData(data);
    postBookingsData(data);
  };

  const _calcPrice = price => {
    console.log('original price is', price);
    if (addSurcharge !== null && addSurcharge > 0) {
      console.log('innnnnnnnnnnn');
      let newSurcharge = _checkIsNumberFloat(addSurcharge);
      newSurcharge =
        parseFloat(price) + parseFloat(price) * (newSurcharge / 100);
      console.log('newSurcharge is nowww', newSurcharge);
      return _checkIsNumberFloat(newSurcharge);
    } else {
      console.log('outttttttttttt');
      return _checkIsNumberFloat(parseFloat(price));
    }
  };

  const postBookingsData = async hoursData => {
    let hourlyServices = hourServiceData ? hourServiceData : [];
    let data = {
      selectedHourlyService: selectedHourlyService,
      selectedHoursData: selectedHoursdata,
      choosedHoursData: hoursData,
      selectionRange: selectionRange,
    };
    let item = {
      PurchaseStatus: true,
      ServiceName: selectedHourlyService.ServiceName,
      ServicePrice: selectedHoursdata.price,
      Servicemage: selectedHourlyService.Servicemage,
      currentId: selectedHourlyService.currentId,
      count: data.selectedHoursData.name,
      bookingDate: selectionRange.startDate,
      bookUpto: selectedHourlyService.HourFrom + '-' + hoursData.name,
      isBooked: true,
      time: hoursData,
    };

    var temp = {
      name: item.ServiceName,
      count: item.count,
      price: _calcPrice(parseFloat(item.ServicePrice)),
      bookingDate: item.bookingDate,
      time: item.time,
    };

    console.log('temp', temp);

    const id = hourlyServices.findIndex(
      itm => itm.ServiceName === selectedHourlyService.ServiceName,
    );
    if (id !== -1) {
      // hourlyServices[id].selectedData = [
      //   ...hourlyServices[id].selectedData,
      //   temp,
      // ];
      // hourlyServices[id].totalPrice =
      //   parseFloat(hourlyServices[id].totalPrice) +
      //   parseFloat(item.ServicePrice);
      hourlyServices[id].selectedData = [
        ...hourlyServices[id].selectedData,
        temp,
      ];
      hourlyServices[id].totalPrice =
        parseFloat(hourlyServices[id].totalPrice) +
        parseFloat(item.ServicePrice);
      hourlyServices[id].priceSurcharge = _calcPrice(
        parseFloat(hourlyServices[id].totalPrice),
      );
    }
    console.log('hourlyServices', hourlyServices);
    setHourlyService(hourlyServices);
    // wrapSelectedDatesFunc();
    onClose();
  };

  const filter = date => {
    return date.getDay() !== checkValue(date.getDay());
  };
  const renderValue = (item, index) => {
    return (
      <React.Fragment>
        <ButtonComponent
          size="small"
          appearance="outline"
          style={{
            marginRight: themeConfig.margin,
            backgroundColor:
              selectedService == item.id
                ? themeConfig.colors.primary
                : themeConfig.colors.white,
            borderColor: themeConfig.colors.borderColor,
            width: '40%',
            // margin:2
          }}
          status={selectedService == item.id ? 'control' : 'primary'}
          onPress={() => handleChange(item)}>
          <Typography
            status={selectedService == item.id ? 'control' : 'basic'}
            category="s1"
            style={{fontSize: 12}}>
            {item.name}
          </Typography>
        </ButtonComponent>
      </React.Fragment>
    );
  };
  const calculatedtime = ctime => {
    if (selectedHoursdata && selectedHoursdata.name) {
      var minsToAdd =
        selectedHoursdata &&
        selectedHoursdata.name.toString().search('hr') === -1
          ? parseInt(selectedHoursdata.name)
          : parseInt(selectedHoursdata.name) * 60;
      var time = ctime;
      var newTime = new Date(
        new Date('1970/01/01 ' + time).getTime() + minsToAdd * 60000,
      ).toLocaleTimeString('en-UK', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      return newTime;
    } else {
      return null;
    }
  };

  const renderHoursValue = (item, index) => {
    return (
      <React.Fragment>
        <Button
          size="tiny"
          appearance="outline"
          style={{
            marginRight: themeConfig.margin,
            backgroundColor:
              item.id === choosedHour
                ? themeConfig.colors.primary
                : themeConfig.colors.white,
            borderColor: themeConfig.colors.borderColor,
            marginBottom: 8,
            width: '40%',
            top: 10,
            margin: 10,
          }}
          status={item.id === choosedHour ? 'control' : 'primary'}
          onPress={() => handleClick(item)}>
          <Typography
            status={item.id === choosedHour ? 'control' : 'basic'}
            category="s1"
            style={{fontSize: 5}}>
            {`${item.name} - ${calculatedtime(item.name)}`}
          </Typography>
        </Button>
      </React.Fragment>
    );
  };

  return (
    <>
      {isopenHousrlyPopup && (
        <>
          {/* <View style={styles.titleContainer}>
            <Typography
              category="h5"
              style={{fontWeight: '400'}}
              status="basic">
              {strings('select')}
            </Typography>
          </View> */}
          <View style={styles.titleContainer}>
            {displayChooseTime && (
              <TouchableOpacity
                style={{marginRight: 'auto'}}
                onPress={() => {
                  goBackStep();
                }}>
                <Icon
                  style={styles.icon}
                  fill="#9d9d9d"
                  name="arrow-back-outline"
                />
              </TouchableOpacity>
            )}

            {displayHourTime && (
              <TouchableOpacity
                style={{marginLeft: 'auto'}}
                onPress={() => {
                  closeAlert();
                }}>
                <Icon style={styles.icon} fill="#9d9d9d" name="close-outline" />
              </TouchableOpacity>
            )}
          </View>
          {displayHourTime && (
            <Typography category="h3" style={{fontSize: 14}} status="basic">
              {strings('how_long_to_book')}
            </Typography>
          )}

          <View style={styles.btnmainview}>
            {displayHourTime &&
              selectedHourlyService &&
              selectedHourlyService.timeslot_constants && (
                <FlatList
                  key={timeslots.length}
                  bounces={false}
                  data={timeslots}
                  keyExtractor={item => item.id}
                  renderItem={({item, index}) => renderValue(item, index)}
                  extraData={timeslots}
                  numColumns={2}
                  removeClippedSubviews
                />
              )}
          </View>
          {displayCalendar && (
            <View>
              <TouchableOpacity
                style={{marginLeft: 'auto'}}
                onPress={() => {
                  closecalendar();
                }}>
                <Icon style={styles.icon} fill="#9d9d9d" name="close-outline" />
              </TouchableOpacity>
              <Calendar
                filter={filter}
                style={{
                  maxWidth: '100%',
                }}
                dateService={
                  language === 'it' ? localeDateService : formatDateService
                }
                min={new Date()}
                onSelect={nextDate => handleSelect(nextDate)}
              />
            </View>
          )}

          {displayChooseTime && (
            <View>
              <FlatList
                key={temp_hours.length}
                data={temp_hours}
                keyExtractor={item => item.id}
                renderItem={({item, index}) => renderHoursValue(item, index)}
                numColumns={2}
                scrollEnabled={true}
              />
            </View>
          )}
        </>
      )}
    </>
  );
};

export default CalendarTime;

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    padding: 8 * 2,
    width: '100%',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderRadius: 2,
    minWidth: '80%',
    padding: 8 * 2,
  },
  icon: {
    width: 30,
    height: 30,
    marginLeft: 'auto',
  },
  btnmainview: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  button: {
    margin: 2,
    marginHorizontal: 3,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 5,
    alignSelf: 'center',
    padding: 8 * 2,
  },
});
