import React, {useState} from 'react';
import {Image, StyleSheet, ActivityIndicator} from 'react-native';

const HeroImage = ({uri, asset, height, style = {}, ...rest}) => {
  let [loaded, setLoaded] = useState(false);
  let source = asset ? asset : {uri};
  return (
    <>
      {!loaded ? (
        <ActivityIndicator style={[styles.image, {height}, style]} />
      ) : null}
      <Image
        style={loaded ? [styles.image, {height}, style] : [styles.loading]}
        source={source}
        onLoadEnd={() => setLoaded(true)}
        {...rest}
      />
    </>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
  },
  loading: {
    opacity: 0,
    width: '100%',
    height: 1,
  },
});

export default HeroImage;
