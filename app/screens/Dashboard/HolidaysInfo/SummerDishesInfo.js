import React from 'react';
import {Layout, Divider} from '@ui-kitten/components';
import {
  StyleSheet,
  View,
  Dimensions,
  Alert,
  ImageBackground,
} from 'react-native';
import HeaderComponent from 'components/Header';
import themeConfig from 'configurations/Theme.configuration';
import Typography from 'components/Typography';
import VerticalImageList from 'components/VerticalImageList';
import {ScrollView} from 'react-native-gesture-handler';
import I18n from 'react-native-i18n';
import {strings} from 'i18n/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GLOBAL from 'resources/constant';
//API
import Api from 'services/Api';
import {postDataToServer} from 'services/AuthApi';
//redux
import {useSelector} from 'react-redux';
import SubscribeComponent from '../Subscribe.component';
import SendEmailComponent from '../../Dashboard/HolidaysInfo/SendEmail.component';
import FaceBookClipboardComponent from '../../Dashboard/HolidaysInfo/FaceBookClipboard.component';
import CustomSkeletonList from 'components/CustomSkeleton';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const SummerDishesInfo = ({navigation}) => {
  const [loading, setloading] = React.useState(false);
  const [summerDishes, setSummerDishes] = React.useState([]);
  var originalArray = GLOBAL.idearsInsipraton.slice(0);
  const [language, userProfile] = useSelector(state => [
    state.globalReducerData.language,
    state.UserReducerData.userProfile,
  ]);
  const toast = React.useRef('');

  const loadData = async () => {
    //setloading(true);

    const locale = await AsyncStorage.getItem('selectedLocale');
    I18n.locale = locale;

    var arr = originalArray.splice(1, 1);
    setSummerDishes(originalArray);
  };

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });
    return () => {
      unsubscribe;
    };
  }, [navigation]);
  const onSubscribe = async values => {
    setloading(true);
    const postData = {
      email: values.email,
    };
    console.log('postData', postData);
    const {data, message, error, success, sucess} = await postDataToServer(
      `${Api.createSubscribe}`,
      postData,
    );
    console.log(data, success);
    if (sucess) {
      Alert.alert(
        strings('success'),
        strings('newsletter_message'),
        [
          {
            text: strings('ok'),
            onPress: () => {
              setloading(false);
            },
            style: strings('cancel'),
          },
        ],
        {
          cancelable: false,
        },
      );
    } else {
      let errorMessage = error ? error : message;
      setloading(false);
      toast.current.show(errorMessage);
    }
  };

  return (
    <Layout style={{flex: 1, bottom: 10}}>
      <HeaderComponent showBackButton />
      <Divider />
      {loading ? (
        <>
          <CustomSkeletonList />
          <CustomSkeletonList />
        </>
      ) : (
        <>
          <ScrollView
            bounces={false}
            nestedScrollEnabled={false}
            contentContainerStyle={{paddingBottom: windowHeight / 8}}>
            <Layout level="1">
              <Typography
                category="h6"
                style={{
                  marginVertical: themeConfig.margin,
                  marginHorizontal: themeConfig.margin,
                  padding: themeConfig.padding + 2,
                  fontSize: 28,
                }}>
                {strings('the_best_summer_dishes_to_take_to_the_beach')}
              </Typography>
              <View
                style={{
                  borderBottomColor: themeConfig.colors.primary,
                  borderBottomWidth: 3,
                  width: '40%',
                  marginLeft: 25,
                }}
              />
              <Layout style={styles.boxStyle}>
                <Typography
                  style={{
                    marginVertical: themeConfig.margin + 15,
                    fontSize: 16,
                  }}>
                  {strings('what_are_the_most_practical_cold_dishes_to')}
                </Typography>
              </Layout>

              <Layout style={styles.boxStyle}>
                <Typography
                  style={{
                    marginVertical: themeConfig.margin,
                    fontSize: 16,
                  }}>
                  {strings('subscribe_to_newsLetter')}
                </Typography>
              </Layout>
              <SendEmailComponent onSumbit={values => onSubscribe(values)} />
              <Layout style={styles.boxStyle}>
                <Layout>
                  <ImageBackground
                    source={require('../../../resources/images/dish1.png')}
                    resizeMode="cover"
                    style={styles.mainImage}
                  />
                  <Typography
                    style={{
                      marginVertical: themeConfig.margin + 15,
                      fontSize: 16,
                      color: '#000',
                    }}>
                    {strings(
                      'the_desire_to_enjoy_the_sea_to_relax_lying_in_the_shade',
                    ) +
                      '\n \n' +
                      strings('but_hunger_also_comes_to_the_beach') +
                      '\n \n' +
                      strings(
                        'so_what_to_bring_to_the_beach_in_the_cooler_bag',
                      )}
                  </Typography>
                </Layout>
                <Layout>
                  <ImageBackground
                    source={require('../../../resources/images/dish2.png')}
                    resizeMode="cover"
                    style={styles.mainImage}
                  />
                  <Typography
                    style={{
                      marginVertical: themeConfig.margin + 15,
                      fontSize: 16,
                      color: '#000',
                    }}>
                    {strings(
                      'the_choice_will_be_clearly_varied_as_it_willr_flect_the_many_tastes_of_us_Italians',
                    ) +
                      '\n \n' +
                      strings(
                        'in_any_case_whatever_our_choice_will_be_aving_a_meal_under_a_beach_umbrella',
                      ) +
                      '\n \n' +
                      strings(
                        'the_best_choice_will_be_to_focus_on_vegetables',
                      ) +
                      '\n \n' +
                      strings(
                        'if_it_is_impossible_to_eliminate_carbohydrates',
                      ) +
                      '\n \n' +
                      strings(
                        'this_represents_a_practical_solution_for_lunch_to',
                      )}
                  </Typography>
                </Layout>
                <Layout>
                  <ImageBackground
                    source={require('../../../resources/images/dish3.png')}
                    resizeMode="cover"
                    style={styles.mainImage}
                  />

                  <Typography
                    style={{
                      marginVertical: themeConfig.margin + 15,
                      fontSize: 16,
                      color: '#000',
                    }}>
                    {strings(
                      'as_an_alternative_to_pasta_we_could_opt_for_the_classic_healthy',
                    ) +
                      '\n' +
                      strings('a_further_alternative_is_couscous')}
                  </Typography>
                </Layout>
                <Layout>
                  <ImageBackground
                    source={require('../../../resources/images/dish4.png')}
                    resizeMode="cover"
                    style={styles.mainImage}
                  />

                  <Typography
                    style={{
                      marginVertical: themeConfig.margin + 15,
                      fontSize: 16,
                      color: '#000',
                    }}>
                    {strings(
                      'as_a_second_course_a_simple_and_fresh_caprese_salad',
                    )}
                  </Typography>
                </Layout>
                <Layout>
                  <ImageBackground
                    source={require('../../../resources/images/dish5.png')}
                    resizeMode="cover"
                    style={styles.mainImage}
                  />

                  <Typography
                    style={{
                      marginVertical: themeConfig.margin + 15,
                      fontSize: 16,
                      color: '#000',
                    }}>
                    {strings('and_what_about_a_second_course_balanced_in_the')}
                  </Typography>
                </Layout>
                <Layout>
                  <ImageBackground
                    source={require('../../../resources/images/dish6.png')}
                    resizeMode="cover"
                    style={styles.mainImage}
                  />

                  <Typography
                    style={{
                      marginVertical: themeConfig.margin + 15,
                      fontSize: 16,
                      color: '#000',
                    }}>
                    {strings('with_a_little_more_imagination_we_can_prepare') +
                      '\n' +
                      strings(
                        'an_alternative_to_sandwiches_are_focaccia_stuffed_with',
                      )}
                  </Typography>
                </Layout>
                <Layout>
                  <ImageBackground
                    source={require('../../../resources/images/dish7.png')}
                    resizeMode="cover"
                    style={styles.mainImage}
                  />

                  <Typography
                    style={{
                      marginVertical: themeConfig.margin + 15,
                      fontSize: 16,
                      color: '#000',
                    }}>
                    {strings(
                      'another_classic_are_omelettes_to_fill_sandwiches_or_to_create_new',
                    )}
                  </Typography>
                </Layout>
                <Layout>
                  <ImageBackground
                    source={require('../../../resources/images/dish8.png')}
                    resizeMode="cover"
                    style={styles.mainImage}
                  />

                  <Typography
                    style={{
                      marginVertical: themeConfig.margin + 15,
                      fontSize: 16,
                      color: '#000',
                    }}>
                    {strings(
                      'an_even_fresher_and_lighter_idea_are_fruit_salads_melon',
                    ) +
                      '\n' +
                      strings(
                        'and_if_you_want_to_stay_light_the_ideal_is_the_fruit_dish',
                      )}
                  </Typography>
                </Layout>
                <Layout>
                  <ImageBackground
                    source={require('../../../resources/images/dish9.png')}
                    resizeMode="cover"
                    style={styles.mainImage}
                  />
                  <Typography
                    style={{
                      marginVertical: themeConfig.margin + 15,
                      fontSize: 16,
                      color: '#000',
                    }}>
                    {strings(
                      'finally_not_forget_to_bring_rigorously_biodegradable_plates_cutlery_and_glasses',
                    )}
                  </Typography>
                </Layout>
              </Layout>
              <FaceBookClipboardComponent
                onSumbit={values => onSubscribe(values)}
              />

              <Layout style={styles.boxStyle}>
                <VerticalImageList
                  isTwoRow
                  iconName="BeachUmbrella"
                  title={
                    strings('check_out_other_articles_from_the_blog') +
                    '\n' +
                    strings('ideas_and_inspiration_for_your_summer_holidays')
                  }
                  onPress={item => {
                    console.log('item', item), navigation.navigate(item.url);
                  }}
                  data={summerDishes}
                />
              </Layout>
            </Layout>
            <SubscribeComponent onSumbit={values => onSubscribe(values)} />
          </ScrollView>
        </>
      )}
    </Layout>
  );
};
export default React.memo(SummerDishesInfo);

const styles = StyleSheet.create({
  boxStyle: {
    marginHorizontal: themeConfig.margin * 2,
  },
  discountBoxStyle: {
    backgroundColor: '#D8E2FF',
    padding: themeConfig.padding,
    margin: themeConfig.padding,
    borderRadius: themeConfig.radius * 5,
    marginVertical: themeConfig.margin,
  },
  mainImage: {
    flex: 1,
    height: windowWidth / 2,
    width: '100%',
    resizeMode: 'cover',
    marginVertical: 10,
  },
  subscibeBoxStyle: {
    backgroundColor: '#D8E2FF',
    padding: themeConfig.padding * 2,
    // justifyContent:"center"
  },
});
