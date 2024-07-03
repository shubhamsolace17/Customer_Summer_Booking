import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import Typography from 'components/Typography';
import {strings} from 'i18n/i18n';
import {Layout, Divider, Icon} from '@ui-kitten/components';
import themeConfig from 'configurations/Theme.configuration';
import SelectComponent from 'components/Select';
import PlusMinusComponent from 'components/PlusMinus';
import Loader from 'components/Loader';

const BookFinalComponent = ({
  allPackageData,
  index,
  item,
  selectedIndex,
  loading,
  language,
  value,
  activeIndex,
  handleChange = () => {},
  updateCounter = () => {},
  handleModal = () => {},
}) => {
  return (
    <Layout
      level="1"
      style={[styles.container, {marginTop: themeConfig.margin}]}>
      <Typography category="h3" style={{fontWeight: '700'}}>
        {strings('Choose_package')}
      </Typography>
      <Typography category="p1" status="basic" style={{fontWeight: '500'}}>
        {strings('for_location')} {item.name ? item.name : ''}
      </Typography>
      <View
        style={[
          styles.boxStyle,
          {
            flexDirection: 'row',
            marginVertical: themeConfig.margin,
            marginTop: themeConfig.margin + 2,
          },
        ]}>
        <View style={styles.leftSection}>
          <Typography category="s1" style={{fontSize: 14}} status="basic">
            {strings('package')}
          </Typography>
        </View>

        <View style={styles.rightSection}>
          {allPackageData && allPackageData.length > 0 && (
            <SelectComponent
              selectedIndex={selectedIndex}
              onSelect={selectedValueindex =>
                handleChange(selectedValueindex, index, item)
              }
              size="small"
              placeholder={`${strings('select_pac')}`}
              options={allPackageData}
              value={
                item && item.displayName && item.displayName
                  ? item.displayName
                  : `${strings('select_pac')}`
              }
            />
          )}
        </View>
      </View>
      {activeIndex == index && <Loader color="#253C7E" visible={loading} />}
      <View style={[styles.boxStyle]}>
        <Typography
          category="h3"
          style={{fontWeight: '700', fontFamily: 'Roboto-Regular'}}>
          {strings('additional_items')}
        </Typography>
      </View>

      {item &&
        item.additem &&
        item.additem.length > 0 &&
        item.additem.map((e, i) => {
          return (
            <View
              style={[
                styles.boxStyle,
                {
                  flexDirection: 'row',
                  marginVertical: themeConfig.margin,
                  alignItems: 'center',
                },
              ]}
              key={i}>
              <View style={styles.leftSection}>
                <Typography category="s1" style={{fontSize: 14}} status="basic">
                  {e && e.name && language === 'en' ? e.name : e.it}
                </Typography>
              </View>
              <View>
                <PlusMinusComponent
                  value={e && e.value ? e.value : 0}
                  style={{backgroundColor: 'transparent', borderWidth: 0}}
                  plusPress={() =>
                    updateCounter(e.name, 1, e, true, index, item)
                  }
                  minusPress={() =>
                    updateCounter(e.name, 0, e, true, index, item)
                  }
                />
              </View>
            </View>
          );
        })}

      <Divider
        style={{
          backgroundColor: themeConfig.colors.primary,
          borderWidth: 1.2,
          borderColor: themeConfig.colors.primary,
        }}
      />
    </Layout>
  );
};

export default BookFinalComponent;

const styles = StyleSheet.create({
  container: {flex: 1, margin: themeConfig.margin},
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
  icon: {
    width: 30,
    height: 30,
  },
});
