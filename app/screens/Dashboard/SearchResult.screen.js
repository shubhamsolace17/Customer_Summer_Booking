import React from 'react';
import {Layout, List, Modal} from '@ui-kitten/components';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  LogBox,
  Dimensions,
} from 'react-native';
import HeaderComponent from 'components/Header';
import themeConfig from 'configurations/Theme.configuration';
import Typography from 'components/Typography';
import SecondaryHeader from 'components/SecondaryHeader';
import SVGIcon from 'components/Icon';
import {useState} from 'react';
import SearchComponent from './Search.component';
import CustomSkeletonList from 'components/CustomSkeleton/index';
import {
  setSearchData,
  setEditSearch,
  setUserSearchDate,
} from 'app/redux/actions/globalActions';
//API
import Api from 'services/Api';
import {postDataToServer} from 'services/AuthApi';

import {strings} from 'i18n/i18n';
LogBox.ignoreLogs([
  'VirtualizedLists should never be nested', // TODO: Remove when fixed,
  'Non-serializable values were found in the navigation state',
]);
import SearchListItem from './SearchListItem.component';
import FilterListScreen from './filterList.screen';
import {useSelector, useDispatch} from 'react-redux';
import {SafeAreaView} from 'react-native-safe-area-context';
import moment, {utc} from 'moment';
import {_formatDate} from 'resources/CommonFunction';

