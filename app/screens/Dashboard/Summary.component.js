import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import Typography from 'components/Typography';
import themeConfig from 'configurations/Theme.configuration';
import pure from 'recompose/pure';
import {strings} from 'i18n/i18n';

const SummaryComponent = ({
  finalLocDataState,
  selectedBookedLocationDataState,
}) => {
  return useMemo(() => (
    <>
      {finalLocDataState &&
        finalLocDataState.length > 0 &&
        finalLocDataState.map((item, index) => {
          return (
            <View key={index}>
              <Typography category="s1" style={{fontSize: 14}} status="basic">
                {strings('location')} {item.Location}
              </Typography>
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
                  <View style={styles.icon}>
                    <Typography
                      category="s1"
                      style={{fontSize: 14}}
                      status="basic">
                      {item.PackageName}
                    </Typography>
                  </View>
                </View>
                <Typography category="s1" style={{fontSize: 14}} status="basic">
                  {item.PackageItemPrice} €
                </Typography>
              </View>

              {selectedBookedLocationDataState &&
                selectedBookedLocationDataState.length > 0 &&
                selectedBookedLocationDataState.map((element, index) => {
                  return (
                    <View key={index}>
                      {element &&
                        element.additem &&
                        element.additem.length > 0 &&
                        element.additem.map(e => {
                          return (
                            <>
                              {e &&
                                e.value > 0 &&
                                element &&
                                element.name === item.Location && (
                                  <>
                                    <Typography
                                      category="h3"
                                      style={{fontWeight: '500'}}>
                                      {strings('additional_items')}
                                    </Typography>

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
                                        <View style={styles.icon}>
                                          <Typography
                                            category="s1"
                                            style={{fontSize: 14}}
                                            status="basic">
                                            {e.name}
                                          </Typography>
                                        </View>
                                      </View>
                                      <Typography
                                        category="s1"
                                        style={{fontSize: 14}}
                                        status="basic">
                                        X {e.value}
                                      </Typography>

                                      <Typography
                                        category="s1"
                                        style={{fontSize: 14}}
                                        status="basic">
                                        {e.price} €
                                      </Typography>
                                    </View>
                                  </>
                                )}
                            </>
                          );
                        })}
                    </View>
                  );
                })}
            </View>
          );
        })}
    </>
  ));
};

// Wrap component using "memo" HOC
export default pure(SummaryComponent);
const styles = StyleSheet.create({
  container: {flex: 1},
  boxStyle: {
    marginHorizontal: themeConfig.margin,
  },
  dot: {
    width: themeConfig.radius,
    height: themeConfig.radius,
    borderRadius: themeConfig.radius,
    backgroundColor: themeConfig.colors.black,
    marginRight: themeConfig.margin + 4,
  },
  leftSection: {
    width: 100,
  },
  rightSection: {
    flex: 1,
  },
});
