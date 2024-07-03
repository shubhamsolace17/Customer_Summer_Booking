import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ImageBackground,
  Image,
  Dimensions,
} from 'react-native';
import {Layout, Card} from '@ui-kitten/components';
import {List} from '@ui-kitten/components';
import Typography from 'components/Typography';
import themeConfig from 'configurations/Theme.configuration';
import {chunk} from 'lodash';
import SVGIcon from 'components/Icon';
import {strings} from 'i18n/i18n';
import LinearGradient from 'react-native-linear-gradient';
const windowWidth = Dimensions.get('window').width;

const VerticalImageList = ({
  isTwoRow,
  iconName,
  title,
  data = [],
  onPress = () => {},
}) => {
  const [fistArray, secondArray] =
    data.length > 5 && isTwoRow
      ? chunk(data, Math.ceil(data.length / 2))
      : [data, []];
  return (
    <Layout style={styles.container}>
      <View style={{flexDirection: 'row', marginBottom: themeConfig.margin}}>
        {/* <SVGIcon type={iconName} width={24} height={28} /> */}
        <Typography category="h2" style={{marginLeft: themeConfig.margin}}>
          {title}
        </Typography>
      </View>
      <List
        data={fistArray}
        renderItem={({item, index}) => {
          return (
            <Layout>
              <TouchableOpacity onPress={() => onPress(item)} key={index}>
                <Card onPress={() => onPress(item)} style={styles.card}>
                  {/* <Image
                    style={styles.mainImage}
                    source={item.locationImage}
                    resizeMode={'cover'}
                  /> */}

                  <ImageBackground
                    source={item.locationImage}
                    resizeMode="cover"
                    style={styles.mainImage}>
                    <LinearGradient
                      colors={['#233c7e00', '#233c7e']}
                      start={{x: 0, y: 0}}
                      end={{x: 0, y: 0.8}}
                      style={styles.textContainer}>
                      <View
                        style={{
                          marginHorizontal: themeConfig.margin / 2,
                          bottom: 0,
                          position: 'absolute',
                          padding: themeConfig.padding,
                        }}>
                        <Typography
                          category="h4"
                          style={{color: 'white', fontSize: 20}}
                          numberOfLines={6}>
                          {item.title ? strings(item.title) : ''}
                        </Typography>
                        <Typography
                          category="p1"
                          numberOfLines={6}
                          style={{color: 'white'}}>
                          {item.subTitle ? strings(item.subTitle) : ''}
                        </Typography>
                      </View>
                    </LinearGradient>
                  </ImageBackground>
                </Card>
              </TouchableOpacity>
            </Layout>
          );
        }}
        keyExtractor={(item, index) => index.toString()}
      />
    </Layout>
  );
};

export default VerticalImageList;

const styles = StyleSheet.create({
  container: {
    marginVertical: themeConfig.margin,
  },
  textContainer: {
    flex: 1,
    // position: 'absolute',
    width: '100%',
    bottom: 0,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: themeConfig.padding * 2,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  card: {
    width: '100%',
    borderRadius: themeConfig.radius * 4,
    overflow: 'hidden',
    marginVertical: themeConfig.margin,
    position: 'relative',
    padding: 0,
  },
  mainImage: {
    flex: 1,
    height: windowWidth / 2,
    width: windowWidth,
    resizeMode: 'cover',
    marginHorizontal: -24,
    marginVertical: -16,
  },
  footerImage: {
    flex: 1,
    width: '100%',
    resizeMode: 'cover',
  },
});