const SearchResultScreen = ({navigation, route}) => {
  const dispatch = useDispatch();
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setloading] = useState(false);
  const [autoInput, setautoInput] = React.useState('');
  const [autoInputError, setautoInputError] = React.useState('');
  const [error, setError] = useState('');
  const [likeData, setlikeData] = useState();
  const [rangeError, setrangeError] = React.useState('');
  const [
    isSignedIn,
    userProfile,
    searchDate,
    searchData,
    editSearch,
    language,
  ] = useSelector(state => [
    state.UserReducerData.isSignedIn,
    state.UserReducerData.userProfile,
    state.globalReducerData.searchDate,
    state.globalReducerData.searchData,
    state.globalReducerData.editSearch,
    state.globalReducerData.language,
  ]);
  const [range, setRange] = React.useState(searchDate);
  const startDate = moment(searchDate.startDate).format('DD-MM-YYYY');
  const endDate = moment(utc(searchDate.endDate)).format('DD-MM-YYYY');
  const [showFilter, setShowFilter] = useState(false);
  const [hasMore, sethasMore] = useState(false);
  const [editResult, setEditResult] = useState(false);
  const [userSelectedFilter, setuserSelectedFilter] = useState([]);
  const [page, setPage] = useState(0);

  const toggleFavorite = async index => {
    const searchResultData = [...searchResult];
    const currentData = searchResultData[index];
    const favouriteData = !currentData.favorite;
    const postData = {
      userId: userProfile ? userProfile.id : '',
      bathHouseId: currentData.id,
      islike: `${favouriteData === true ? '1' : '0'}`,
    };
    const {data, message, error, sucess} = await postDataToServer(
      `${Api.likeProperty}`,
      postData,
    );
    if (sucess) {
      currentData.favorite = !currentData.favorite;
      searchResultData[index] = currentData;
      setSearchResult(searchResultData);
    } else {
      let errorMessage = error ? error : message;
      setloading(false);
      setError(errorMessage);
    }
  };

  const loadData = async (selectedFilterdata, likedta) => {
    setloading(true);
    const postData = {
      searchKey: searchData && searchData.searchKey ? searchData.searchKey : '',
      page: page,
      filter: selectedFilterdata ? selectedFilterdata : [],
    };
    const {data, message, error, success} = await postDataToServer(
      `${Api.propertySearch}`,
      postData,
    );
    if (success) {
      if (data && data.data && data.data.property.length === 0) {
        setSearchResult([]);
        setloading(false);
      } else {
        setEditResult(false);
        if (data && data.data && data.data.property.length === 20) {
          sethasMore(true);
          setPage(page + 1);
        }
        data.data.property &&
          data.data.property.length > 0 &&
          data.data.property.map(item => {
            if (likedta && likedta.length > 0) {
              item.favorite = false;
              const filterList = likedta.filter(e => {
                if (e.bathHouseId === item.id && e.userId === userProfile.id) {
                  item.favorite = true;
                }
              });
            }
          });
        setSearchResult([...data.data.property]);
        setloading(false);
      }
    } else {
      let errorMessage = error ? error : message;
      setloading(false);
      setError(errorMessage);
    }
  };
  const loadlikeData = async () => {
    setloading(true);
    const {data, message, error} = await postDataToServer(`${Api.like}`);
    if (data) {
      setlikeData(data.data);
      loadData([], data.data);
    } else {
      let errorMessage = error ? error : message;
      setloading(false);
      setError(errorMessage);
    }
  };

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadlikeData();
    });
    return () => {
      unsubscribe;
    };
  }, [showFilter, navigation]);

  React.useEffect(() => {
    if (editResult) {
      loadlikeData();
    }
  }, [searchData]);

  const ApplyFilter = data => {
    setuserSelectedFilter(data);
    loadData(data, likeData);
    setShowFilter(false);
  };

  const ResetFilter = () => {
    setuserSelectedFilter([]);
    loadData([], likeData);
    setShowFilter(false);
  };

  const onEdit = () => {
    dispatch(setEditSearch(false));
  };
  const onEditSubmit = () => {
    const searchNewData = {
      searchKey: autoInput ? autoInput : searchData.searchKey,
      range: range ? range : searchData.range,
    };
    dispatch(setEditSearch(true));
    dispatch(setSearchData(searchNewData));
    dispatch(setUserSearchDate(range));
    setEditResult(true);
  };
  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    // eslint-disable-line
    return (
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 500
    );
  };

  const sortBy = () => {
    const sortData = searchResult.reverse();
    setSearchResult([...sortData]);
  };

  return (
    <>
      {showFilter ? (
        <FilterListScreen
          onApply={data => ApplyFilter(data)}
          onReset={() => ResetFilter()}
          userFilters={userSelectedFilter}
          backAction={() => setShowFilter(false)}
        />
      ) : (
        <>
          <Layout style={{flex: 1}}>
            <HeaderComponent showBackButton />

            <ScrollView
              bounces={false}
              onScroll={({nativeEvent}) => {
                if (isCloseToBottom(nativeEvent) && hasMore) {
                  console.log('hehje');
                }
              }}>
              {loading && (
                <>
                  <CustomSkeletonList />
                  <CustomSkeletonList />
                </>
              )}

              {!loading && (
                <Layout level="1" style={styles.container}>
                  <View>
                    <SearchComponent
                      showDatePicker={false}
                      data={searchData}
                      range={range}
                      showSearch={editSearch}
                      date={`${startDate}`}
                      setInputValue={data => {
                        setautoInput(data), setautoInputError('');
                      }}
                      onDateSelect={nextRange => {
                        setRange(nextRange);
                      }}
                      onSearchSumbit={() => {
                        editSearch ? onEdit() : onEditSubmit();
                      }}
                      locale={language}
                    />
                  </View>

                  <Layout style={[styles.filterSortContainer]}>
                    <TouchableOpacity
                      onPress={() => setShowFilter(true)}
                      style={styles.filterSortChild}>
                      <Layout style={styles.filterSortChild}>
                        <SVGIcon
                          type="Filter"
                          color={themeConfig.colors.primary}
                          style={{
                            marginRight: themeConfig.margin / 2,
                          }}
                          width={20}
                          height={20}
                        />
                        <Typography
                          category="p2"
                          status="basic"
                          style={{
                            marginLeft: themeConfig.margin,
                            fontWeight: '400',
                          }}>
                          {strings('filter')}
                        </Typography>
                      </Layout>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => sortBy(true)}
                      style={styles.filterSortChild}>
                      <Layout style={styles.filterSortChild}>
                        <SVGIcon
                          type="Sort"
                          width={20}
                          height={20}
                          style={{
                            marginRight: themeConfig.margin / 2,
                          }}
                        />
                        <Typography
                          status="basic"
                          category="p2"
                          style={{
                            marginLeft: themeConfig.margin,
                            fontWeight: '400',
                          }}>
                          {strings('sort')}
                        </Typography>
                      </Layout>
                    </TouchableOpacity>
                    {/* <View style={styles.middleBorder} /> */}
                    {/* <TouchableOpacity onPress={() =>sortBy()}>
                    <Layout style={styles.filterSortChild}>
                      <SVGIcon type="Sort" width={16} height={16} />
                      <Typography
                        status="basic"
                        category="s2"
                        style={{
                          marginLeft: themeConfig.margin / 2,
                          fontWeight: '400',
                        }}>
                        {strings('sort')}
                      </Typography>
                    </Layout>
                    </TouchableOpacity> */}
                  </Layout>
                  <View style={[styles.boxStyle]}>
                    <List
                      contentContainerStyle={{
                        flexGrow: 1,
                        backgroundColor: themeConfig.colors.white,
                        // marginTop:WINDOW_HEIGHT/2,
                        justifyContent: 'flex-end',
                      }}
                      data={searchResult}
                      renderItem={({item, index}) => {
                        return (
                          <SafeAreaView style={{flex: 1}}>
                            <SearchListItem
                              key={index}
                              item={item}
                              index={index}
                              onPress={toggleFavorite}
                              loading={loading}
                            />
                          </SafeAreaView>
                        );
                      }}
                      onEndReachedThreshold={1.2}
                      onMomentumScrollEnd={() => console.log('sd')}
                      ListEmptyComponent={
                        <>
                          {!loading && (
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
                                No Record Found
                              </Typography>
                            </View>
                          )}
                        </>
                      }
                    />
                  </View>

                  <View
                    style={{
                      alignSelf: 'center',
                      justifyContent: 'center',
                      flex: 1,
                    }}>
                    <Typography
                      status="danger"
                      category="s2"
                      style={{
                        marginLeft: themeConfig.margin / 2,
                        fontWeight: '400',
                      }}>
                      {error}
                    </Typography>
                  </View>
                </Layout>
              )}
            </ScrollView>
            {!loading && !editSearch && (
              <Layout>
                <Modal
                  style={{
                    width: '100%',
                    backgroundColor: themeConfig.colors.lightBule,
                    top: themeConfig.margin * 10,
                    position: 'absolute',
                  }}
                  backdropStyle={styles.backdrop}
                  visible={true}
                  onBackdropPress={() => onEditSubmit()}>
                  <SearchComponent
                    showDatePicker
                    data={searchData}
                    range={range}
                    showSearch={editSearch}
                    setInputValue={data => {
                      setautoInput(data), setautoInputError('');
                    }}
                    onDateSelect={nextRange => {
                      setRange(nextRange);
                    }}
                    onSearchSumbit={() => {
                      editSearch ? onEdit() : onEditSubmit();
                    }}
                  />
                </Modal>
              </Layout>
            )}
          </Layout>
        </>
      )}
    </>
  );
};
export default SearchResultScreen;

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
    flex: 1,
    justifyContent: 'space-between',
    marginHorizontal: themeConfig.margin * 3,
  },
  middleBorder: {
    width: 1,
    borderColor: themeConfig.colors.borderColor,
    borderWidth: 0.7,
    height: themeConfig.boxHeightUnit / 2,
  },
  filterSortChild: {
    justifyContent: 'center',
    alignItems: 'center',
    height: themeConfig.boxHeightUnit,
    flexDirection: 'row',
  },
  overflow: {
    // position:"absolute",
    width: '80%',
    elevation: 100,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
