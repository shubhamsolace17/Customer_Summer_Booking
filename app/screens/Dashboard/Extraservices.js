import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import Typography from 'components/Typography';
import HeroImage from 'components/HeroImage';
import PlusMinusComponent from 'components/PlusMinus';
import themeConfig from 'configurations/Theme.configuration';
import pure from 'recompose/pure';

const BookExtraComponent = ({item, index, type, updateCounter = () => {}}) => {
  return useMemo(() => (
    <>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: themeConfig.margin / 2,
        }}
        key={index}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View style={styles.icon}>
            <HeroImage
              uri={item.Servicemage ? item.Servicemage : ''}
              style={styles.imageStyle}
              height={24}
            />
          </View>
          <Typography category="s1" style={{fontSize: 13}} status="basic">
            {item.ServiceName}
          </Typography>
        </View>
        <Typography category="s1" style={{fontSize: 13}} status="basic">
          {parseInt(item.ServicePrice)} €
        </Typography>
        <PlusMinusComponent
          value={item.count ? item.count : 0}
          plusPress={() => updateCounter(type, index, 1, item)}
          minusPress={() => updateCounter(type, index, 0, item)}
        />
      </View>
      <Typography category="s2" style={{fontWeight: '400'}} status="basic">
        {item.msg}
      </Typography>
    </>
  ));
};

// Wrap component using "memo" HOC
export default pure(BookExtraComponent);
const styles = StyleSheet.create({
  container: {flex: 1},
  boxStyle: {
    marginHorizontal: themeConfig.margin,
  },
  icon: {
    padding: themeConfig.padding,
    paddingRight: themeConfig.padding + 4,
  },
  imageStyle: {
    width: 24,
    height: 24,
  },
  head: {height: 40},
  text: {
    margin: 6,
    color: '#9d9d9d',
    fontFamily: 'Roboto-Medium',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '400',
  },
  closeicon: {
    width: 30,
    height: 30,
  },
});
