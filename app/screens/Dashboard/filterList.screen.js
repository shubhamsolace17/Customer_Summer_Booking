import React, {useEffect} from 'react';
import {Layout, CheckBox} from '@ui-kitten/components';
import {StyleSheet, View} from 'react-native';
import HeaderComponent from 'components/Header';
import themeConfig from 'configurations/Theme.configuration';
import Typography from 'components/Typography';
import ButtonComponent from 'components/Button';
import {ScrollView} from 'react-native-gesture-handler';
import SecondaryHeader from 'components/SecondaryHeader';
import {strings} from 'i18n/i18n';
//API
import Api from 'services/Api';
import {postDataToServer} from 'services/AuthApi';
import {useSelector} from 'react-redux';
import Loader from 'components/Loader';

const FilterListScreen = ({
  onApply,
  onReset,
  userFilters,
  backAction = () => {},
}) => {
  const [filterData, setfilterData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const appStore = useSelector(state => state.globalReducerData);
  const selectItem = async selecteddata => {
    if (filterData.includes(selecteddata.serviceName)) {
      var temp = await filterData.filter(
        itm => itm !== selecteddata.serviceName,
      );
      setfilterData(temp);
    } else {
      const newData = [...filterData, selecteddata.serviceName];
      setfilterData(newData);
    }
    filterData.map(e => {
      if (e.serviceName == selecteddata.serviceName) {
        e.isSelect = !e.isSelect;
      }
    });
  };

  const loadData = async () => {
    setLoading(true);
    const {data, message, error} = await postDataToServer(`${Api.getFilter}`);
    if (data) {
      data.data.map(item => {
        if (userFilters && userFilters.length > 0) {
        } else {
          item.isSelect = false;
        }
      });
      setfilterData(data.data);
      let temp = [];
      userFilters.map(item => {
        temp.push(item.serviceName);
      });
      const newDat = data.data.concat(temp);
      setfilterData(newDat);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const ApplyFilter = async () => {
    const filterList = filterData.filter(item => {
      var isSelect = item.isSelect;
      return isSelect == true;
    });
    if (filterList && filterList.length > 0) {
      const selectedfilter = await filterList.map(str => ({
        serviceName: str.serviceName,
      }));
      onApply(selectedfilter);
    } else {
      onApply([]);
    }
  };

  const ResetFilter = async () => {
    onReset();
  };

  useEffect(() => {
    loadData();
  }, []);

  // useEffect(() => {
  //   BackHandler.addEventListener('hardwareBackPress', function() {return true})

  //   return () => {
  //     BackHandler.removeEventListener("hardwareBackPress", backButtonHandler);
  //   };
  // }, [backButtonHandler])

  return (
    <Layout style={{flex: 1}} level="1">
      <HeaderComponent
        showBackButton
        customNaviagtion
        NaviagtionAction={() => backAction()}
      />
      <SecondaryHeader
        title={strings('filter_by')}
        customNaviagtion
        NaviagtionAction={() => backAction()}
      />
      {loading ? (
        <View style={styles.center}>
          <Loader color="#253C7E" visible={loading} />
        </View>
      ) : (
        <>
          {filterData && filterData.length > 0 && (
            <>
              <ScrollView bounces={false}>
                <Layout
                  level="1"
                  style={[styles.container, {margin: themeConfig.margin}]}>
                  <Typography
                    category="h3"
                    style={{
                      fontSize: 18,
                      marginBottom: themeConfig.margin / 2,
                    }}>
                    {strings('popular_filter')}
                  </Typography>

                  {filterData &&
                    filterData
                      .filter(a => a.serviceFilterType === 1)
                      .map((item, key) => (
                        <View key={key} style={{}}>
                          <View style={{marginVertical: themeConfig.margin}}>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: themeConfig.margin / 2,
                              }}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}>
                                <View style={styles.checkBoxStyle}>
                                  <CheckBox
                                    checked={filterData.includes(
                                      item.serviceName,
                                    )}
                                    onChange={() => selectItem(item)}
                                  />
                                </View>

                                <Typography
                                  category="s1"
                                  style={{fontSize: 14}}
                                  status="basic">
                                  {appStore.language == 'it'
                                    ? item.serviceItalian.replace('\r\n', '')
                                    : item.serviceName}
                                </Typography>
                              </View>
                            </View>
                          </View>
                        </View>
                      ))}

                  <Typography
                    category="h3"
                    style={{
                      fontSize: 18,
                      marginBottom: themeConfig.margin / 2,
                    }}>
                    {strings('accessibility')}
                  </Typography>

                  {filterData &&
                    filterData
                      .filter(a => a.serviceFilterType === 2)
                      .map((item, key) => (
                        <View key={key} style={{}}>
                          <View style={{marginVertical: themeConfig.margin}}>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: themeConfig.margin / 2,
                              }}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}>
                                <View style={styles.checkBoxStyle}>
                                  <CheckBox
                                    checked={filterData.includes(
                                      item.serviceName,
                                    )}
                                    onChange={() => selectItem(item)}
                                  />
                                </View>

                                <Typography
                                  category="s1"
                                  style={{fontSize: 14}}
                                  status="basic">
                                  {appStore.language == 'it'
                                    ? item.serviceItalian.replace('\r\n', '')
                                    : item.serviceName}
                                </Typography>
                              </View>
                            </View>
                          </View>
                        </View>
                      ))}

                  <Typography
                    category="h3"
                    style={{
                      fontSize: 18,
                      marginBottom: themeConfig.margin / 2,
                    }}>
                    {strings('restuarant')}
                  </Typography>

                  {filterData &&
                    filterData
                      .filter(a => a.serviceFilterType === 3)
                      .map((item, key) => (
                        <View key={key} style={{}}>
                          <View style={{marginVertical: themeConfig.margin}}>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: themeConfig.margin / 2,
                              }}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}>
                                <View style={styles.checkBoxStyle}>
                                  <CheckBox
                                    checked={filterData.includes(
                                      item.serviceName,
                                    )}
                                    onChange={() => selectItem(item)}
                                  />
                                </View>

                                <Typography
                                  category="s1"
                                  style={{fontSize: 14}}
                                  status="basic">
                                  {appStore.language == 'it'
                                    ? item.serviceItalian.replace('\r\n', '')
                                    : item.serviceName}
                                </Typography>
                              </View>
                            </View>
                          </View>
                        </View>
                      ))}

                  <Typography
                    category="h3"
                    style={{
                      fontSize: 18,
                      marginBottom: themeConfig.margin / 2,
                    }}>
                    {strings('sports_activities')}
                  </Typography>

                  {filterData &&
                    filterData
                      .filter(a => a.serviceFilterType === 4)
                      .map((item, key) => (
                        <View key={key} style={{}}>
                          <View style={{marginVertical: themeConfig.margin}}>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: themeConfig.margin / 2,
                              }}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}>
                                <View style={styles.checkBoxStyle}>
                                  <CheckBox
                                    checked={filterData.includes(
                                      item.serviceName,
                                    )}
                                    onChange={() => selectItem(item)}
                                  />
                                </View>

                                <Typography
                                  category="s1"
                                  style={{fontSize: 14}}
                                  status="basic">
                                  {appStore.language == 'it'
                                    ? item.serviceItalian.replace('\r\n', '')
                                    : item.serviceName}
                                </Typography>
                              </View>
                            </View>
                          </View>
                        </View>
                      ))}

                  <Typography
                    category="h3"
                    style={{
                      fontSize: 18,
                      marginBottom: themeConfig.margin / 2,
                    }}>
                    {strings('wellness_and_personal')}
                  </Typography>

                  {filterData &&
                    filterData
                      .filter(a => a.serviceFilterType === 5)
                      .map((item, key) => (
                        <View key={key} style={{}}>
                          <View style={{marginVertical: themeConfig.margin}}>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: themeConfig.margin / 2,
                              }}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}>
                                <View style={styles.checkBoxStyle}>
                                  <CheckBox
                                    checked={filterData.includes(
                                      item.serviceName,
                                    )}
                                    onChange={() => selectItem(item)}
                                  />
                                </View>

                                <Typography
                                  category="s1"
                                  style={{fontSize: 14}}
                                  status="basic">
                                  {appStore.language == 'it'
                                    ? item.serviceItalian.replace('\r\n', '')
                                    : item.serviceName}
                                </Typography>
                              </View>
                            </View>
                          </View>
                        </View>
                      ))}

                  <Typography
                    category="h3"
                    style={{
                      fontSize: 18,
                      marginBottom: themeConfig.margin / 2,
                    }}>
                    {strings('beach_type')}
                  </Typography>

                  {filterData &&
                    filterData
                      .filter(a => a.serviceFilterType === 6)
                      .map((item, key) => (
                        <View key={key} style={{}}>
                          <View style={{marginVertical: themeConfig.margin}}>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: themeConfig.margin / 2,
                              }}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}>
                                <View style={styles.checkBoxStyle}>
                                  <CheckBox
                                    checked={filterData.includes(
                                      item.serviceName,
                                    )}
                                    onChange={() => selectItem(item)}
                                  />
                                </View>

                                <Typography
                                  category="s1"
                                  style={{fontSize: 14}}
                                  status="basic">
                                  {appStore.language == 'it'
                                    ? item.serviceItalian.replace('\r\n', '')
                                    : item.serviceName}
                                </Typography>
                              </View>
                            </View>
                          </View>
                        </View>
                      ))}
                </Layout>
              </ScrollView>
              <View
                style={[
                  styles.boxStyle,
                  {paddingTop: themeConfig.padding / 1},
                ]}>
                <ButtonComponent onPress={() => ApplyFilter()}>
                  {strings('apply')}
                </ButtonComponent>

                <ButtonComponent onPress={() => ResetFilter()}>
                  {strings('reset')}
                </ButtonComponent>
              </View>
            </>
          )}
        </>
      )}
    </Layout>
  );
};
export default FilterListScreen;

const styles = StyleSheet.create({
  container: {flex: 1, marginHorizontal: themeConfig.margin * 3},
  boxStyle: {
    marginHorizontal: themeConfig.margin * 3,
  },
  checkBoxStyle: {
    padding: themeConfig.padding / 2,
    paddingRight: themeConfig.padding + 4,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
  },
});
