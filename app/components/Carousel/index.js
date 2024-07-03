import HeroImage from 'components/HeroImage';
import Typography from 'components/Typography';
import themeConfig from 'configurations/Theme.configuration';
import {chunk} from 'lodash';
import React, {useState} from 'react';
import {useRef} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';

const data = [
  {
    image:
      'https://i.picsum.photos/id/0/5616/3744.jpg?hmac=3GAAioiQziMGEtLbfrdbcoenXoWAW-zlyEAMkfEdBzQ',
  },
  {
    image:
      'https://i.picsum.photos/id/100/2500/1656.jpg?hmac=gWyN-7ZB32rkAjMhKXQgdHOIBRHyTSgzuOK6U0vXb1w',
  },
  {
    image:
      'https://i.picsum.photos/id/1011/5472/3648.jpg?hmac=Koo9845x2akkVzVFX3xxAc9BCkeGYA9VRVfLE4f0Zzk',
  },
  {
    image:
      'https://i.picsum.photos/id/1015/6000/4000.jpg?hmac=aHjb0fRa1t14DTIEBcoC12c5rAXOSwnVlaA5ujxPQ0I',
  },
  {
    image:
      'https://i.picsum.photos/id/1023/3955/2094.jpg?hmac=AW_7mARdoPWuI7sr6SG8t-2fScyyewuNscwMWtQRawU',
  },
  {
    image:
      'https://i.picsum.photos/id/1002/4312/2868.jpg?hmac=5LlLE-NY9oMnmIQp7ms6IfdvSUQOzP_O3DPMWmyNxwo',
  },
  {
    image:
      'https://i.picsum.photos/id/101/2621/1747.jpg?hmac=cu15YGotS0gIYdBbR1he5NtBLZAAY6aIY5AbORRAngs',
  },
];

const IMAGE_HEIGHT = 196;
const MAX_SHOW_THUMBNAIL = 4;
const THUMBNAIL_HEIGHT = 50;
const CarouselComponent = data => {
  const [fistArray] =
    data.data.length > MAX_SHOW_THUMBNAIL
      ? chunk(data.data, Math.ceil(data.data.length / 2))
      : [data.data];
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef();
  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity style={styles.itemContainer} onPress={() => {}}>
        <View style={styles.imageContainer}>
          <HeroImage
            uri={item}
            height={IMAGE_HEIGHT}
            style={styles.imageStyle}
          />
        </View>
      </TouchableOpacity>
    );
  };
  const windowWidth = Dimensions.get('window').width;
  const calculatedWidth = windowWidth / 1.1 - themeConfig.margin * 2;
  // const calculatedWidth = windowWidth - themeConfig.margin;
  const showCount = data.data.length > fistArray.length;
  return (
    <View style={{justifyContent: 'space-between'}}>
      <View style={{height: IMAGE_HEIGHT + 6}}>
        <Carousel
          ref={c => (sliderRef.current = c)}
          data={data.data}
          renderItem={renderItem}
          sliderWidth={calculatedWidth}
          itemWidth={calculatedWidth}
          firstItem={currentIndex}
          removeClippedSubviews={true}
          inactiveSlideScale={0.94}
          inactiveSlideOpacity={0.7}
          lockScrollWhileSnapping={true}
          loop={true}
          loopClonesPerSide={5}
          autoplay={true}
          autoplayDelay={100}
          autoplayInterval={5000}
          onSnapToItem={setCurrentIndex}
        />
        {data.data.length > 1 ? (
          <View style={styles.paginationParent}>
            <Pagination
              dotsLength={data.data.length}
              activeDotIndex={currentIndex}
              containerStyle={styles.paginationContainer}
              dotColor={themeConfig.colors.primary}
              dotStyle={styles.paginationDot}
              dotContainerStyle={{
                marginHorizontal: themeConfig.margin / 2,
                paddingBottom: themeConfig.padding,
              }}
              inactiveDotColor={themeConfig.colors.white}
              inactiveDotOpacity={1}
              inactiveDotScale={0.8}
              carouselRef={sliderRef.current}
              tappableDots={!!sliderRef.current}
            />
          </View>
        ) : null}
      </View>
      <View
        style={[
          styles.thumbnailContainer,
          {justifyContent: showCount ? 'space-between' : 'flex-start'},
        ]}>
        <ScrollView
          bounces={false}
          horizontal
          showsHorizontalScrollIndicator={false}>
          {fistArray &&
            fistArray.length > 0 &&
            fistArray.map((item, index) => {
              const isLastIndex = fistArray.length === index + 1;

              return (
                <TouchableOpacity
                  onPress={() => {
                    // if (isLastIndex) {
                    //   return;
                    // }
                    return sliderRef.current.snapToItem(index);
                  }}
                  style={[
                    styles.thumbnailImageStyle,
                    {
                      width: windowWidth / MAX_SHOW_THUMBNAIL - 20,
                      marginRight: showCount ? 0 : themeConfig.margin * 2,
                      borderRadius: themeConfig.radius * 2,
                      paddingVertical: themeConfig.padding - 4,
                    },
                  ]}
                  key={index}>
                  {showCount && isLastIndex ? (
                    <View style={styles.countContainer}>
                      <Typography category="s1">
                        {data.data.length - fistArray.length}+
                      </Typography>
                    </View>
                  ) : null}
                  <HeroImage
                    style={styles.imageUrl}
                    uri={item}
                    height={THUMBNAIL_HEIGHT}
                  />
                </TouchableOpacity>
              );
            })}
        </ScrollView>
      </View>
    </View>
  );
};

export default CarouselComponent;

const styles = StyleSheet.create({
  container: {flex: 1},
  thumbnailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: themeConfig.radius,
    overflow: 'hidden',
    marginLeft: themeConfig.margin / 2,
  },
  thumbnailImageStyle: {
    position: 'relative',
  },
  countContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 1,
    height: '100%',
    width: '100%',
  },
  itemContainer: {
    borderRadius: themeConfig.radius,
  },
  imageContainer: {
    height: IMAGE_HEIGHT,
    overflow: 'hidden',
    borderRadius: themeConfig.radius,
  },
  imageStyle: {
    height: IMAGE_HEIGHT,
    width: '100%',
    resizeMode: 'cover',
  },
  paginationDot: {
    width: themeConfig.radius + 4,
    height: themeConfig.radius + 4,
    borderRadius: themeConfig.radius,
  },
  paginationParent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: -18,
  },
  loading: {
    opacity: 0,
    width: '100%',
    height: 1,
  },
  imageUrl: {
    borderRadius: themeConfig.radius,
  },
});
