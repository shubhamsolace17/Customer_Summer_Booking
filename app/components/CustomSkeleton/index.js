import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import themeConfig from 'configurations/Theme.configuration';

const CustomSkeletonList = () => {
  return (
    <SkeletonPlaceholder speed={300}>
      <View style={styles.CustomSkeletonContiner}>
        <View style={styles.CustomSkeletonListView} />
        <View style={styles.CustomSkeletonListView} />
        <View style={styles.CustomSkeletonListView} />
        <View style={styles.CustomSkeletonListView} />
        <View style={styles.CustomSkeletonListView} />
        <View style={styles.CustomSkeletonListView} />
        <View style={styles.CustomSkeletonListView} />
        <View style={styles.CustomSkeletonListView} />
        <View style={styles.CustomSkeletonListView} />
        <View style={styles.CustomSkeletonListView} />
        <View style={styles.CustomSkeletonListView} />
      </View>
    </SkeletonPlaceholder>
  );
};

const styles = StyleSheet.create({
  CustomSkeletonContiner: {
    alignItems: 'flex-start',
    alignContent: 'flex-start',
    alignSelf: 'flex-start',
  },
  CustomSkeletonListView: {
    minWidth: '95%',
    height: 40,
    borderRadius: themeConfig.radius,
    margin: themeConfig.margin - 4,
  },
});
export default CustomSkeletonList;
