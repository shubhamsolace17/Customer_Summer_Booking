import {useNavigation} from '@react-navigation/native';
import {Layout, Icon} from '@ui-kitten/components';
import ButtonComponent from 'components/Button';
import HeroImage from 'components/HeroImage';
import SVGIcon from 'components/Icon';
import Typography from 'components/Typography';
import themeConfig from 'configurations/Theme.configuration';
import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {strings} from 'i18n/i18n';
import moment from 'moment';

const PropertyCard = ({
  onPress = () => {},
  index = 0,
  item,
  showImage,
  showButton,
  showContact,
  plain,
  name,
  address,
  imageUrl,
  email,
  phoneNo,
  showDate,
  date,
}) => {
  const renderDate = date => {
    return (
      <Typography category="h6" style={styles.primaryText} status="basic">
        {date}
      </Typography>
    );
  };

  return (
    <>
      {plain && (
        <Typography
          category="h3"
          style={{
            fontWeight: '700',
            marginHorizontal: themeConfig.margin,
            marginTop: themeConfig.margin,
          }}>
          {name ? name : ''}
        </Typography>
      )}

      <Layout level="3" style={styles.itemContainer}>
        {showImage && (
          <View style={styles.imageContainer}>
            <HeroImage
              uri={
                imageUrl
                  ? imageUrl
                  : 'https://summerbooking.it/71bef9386ca4cf89011019d56070125c.jpg'
              }
              style={styles.imageStyle}
              height="100%"
            />
          </View>
        )}

        <View style={styles.detailsContainer}>
          {!plain && (
            <Typography category="h3" style={{fontWeight: '700'}}>
              {name ? name : ''}
            </Typography>
          )}

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <SVGIcon type="Location" width={15} height={15} />
            <Typography
              category="p2"
              style={{
                marginLeft: themeConfig.margin,
                fontWeight: '400',
                color: '#5E5E5E',
              }}
              status="basic">
              {address ? address : ''}
            </Typography>
          </View>

          {showContact && (
            <>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon
                  style={{width: 15, height: 15}}
                  fill={themeConfig.colors.primary}
                  name={'phone-call-outline'}
                />
                <Typography
                  category="s2"
                  style={{
                    marginLeft: themeConfig.margin,
                    fontWeight: '400',
                    color: '#5E5E5E',
                  }}
                  status="basic">
                  {phoneNo ? phoneNo : ''}
                </Typography>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon
                  style={{width: 15, height: 15}}
                  fill={themeConfig.colors.primary}
                  name={'email-outline'}
                />
                <Typography
                  category="s1"
                  style={{
                    marginLeft: themeConfig.margin,
                    fontWeight: '400',
                    color: '#5E5E5E',
                    fontSize: 12,
                  }}
                  status="basic">
                  {email ? email : ''}
                </Typography>
              </View>
            </>
          )}
          {showButton && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
              }}>
              {/* <ButtonComponent
                style={{
                  marginRight: themeConfig.margin,
                  borderRadius: themeConfig.radius * 3,
                }}
                size="tiny">
                {strings('details')}
              </ButtonComponent> */}
            </View>
          )}

          {showDate && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
              }}>
              <SVGIcon type="Calender" width={15} height={15} />
              <Typography
                category="p2"
                style={{
                  marginLeft: themeConfig.margin,
                  fontWeight: '400',
                  color: '#5E5E5E',
                }}
                status="basic">
                {strings('from')}{' '}
                {renderDate(moment(date.startDate).format('DD/MM/YYYY'))}{' '}
                {strings('to')}{' '}
                {renderDate(moment(date.endDate).format('DD/MM/YYYY'))}
              </Typography>
            </View>
          )}
        </View>
      </Layout>
    </>
  );
};

export default PropertyCard;

const styles = StyleSheet.create({
  container: {flex: 1},
  boxStyle: {
    marginHorizontal: themeConfig.margin,
  },
  detailsContainer: {
    flex: 1,
    marginLeft: themeConfig.margin * 2,
    paddingVertical: themeConfig.padding / 2,
  },
  imageContainer: {
    width: 120,
    height: '100%',
    minHeight: 110,
    padding: 5,
    marginRight: themeConfig.margin / 2,
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
    marginBottom: themeConfig.margin,
    position: 'relative',
    flex: 1,
    backgroundColor: '#D8E2FF',
    padding: themeConfig.padding * 2,
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
  primaryText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#5E5E5E',
  },
});
