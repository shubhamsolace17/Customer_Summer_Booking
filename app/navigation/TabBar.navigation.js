import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  TouchableHighlight,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import BottomTabBarIcon from 'components/Icon/bottomTab';
import SVGIcon from 'components/Icon';
import themeConfig from 'configurations/Theme.configuration';
import {useRoute} from '@react-navigation/native';
import DropShadow from 'react-native-drop-shadow';

const windowWidth = Dimensions.get('window').width;
export default function CustomeTabBar({props, navigation}) {
  return (
    <>
      <View
        style={{
          width: "100%",
          // elevation: 0,
          height: 60,
          // backgroundColor: themeConfig.colors.lightBule,
          // shadowColor: '#000',
          // shadowOffset: {width: 0, height: 1},
          // shadowOpacity: 0.8,
          // shadowRadius: 1,
          // borderWidth: 0,
          // opacity:1.9,
          position: 'absolute',
          left: 0,
          bottom: 0,
          elevation: 0,
          borderTopWidth: 0,
        }}>
        <ImageBackground
          source={require('app/resources/images/wave.png')}
          style={styles.image}
          resizeMode="stretch">
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => navigation.navigate('Reservation')}>
            <SVGIcon type="Briefcase" width={28} height={28} />
          </TouchableOpacity>
          <DropShadow
            style={{
              shadowColor: '#001F70',
              shadowOffset: {
                width: 0,
                height: 3,
              },
              shadowOpacity: 1,
              shadowRadius: 6,
            }}>
            <TouchableOpacity
              style={[
                styles.icon,
                {
                  borderBottomWidth: 1,
                  borderColor: '#4d4d4d',
                  shadowColor: 'red',
                },
              ]}
              onPress={() => navigation.navigate('Search')}>
              <SVGIcon type="Home" width={20} height={20} />
            </TouchableOpacity>
          </DropShadow>

          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => navigation.navigate('User')}>
            <SVGIcon type="Person" width={28} height={28} />
          </TouchableOpacity>
        </ImageBackground>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  image: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 16,
    width: windowWidth + 10,
    top: -20,
  },
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  icon: {
    height: 58,
    bottom: 13,
    width: 58,
    borderRadius: 58,
    backgroundColor: '#5a95ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    marginHorizontal: 5,
    justifyContent: 'center',
    marginBottom: 10,
  },

  button: {
    shadowColor: 'rgba(0,0,0, .4)', // IOS
    shadowOffset: {height: 1, width: 1}, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    backgroundColor: '#fff',
    elevation: 2, // Android
    shadowColor: 'red',
    height: 50,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});
