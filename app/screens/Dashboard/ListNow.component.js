import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Layout} from '@ui-kitten/components';
import themeConfig from 'configurations/Theme.configuration';
import Typography from 'components/Typography';
import ButtonComponent from 'components/Button';
import HeroImage from 'components/HeroImage';
import {strings} from 'i18n/i18n';

const ListNowComponent = ({onPress = () => {}}) => {
  return (
    <Layout style={styles.container}>
      <View style={{width: 130}}>
        <HeroImage
          resizeMode="contain"
          asset={require('../../resources/images/Icon-bath-big.png')}
          height={90}
        />
      </View>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Typography
          category="p1"
          style={{
            marginVertical: themeConfig.margin / 4,
            color: themeConfig.colors.white,
            fontSize: 18,
          }}>
          {strings('list_property_title')}
        </Typography>
        <Typography
          category="h6"
          style={{marginVertical: themeConfig.margin / 4, fontSize: 20}}>
          {strings('SummerBooking')}
        </Typography>
        <ButtonComponent size="small" onPress={() => onPress()}>
          <Typography
            status="control"
            category="h6"
            style={{fontWeight: '400'}}>
            {strings('listNow')}
          </Typography>
        </ButtonComponent>
      </View>
    </Layout>
  );
};

export default ListNowComponent;

const styles = StyleSheet.create({
  container: {
    backgroundColor: themeConfig.colors.yellow,
    elevation: 4,
    marginHorizontal: themeConfig.margin,
    borderRadius: themeConfig.radius / 2,
    flexDirection: 'row',
    marginBottom: themeConfig.margin,
    padding: themeConfig.padding,
  },
});
