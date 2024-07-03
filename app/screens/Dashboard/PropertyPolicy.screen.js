import React, {useState, useEffect} from 'react';
import {Layout} from '@ui-kitten/components';
import {StyleSheet, View} from 'react-native';
import HeaderComponent from 'components/Header';
import themeConfig from 'configurations/Theme.configuration';
import Typography from 'components/Typography';

import {ScrollView} from 'react-native-gesture-handler';
import SecondaryHeader from 'components/SecondaryHeader';
import SVGIcon from 'components/Icon';
import {strings} from 'i18n/i18n';
import {useSelector} from 'react-redux';
import ProperyCard from './PropertyCard.component';

import {
  _returnMatchCancellation,
  _returnMatchPetAllowed,
} from 'resources/CommonFunction';

const icons = ['Cancel', 'Regulations', 'Calender', 'Paw'];

const PropertyFacilitiesScreen = ({navigation, route}) => {
  const {bathHouseData} = route.params || {};
  const [houseRule, setHouseRule] = useState([]);
  const [refreshApp, setrefreshApp] = useState(false);
  const [language] = useSelector(state => [state.globalReducerData.language]);
  const [previouslng, setpreviouslng] = useState(language);

  const loadData = () => {
    let json = [
      {
        id: 1,
        title: 'hours',
        // subTitle: `${strings('open_from')} ${
        //   bathHouseData.openHoursFrom
        // } ${strings('to')} ${bathHouseData.openHoursTo}`,
        subTitle: `${strings('open_from')} ${
          bathHouseData.openHoursFrom ? bathHouseData.openHoursFrom : ''
        }`,
        icon: 'Hours',
        enableFunc: false,
      },
      {
        id: 2,
        title: 'cancellation',
        subTitle: `${
          bathHouseData.cancellation
            ? _returnMatchCancellation(bathHouseData.cancellation, language)
            : ''
        }`,
        icon: 'Cancel',
        enableFunc: true,
      },
      {
        id: 3,
        title: 'animals',
        subTitle: `${
          bathHouseData.pets
            ? _returnMatchPetAllowed(bathHouseData.pets, language)
            : ''
        }`,
        icon: 'Paw',
        enableFunc: true,
      },
      {
        id: 4,
        title: 'regulation',
        subTitle: `${bathHouseData.regulation ? bathHouseData.regulation : ''}`,
        icon: 'Regulations',
        enableFunc: false,
      },
    ];
    setHouseRule(json);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });
    return () => {
      unsubscribe;
    };
  }, [navigation, language]);

  useEffect(() => {
    if (previouslng !== language) {
      loadData();
    }
  }, [language]);

  return (
    <Layout style={{flex: 1}} level="1">
      <HeaderComponent showBackButton />
      <SecondaryHeader title={strings('read_Before_Booking')} />
      <ScrollView bounces={false}>
        <Layout level="1" style={[styles.container, styles.boxStyle]}>
          <ProperyCard
            name={bathHouseData.bathouseName}
            address={bathHouseData.address}
          />
          {houseRule.map(({title, subTitle, icon, enableFunc}) => {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  marginBottom: themeConfig.margin * 2,
                  marginHorizontal: themeConfig.margin + 5,
                }}
                key={title}>
                <View style={styles.leftSection}>
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <SVGIcon type={icon} width={34} height={34} />
                    <Typography
                      category="p2"
                      style={{
                        fontWeight: '400',
                        color: '#373E46',
                        marginLeft: 10,
                      }}
                      status="basic">
                      {`${strings(title)}`}
                    </Typography>
                  </View>
                </View>
                <View style={styles.rightSection}>
                  <Typography
                    category="s2"
                    style={{fontWeight: '600', color: '#5873BA'}}
                    status="basic">
                    {subTitle ? subTitle : ''}
                  </Typography>
                </View>
              </View>
            );
          })}
        </Layout>
      </ScrollView>
    </Layout>
  );
};
export default PropertyFacilitiesScreen;

const styles = StyleSheet.create({
  container: {flex: 1},
  boxStyle: {
    margin: themeConfig.margin,
  },
  icon: {
    padding: themeConfig.padding,
    paddingRight: themeConfig.padding + 4,
  },
  leftSection: {
    flex: 3,
    // width: 130,
    marginBottom: themeConfig.margin / 2,
  },
  rightSection: {
    flex: 2,
    marginBottom: themeConfig.margin / 2,
  },
});
