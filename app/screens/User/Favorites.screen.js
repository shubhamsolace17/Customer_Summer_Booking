import React from 'react';
import {Layout, List} from '@ui-kitten/components';
import {StyleSheet, View, ActivityIndicator} from 'react-native';
import HeaderComponent from 'components/Header';
import themeConfig from 'configurations/Theme.configuration';
import Typography from 'components/Typography';
import SecondaryHeader from 'components/SecondaryHeader';
import {useState, useEffect, useRef} from 'react';
import SearchListItem from '../Dashboard/SearchListItem.component';
import ButtonComponent from 'components/Button';
//API
import Api from 'services/Api';
import {postDataToServer} from 'services/AuthApi';
import Toast from 'react-native-easy-toast';
//Translation
import {strings} from 'i18n/i18n';
import {useSelector} from 'react-redux';

const FavoritesScreen = ({navigation}) => {
  const [isSignedIn, userProfile, language] = useSelector(state => [
    state.UserReducerData.isSignedIn,
    state.UserReducerData.userProfile,
    state.globalReducerData.language,
  ]);
  const [favoriteData, setfavoriteData] = useState();
  const [loading, setloading] = useState(false);
  const toast = useRef('');
  const toggleFavorite = async index => {
    const currentData = favoriteData[index];
    const favouriteStatus = !currentData.favorite;
    const postData = {
      userId: userProfile ? userProfile.id : '',
      bathHouseId: currentData.id,
      islike: `${favouriteStatus === true ? '1' : '0'}`,
    };
    console.log('postData', postData, favouriteStatus);
    const {data, message, error, sucess} = await postDataToServer(
      `${Api.likeProperty}`,
      postData,
    );
    console.log('sucess', sucess, message, data);
    if (sucess) {
      loadData();
    } else {
      let errorMessage = error ? error : message;
      setloading(false);
      setError(errorMessage);
    }
  };
  const loadData = async id => {
    setloading(true);
    const postData = {
      userid: userProfile.id,
    };
    const {data, error, message, status} = await postDataToServer(
      `${Api.getMyfavourite}`,
      postData,
    );
    if (status && data) {
      data.data &&
        data.data.length > 0 &&
        data.data.map((e, i) => {
          if (e.likedStatus) {
            e.favorite = true;
          } else {
            e.favorite = false;
          }
        });
      setfavoriteData(data.data);
      setloading(false);
    } else {
      setloading(false);
      let errorMessage = error ? error : message;
      toast.current.show(errorMessage);
    }
  };

  useEffect(() => {
    navigation.setParams({refresh: true});
    const unsubscribe = navigation.addListener('focus', () => {
      if (isSignedIn) {
        loadData();
      }
    });
    return () => {
      unsubscribe;
    };
  }, [navigation]);

  return (
    <Layout style={{flex: 1}}>
      <HeaderComponent showBackButton />
      <Layout level="1" style={styles.container}>
        <View style={[styles.boxStyle, {marginTop: themeConfig.margin}]}>
          {loading ? (
            <ActivityIndicator
              animating={loading}
              style={{
                alignSelf: 'center',
                justifyContent: 'center',
                flex: 1,
                marginTop: themeConfig.margin * 2,
              }}
              size="large"
              color="#253C7E"
            />
          ) : (
            <>
              <List
                contentContainerStyle={{
                  flexGrow: 1,
                  backgroundColor: themeConfig.colors.white,
                }}
                bounces={false}
                data={favoriteData}
                renderItem={({item, index}) => {
                  console.log('item', item);
                  return (
                    <SearchListItem
                      key={index}
                      item={item}
                      index={index}
                      onPress={toggleFavorite}
                      plain={false}
                      favoriteScreen={false}
                      showfavorite
                    />
                  );
                }}
                ListEmptyComponent={
                  <>
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
                  </>
                }
              />
            </>
          )}
        </View>
      </Layout>
      {isSignedIn ? null : (
        <Layout>
          <View style={styles.boxStyle}>
            <ButtonComponent onPress={() => navigation.navigate('Login')}>
              <Typography
                status="control"
                category="h6"
                style={{fontWeight: '400'}}>
                {strings('sign_in')}
              </Typography>
            </ButtonComponent>
          </View>
        </Layout>
      )}
      <Toast
        ref={toast} //eslint-disable-line
        position="bottom"
        defaultCloseDelay={8000}
        positionValue={200}
      />
    </Layout>
  );
};
export default FavoritesScreen;

const styles = StyleSheet.create({
  container: {flex: 1},
  boxStyle: {
    marginHorizontal: themeConfig.margin,
  },
  detailsContainer: {
    flex: 1,
    marginLeft: themeConfig.margin,
    paddingVertical: themeConfig.padding / 2,
  },
  imageContainer: {
    width: 120,
    height: '100%',
  },
  imageStyle: {
    borderRadius: themeConfig.radius,
    width: 120,
  },
  itemContainer: {
    borderRadius: themeConfig.radius,
    overflow: 'hidden',
    flexDirection: 'row',
    marginBottom: themeConfig.margin * 2,
    position: 'relative',
    flex: 1,
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
