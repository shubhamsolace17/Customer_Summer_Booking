import {useNavigation} from '@react-navigation/native';
import {Layout, Button} from '@ui-kitten/components';
import ButtonComponent from 'components/Button';
import HeroImage from 'components/HeroImage';
import SVGIcon from 'components/Icon';
import Typography from 'components/Typography';
import themeConfig from 'configurations/Theme.configuration';
import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {strings} from 'i18n/i18n';
import moment, {utc} from 'moment';
import {_formatDate} from 'resources/CommonFunction';

const ReservationListItem = ({
  onPress = () => {},
  index = 0,
  item,
  plain,
  favoriteScreen,
  showfavorite,
  booking,
  reservations,
  bookFor,
}) => {
  const navigation = useNavigation();
  return (
    <>
      <Typography
        category="h3"
        style={{
          fontWeight: '700',
          fontSize: 15,
          margin: themeConfig.margin,
          padding: 5,
        }}>
        {plain && booking ? (
          <>{item.propertyName ? item.propertyName : ''}</>
        ) : (
          <>{item.name ? item.name : item.bathouseName}</>
        )}
      </Typography>
      <Layout level="3" style={styles.mainContainer}>
        <Layout level="3" style={styles.itemContainer}>
          <View style={styles.imageContainer}>
            <HeroImage
              uri={
                item.mainPhoto
                  ? item.mainPhoto
                  : 'https://summerbooking.it/71bef9386ca4cf89011019d56070125c.jpg'
              }
              style={styles.imageStyle}
              height={80}
            />
          </View>
          <View style={styles.detailsContainer}>
            {item.reservations || favoriteScreen ? (
              <Typography
                category="s2"
                status="basic"
                style={{fontWeight: '400'}}>
                {favoriteScreen ? '' : item.reservations}
              </Typography>
            ) : (
              <>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  {plain && booking ? (
                    <>
                      {item &&
                      item.bathHouseData &&
                      item.bathHouseData.address ? (
                        <SVGIcon type="Location" width={15} height={15} />
                      ) : (
                        ''
                      )}
                      <Typography
                        category="s1"
                        style={{
                          marginLeft: themeConfig.margin / 2,
                          fontWeight: '400',
                          color: '#5E5E5E',
                          fontSize: 13,
                        }}
                        status="basic">
                        {item &&
                        item.bathHouseData &&
                        item.bathHouseData.address
                          ? item.bathHouseData.address
                          : ''}
                      </Typography>
                    </>
                  ) : (
                    <>
                      {item && item.address ? (
                        <SVGIcon type="Location" width={15} height={15} />
                      ) : null}
                      <Typography
                        category="s1"
                        style={{
                          marginLeft: themeConfig.margin / 2,
                          fontWeight: '400',
                          color: '#5E5E5E',
                          fontSize: 13,
                        }}
                        status="basic">
                        {reservations ? (
                          <>{item.address}</>
                        ) : (
                          <>{item.city + ' ' + item.address}</>
                        )}
                      </Typography>
                    </>
                  )}
                </View>
                {reservations && (
                  <>
                    {bookFor === 'location' && (
                      <>
                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          <SVGIcon type="Calender" width={15} height={15} />
                          <Typography
                            category="h6"
                            style={{
                              marginLeft: themeConfig.margin / 2,
                              fontSize: 9,
                            }}
                            status="basic">
                            {strings('from')} {`${_formatDate(item.startDate)}`}{' '}
                            - {strings('to')} {_formatDate(item.endDate)}
                          </Typography>
                        </View>
                        {/* <Typography
                          category="s1"
                          style={{
                            marginLeft: themeConfig.margin * 2,
                            fontSize: 12,
                          }}
                          status="basic">
                          {strings('to')}{' '}
                          {moment(item.endDate).format('DD/MM/YYYY')}
                        </Typography> */}

                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          {bookFor === 'location' && (
                            <Typography
                              category="s1"
                              style={{
                                marginLeft: themeConfig.margin / 2,
                                fontSize: 12,
                              }}
                              status="basic">
                              {strings('total')} :{' '}
                              {item.booking_payments &&
                                item.booking_payments.payableAmount}
                            </Typography>
                          )}
                        </View>
                      </>
                    )}

                    {bookFor === 'service' && (
                      <>
                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          <Typography
                            category="s1"
                            style={{
                              marginLeft: themeConfig.margin / 2,
                              fontSize: 12,
                            }}
                            status="basic">
                            {strings('date')} :
                            {item && item.startDate && (
                              <>{_formatDate(item.startDate)}</>
                            )}
                          </Typography>
                        </View>

                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          {bookFor === 'service' && (
                            <Typography
                              category="s1"
                              style={{
                                marginLeft: themeConfig.margin / 2,
                                fontSize: 12,
                              }}
                              status="basic">
                              {strings('amount')} :{' '}
                              {item.payments && item.payments.payableAmount}
                            </Typography>
                          )}
                        </View>
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </View>
        </Layout>
        <Layout level="3">
          {reservations && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                backgroundColor: themeConfig.colors.lightBule,
              }}>
              <ButtonComponent
                onPress={() =>
                  navigation.navigate('BookingAccountScreen', {
                    id: item.id,
                    fromPage: bookFor,
                    bathHouseId: item.bathHouseId,
                    reservations: true,
                  })
                }
                appearance="outline"
                style={{
                  marginRight: themeConfig.margin,
                  width: 120,
                  borderRadius: themeConfig.radius * 4,
                  backgroundColor: 'transparent',
                }}
                size="tiny">
                <Typography status="basic" category="c1">
                  {strings('booking_account')}
                </Typography>
              </ButtonComponent>

              {item.sharing_enable === 1 && (
                <ButtonComponent
                  onPress={() =>
                    navigation.navigate('SharingScreen', {
                      data: item,
                    })
                  }
                  appearance="outline"
                  style={{
                    width: 70,
                    borderRadius: themeConfig.radius * 4,
                    backgroundColor: 'transparent',
                  }}
                  size="tiny">
                  <Typography
                    status="basic"
                    style={{fontSize: 12}}
                    category="c1">
                    {strings('sharing')}
                  </Typography>
                </ButtonComponent>
              )}

              <ButtonComponent
                onPress={() =>
                  navigation.navigate('ReservationSummary', {
                    id: item.id,
                    fromPage: bookFor,
                    bathHouseId: item.bathHouseId,
                    reservations: true,
                    data: item,
                  })
                }
                style={{
                  width: 70,
                  borderRadius: themeConfig.radius * 4,
                }}
                size="tiny">
                <Typography status="basic" style={{fontSize: 12}} category="c1">
                  {strings('details')}
                </Typography>
              </ButtonComponent>
            </View>
          )}
        </Layout>
      </Layout>
    </>
  );
};

export default ReservationListItem;

const styles = StyleSheet.create({
  container: {flex: 1},
  boxStyle: {
    marginHorizontal: themeConfig.margin,
  },
  detailsContainer: {
    flex: 1,
    marginLeft: themeConfig.margin,
    paddingVertical: themeConfig.padding / 2,
    //marginLeft: themeConfig.margin * 4,
  },
  navigationButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: themeConfig.radius * 4,
    borderWidth: themeConfig.borderWidth,
    borderColor: themeConfig.colors.borderColor,
    padding: themeConfig.padding * 2,
    marginBottom: themeConfig.margin,
  },
  button: {
    backgroundColor: 'transparent',
    borderRadius: themeConfig.radius * 2,
    height: 40,
    width: 90,
  },
  imageContainer: {
    width: 120,
    height: 90,
    // minHeight: 120,
    padding: 10,
    overflow: 'hidden',
  },
  imageStyle: {
    width: '100%',
    borderRadius: 10,
    resizeMode: 'stretch',
  },
  mainContainer: {
    borderRadius: themeConfig.radius * 4,
    overflow: 'hidden',
    marginBottom: themeConfig.margin * 2,
    position: 'relative',
    flex: 1,
    backgroundColor: '#D8E2FF',
    padding: themeConfig.padding,
    margin: themeConfig.margin,
  },
  itemContainer: {
    borderRadius: themeConfig.radius * 3,
    overflow: 'hidden',
    flexDirection: 'row',
    marginBottom: themeConfig.margin * 2,
    position: 'relative',
    flex: 1,
    backgroundColor: '#D8E2FF',
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
