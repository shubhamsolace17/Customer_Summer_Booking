import React from 'react';
import {StyleSheet, View} from 'react-native';
import Typography from 'components/Typography';
import themeConfig from 'configurations/Theme.configuration';
import PlusMinusComponent from 'components/PlusMinus';

const SelectAddItemConsumer = ({
  data,
  additionalItems,
  updateCounter = () => {},
}) => {
  return (
    <>
      {data &&
        data.map((e, i) => {
          return (
            <View
              style={[
                styles.boxStyle,
                {
                  flexDirection: 'row',
                  marginVertical: themeConfig.margin,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                },
              ]}>
              <View style={styles.leftSection}>
                <Typography
                  category="s1"
                  style={{fontWeight: '400'}}
                  status="basic">
                  {e.details ? e.details.name : e.details.it}
                </Typography>
              </View>
              <View>
                <PlusMinusComponent
                  value={
                    additionalItems && additionalItems.length > 0
                      ? additionalItems[i].value
                      : 0
                  }
                  plusPress={() => updateCounter(e.title, 1, e, true, i, e)}
                  minusPress={() => updateCounter(e.title, 0, e, true, i, e)}
                />
              </View>
            </View>
          );
        })}
    </>
  );
};

export default SelectAddItemConsumer;

const styles = StyleSheet.create({
  leftSection: {
    // flex: 1,
    width: 100,
  },
  rightSection: {
    flex: 1,
  },
  layoutContainer: {
    backgroundColor: themeConfig.colors.lightBule,
    padding: themeConfig.padding * 2,
    marginTop: themeConfig.margin,
  },
  boxStyle: {
    marginHorizontal: themeConfig.margin,
  },
});
