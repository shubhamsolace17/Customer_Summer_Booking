import React from 'react';
import {Layout} from '@ui-kitten/components';
import {StyleSheet, View} from 'react-native';
import HeaderComponent from 'components/Header';
import themeConfig from 'configurations/Theme.configuration';
import Typography from 'components/Typography';
import HeroImage from 'components/HeroImage';
import {ScrollView} from 'react-native-gesture-handler';
import SecondaryHeader from 'components/SecondaryHeader';
import ProperyCard from './PropertyCard.component';
import {strings} from 'i18n/i18n';
import {useSelector} from 'react-redux';

const PropertyFacilitiesScreen = ({navigation, route}) => {
  const {data} = route.params || {};
  const serviceData = data.services;
  const [language] = useSelector(state => [state.globalReducerData.language]);
  return (
    <Layout style={{flex: 1}} level="1">
      <HeaderComponent showBackButton />
      <SecondaryHeader title={strings('services')} />
      <ScrollView bounces={false}>
        <Layout level="1" style={[styles.container, styles.boxStyle]}>
          <ProperyCard name={data.bathouseName} address={data.address} />
          {serviceData && serviceData.length > 0 ? (
            serviceData
              .filter(data => data.isChecked)
              .map((item, i) => {
                return (
                  <View
                    style={{
                      flexDirection: 'row',
                      padding: themeConfig.padding,
                      alignItems: 'center',
                    }}
                    key={i}>
                    {/* <View style={styles.dot} /> */}
                    <HeroImage
                      uri={item.serviceIcon ? item.serviceIcon : ''}
                      style={styles.imageStyle}
                    />
                    <Typography
                      category="p2"
                      style={{
                        color: '#373E46',
                        fontWeight: '400',
                        fontSize: 14,
                      }}
                      status="basic">
                      {language == 'it'
                        ? item.serviceItalian
                        : item.serviceName}
                    </Typography>
                  </View>
                );
              })
          ) : (
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
          )}
        </Layout>
      </ScrollView>
    </Layout>
  );
};
export default PropertyFacilitiesScreen;

const styles = StyleSheet.create({
  container: {flex: 1},
  boxStyle: {
    marginHorizontal: themeConfig.margin,
  },
  dot: {
    width: themeConfig.radius,
    height: themeConfig.radius,
    borderRadius: themeConfig.radius,
    backgroundColor: '#4E4E4E',
    marginRight: themeConfig.margin + 4,
  },
  imageStyle: {
    width: 34,
    height: 34,
    marginRight: themeConfig.margin + 4,
    // height: themeConfig.radius + 4,
  },
});
