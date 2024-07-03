import {useNavigation} from '@react-navigation/native';
import {Layout} from '@ui-kitten/components';
import ButtonComponent from 'components/Button';
import HeroImage from 'components/HeroImage';
import SVGIcon from 'components/Icon';
import Typography from 'components/Typography';
import themeConfig from 'configurations/Theme.configuration';
import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {strings} from 'i18n/i18n';
import moment from 'moment';
import {SafeAreaView} from 'react-native-safe-area-context';

const SearchListItem = ({
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
  console.log('showfavorite', showfavorite, favoriteScreen, plain);
  return (
    <SafeAreaView style={{flex: 1}}>
      <Layout level="3" style={styles.itemContainer}>
        {plain && !favoriteScreen ? null : (
          <>
            {showfavorite && (
              <TouchableOpacity
                onPress={() => onPress(index)}
                style={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  zIndex: 1,
                }}>
                <SVGIcon
                  type={item.favorite ? 'HeartFill' : 'Heart'}
                  color={themeConfig.colors.primary}
                  width={20}
                  height={20}
                />
              </TouchableOpacity>
            )}
          </>
        )}
        <View style={styles.imageContainer}>
          <HeroImage
            uri={
              item.mainPhoto
                ? item.mainPhoto
                : 'https://summerbooking.it/71bef9386ca4cf89011019d56070125c.jpg'
            }
            style={styles.imageStyle}
            height="100%"
          />
        </View>
        <View style={styles.detailsContainer}>
          {plain && booking ? (
            <Typography category="s2" style={{fontWeight: '500'}}>
              {item.propertyName ? item.propertyName : ''}
            </Typography>
          ) : (
            <Typography category="h3" style={{fontWeight: '700'}}>
              {item.name ? item.name : item.bathouseName}
            </Typography>
          )}
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
                      category="s2"
                      style={{
                        marginLeft: themeConfig.margin / 2,
                        fontWeight: '400',
                        color: '#5E5E5E',
                      }}
                      status="basic">
                      {item && item.bathHouseData && item.bathHouseData.address
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

              {plain ? null : (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                  }}>
                  {/* {item.directBookNow ? ( */}
                  <ButtonComponent
                    onPress={() =>
                      navigation.navigate('SearchSingleLocationScreen', {
                        slug: item.slug,
                        favorite: item.favorite,
                        showButton: true,
                      })
                    }
                    style={{
                      marginRight: themeConfig.margin,
                      borderRadius: themeConfig.radius * 3,
                    }}
                    size="tiny">
                    <Typography status="basic" category="s2">
                      {strings('findOut_More')}
                    </Typography>
                  </ButtonComponent>
                  {item.directBookNow ? (
                    <ButtonComponent
                      onPress={() =>
                        navigation.navigate('SearchSingleLocationScreen', {
                          slug: item.slug,
                          favorite: item.favorite,
                          showButton: true,
                        })
                      }
                      style={{
                        marginRight: themeConfig.margin,
                        width: 90,
                        borderRadius: themeConfig.borderWidth * 4,
                      }}
                      size="tiny">
                      Book Now
                    </ButtonComponent>
                  ) : null}
                </View>
              )}

              {reservations && (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    backgroundColor: 'red',
                  }}>
                  <ButtonComponent
                    size="tiny"
                    style={{
                      marginRight: themeConfig.margin,
                      width: 90,
                    }}
                    onPress={() =>
                      navigation.navigate('SearchSingleLocationScreen', {
                        id: item.id,
                        fromPage: bookFor,
                        bathHouseId: item.bathHouseId,
                        reservations: true,
                      })
                    }>
                    {strings('view_booking')}
                  </ButtonComponent>
                  <ButtonComponent
                    size="tiny"
                    style={{
                      marginRight: themeConfig.margin,
                      width: 90,
                    }}
                    onPress={() =>
                      navigation.navigate('SearchSingleLocationScreen', {
                        id: item.id,
                        fromPage: bookFor,
                        bathHouseId: item.bathHouseId,
                        reservations: true,
                      })
                    }>
                    {strings('view_booking')}
                  </ButtonComponent>
                  <ButtonComponent
                    size="tiny"
                    style={{
                      marginRight: themeConfig.margin,
                      width: 90,
                    }}
                    onPress={() =>
                      navigation.navigate('SearchSingleLocationScreen', {
                        id: item.id,
                        fromPage: bookFor,
                        bathHouseId: item.bathHouseId,
                        reservations: true,
                      })
                    }>
                    {strings('view_booking')}
                  </ButtonComponent>
                </View>
              )}
            </>
          )}
        </View>
      </Layout>
    </SafeAreaView>
  );
};

export default SearchListItem;

const styles = StyleSheet.create({
  container: {flex: 1},
  boxStyle: {
    marginHorizontal: themeConfig.margin,
  },
  detailsContainer: {
    flex: 1,
    marginLeft: themeConfig.margin,
    paddingVertical: themeConfig.padding / 2,
    marginLeft: themeConfig.margin * 4,
  },
  imageContainer: {
    width: 120,
    height: '100%',
    minHeight: 120,
    padding: 10,
  },
  imageStyle: {
    borderRadius: themeConfig.radius * 2,
    width: 120,
    height: 100,
    borderRadius: 10,
  },
  itemContainer: {
    borderRadius: themeConfig.radius * 3,
    overflow: 'hidden',
    flexDirection: 'row',
    bottom: themeConfig.margin * 2,
    position: 'relative',
    flex: 1,
    backgroundColor: '#D8E2FF',
    padding: themeConfig.padding,
    margin: themeConfig.margin,
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
