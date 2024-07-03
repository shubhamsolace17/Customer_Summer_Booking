import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import Typography from 'components/Typography';
import {strings} from 'i18n/i18n';
import {Layout, Divider} from '@ui-kitten/components';
import SelectComponent from 'components/Select';
import PlusMinusComponent from 'components/PlusMinus';
import Loader from 'components/Loader';
import themeConfig from 'configurations/Theme.configuration';

const PackageSelectorComponent = ({
  allPackageData,
  handleChange,
  addItemData,
  selectedIndex,
  updateCounter,
  peopleCount,
  loading,
  language,
  displayValue,
  additionalItems,
}) => {
  return (
    <Layout
      level="1"
      style={[styles.container, {marginTop: themeConfig.margin}]}>
      <View style={styles.boxStyle}>
        <Typography category="s1" style={{fontWeight: '500'}}>
          {strings('Choose_package')}
        </Typography>
      </View>
      <View
        style={[
          styles.boxStyle,
          {
            flexDirection: 'row',
            marginVertical: themeConfig.margin,
            marginTop: themeConfig.margin,
          },
        ]}>
        <View style={styles.leftSection}>
          <Typography category="s2" style={{fontWeight: '400'}} status="basic">
            Package
          </Typography>
        </View>

        <View style={styles.rightSection}>
          {allPackageData && allPackageData.length > 0 && (
            <SelectComponent
              selectedIndex={selectedIndex}
              onSelect={index => handleChange(index)}
              placeholder="Select Row"
              options={allPackageData}
              value={displayValue ? displayValue.title : 'Select Row'}
            />
          )}
        </View>
      </View>
      <View
        style={[
          styles.boxStyle,
          {
            flexDirection: 'row',
            marginVertical: themeConfig.margin,
            marginTop: themeConfig.margin,
          },
        ]}>
        <View style={styles.leftSection}>
          <Typography category="s2" style={{fontWeight: '400'}} status="basic">
            For
          </Typography>
        </View>
        <View style={styles.rightSection}>
          <Typography category="s2" status="basic">
            {peopleCount} People
          </Typography>
        </View>
      </View>
      <Loader color="#253C7E" visible={loading} />

      <View style={styles.boxStyle}>
        <Typography category="s1" style={{fontWeight: '500'}}>
          Additional Items
        </Typography>
      </View>
      {addItemData &&
        addItemData.length > 0 &&
        addItemData.map((item, index) => {
          return (
            <View
              style={[
                styles.boxStyle,
                {
                  flexDirection: 'row',
                  marginVertical: themeConfig.margin,
                  alignItems: 'center',
                },
              ]}>
              <View style={styles.leftSection}>
                <Typography
                  category="s2"
                  style={{fontWeight: '400'}}
                  status="basic">
                  {item && item.details && language === 'en'
                    ? item.details.name
                    : item.details.it}
                </Typography>
              </View>
              <View>
                <PlusMinusComponent
                  value={
                    additionalItems && additionalItems.length > 0
                      ? additionalItems[index] && additionalItems[index].value
                      : 0
                  }
                  plusPress={() =>
                    updateCounter(item.details.name, 1, item, true)
                  }
                  minusPress={() =>
                    updateCounter(item.details.name, 0, item, true)
                  }
                />
              </View>
            </View>
          );
        })}
      <Divider />
    </Layout>
  );
};

export default PackageSelectorComponent;

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    padding: 8 * 2,
    width: '100%',
    alignItems: 'center',
  },
  titleContainer: {
    padding: 8 * 2,
    borderBottomWidth: 1,
    borderBottomColor: '#253C7E',
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderRadius: 2,
    minWidth: '80%',
  },
});
