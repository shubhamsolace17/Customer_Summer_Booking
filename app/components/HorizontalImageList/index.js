import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  LogBox,
  Dimensions,
} from 'react-native';
import {Layout, Icon} from '@ui-kitten/components';
import {List} from '@ui-kitten/components';
import HeroImage from 'components/HeroImage';
import Typography from 'components/Typography';
import themeConfig from 'configurations/Theme.configuration';
import {chunk} from 'lodash';
import SVGIcon from 'components/Icon';
import LinearGradient from 'react-native-linear-gradient';
const windowWidth = Dimensions.get('window').width;
const calculatedWidth = windowWidth / 1.5 - themeConfig.margin;

const HorizontalImageList = ({
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
        <Typography category="h3" style={{marginLeft: themeConfig.margin}}>
          {title}
        </Typography>
      </View>
      <List
        horizontal
        style={{
          backgroundColor: themeConfig.colors.white,
        }}
        data={fistArray}
        renderItem={({item, index}) => {
          const secondArrayItem = secondArray[index];
          return (
            <Layout style={styles.itemParentContainer}>
              <TouchableOpacity
                onPress={() => onPress(item)}
                key={index}
                style={styles.itemContainer}>
                {/* <HeroImage
                  uri={
                    item.locationImage
                      ? item.locationImage
                      : 'https://summerbooking.s3.us-east-2.amazonaws.com/images/bathouse/2yjaja1dknhqmxlc.jpeg'
                  }
                  height={100}
                /> */}

                <ImageBackground
                  source={{
                    uri: item.locationImage
                      ? item.locationImage
                      : 'https://summerbooking.s3.us-east-2.amazonaws.com/images/bathouse/2yjaja1dknhqmxlc.jpeg',
                  }}
                  resizeMode="cover"
                  style={{
                    height: '100%',
                    width: '100%',
                  }}>
                  <LinearGradient
                    colors={['#233c7e00', '#233c7e']}
                    start={{x: 0, y: 0}}
                    end={{x: 0, y: 0.8}}
                    style={styles.textContainer}>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginHorizontal: 2,
                        justifyContent: 'center',
                        alignItems: 'center',
                        bottom: item.location ? 20 : 0,
                        position: 'absolute',
                      }}>
                      <Typography
                        status="control"
                        category="h6"
                        style={{
                          lineHeight: 30,
                          fontSize: 14,
                          marginHorizontal: 10,
                        }}
                        numberOfLines={1}>
                        {item.locationName ? item.locationName : item.text}
                      </Typography>
                    </View>

                    {item.location && (
                      <View
                        style={{
                          flexDirection: 'row',
                          marginHorizontal: 10,
                          justifyContent: 'center',
                          alignItems: 'center',
                          bottom: 8,
                          position: 'absolute',
                        }}>
                        <Icon
                          style={styles.icon}
                          fill={themeConfig.colors.white}
                          name="pin-outline"
                        />
                        <Typography
                          status="control"
                          category="p1"
                          style={{
                            lineHeight: 10,
                            fontSize: 8,
                            marginHorizontal: 5,
                            justifyContent: 'center',
                          }}>
                          {item.location ? item.location : ''}
                        </Typography>
                      </View>
                    )}
                  </LinearGradient>
                </ImageBackground>
              </TouchableOpacity>
              {secondArrayItem ? (
                <TouchableOpacity
                  onPress={() => onPress(secondArrayItem)}
                  key={index + fistArray.length}
                  style={[
                    styles.itemContainer,
                    {marginTop: themeConfig.margin},
                  ]}>
                  <ImageBackground
                    source={{
                      uri: item.locationImage
                        ? item.locationImage
                        : 'https://summerbooking.s3.us-east-2.amazonaws.com/images/bathouse/2yjaja1dknhqmxlc.jpeg',
                    }}
                    resizeMode="cover"
                    style={{
                      height: '100%',
                      width: '100%',
                    }}>
                    <LinearGradient
                      colors={['#233c7e00', '#233c7e']}
                      start={{x: 0, y: 0}}
                      end={{x: 0, y: 0.8}}
                      style={styles.textContainer}>
                      <View
                        style={{
                          flexDirection: 'row',
                          marginHorizontal: 2,
                          justifyContent: 'center',
                          alignItems: 'center',
                          bottom: 20,
                          position: 'absolute',
                        }}>
                        <Typography
                          status="control"
                          category="h6"
                          style={{
                            lineHeight: 30,
                            fontSize: 14,
                            marginHorizontal: 10,
                          }}
                          numberOfLines={1}>
                          {secondArrayItem.locationName}
                        </Typography>
                      </View>

                      {item.location && (
                        <View
                          style={{
                            flexDirection: 'row',
                            marginHorizontal: 10,
                            justifyContent: 'center',
                            alignItems: 'center',
                            bottom: 10,
                            position: 'absolute',
                          }}>
                          <Icon
                            style={styles.icon}
                            fill={themeConfig.colors.white}
                            name="pin-outline"
                          />
                          <Typography
                            status="control"
                            category="p1"
                            style={{
                              lineHeight: 10,
                              fontSize: 10,
                              marginHorizontal: 5,
                              justifyContent: 'center',
                            }}>
                            {item.location ? item.location : ''}
                          </Typography>
                        </View>
                      )}
                    </LinearGradient>
                  </ImageBackground>
                </TouchableOpacity>
              ) : null}
            </Layout>
          );
        }}
        keyExtractor={(item, index) => index.toString()}
      />
    </Layout>
  );
};

export default HorizontalImageList;

const styles = StyleSheet.create({
  textContainer: {
    flex: 1,
    // position: 'absolute',
    width: '100%',
    bottom: 0,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: themeConfig.padding / 2,
    padding: 2,
  },
  itemParentContainer: {
    flexDirection: 'column',
  },
  itemContainer: {
    width: calculatedWidth,
    borderRadius: themeConfig.radius * 3,
    overflow: 'hidden',
    marginRight: themeConfig.margin,
    position: 'relative',
    height: 120,
    marginHorizontal: themeConfig.margin / 2,
  },
  container: {
    marginVertical: themeConfig.margin,
  },
  icon: {
    width: themeConfig.radius * 2,
    height: themeConfig.radius * 2,
  },
});
