import React, {useState, useEffect, useRef} from 'react';
import {Divider, Layout} from '@ui-kitten/components';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import HeaderComponent from 'components/Header';
import themeConfig from 'configurations/Theme.configuration';
import Typography from 'components/Typography';
import ButtonComponent from 'components/Button';
import {ScrollView} from 'react-native-gesture-handler';
import SecondaryHeader from 'components/SecondaryHeader';
import InputComponent from 'components/Input';
import SelectComponent from 'components/Select';
import SVGIcon from 'components/Icon';
import {strings} from 'i18n/i18n';

//API
import Api from 'services/Api';
import {postDataToServer} from 'services/AuthApi';
import Toast from 'react-native-easy-toast';

import {useSelector} from 'react-redux';
import CustomSkeletonList from 'components/CustomSkeleton';

const CardDetailsScreen = ({navigation}) => {
  const [showAddCard, setShowAddcard] = useState(false);
  const [userProfile, language] = useSelector(state => [
    state.UserReducerData.userProfile,
    state.globalReducerData.language,
  ]);
  const [creditCards, setCreditCard] = useState([]);
  const [loading, setloading] = useState(false);
  const toast = useRef('');

  const AddNewCard = () => {
    return (
      <View style={{flex: 1}}>
        <InputComponent placeholder="Cardholder's Name" />
        <InputComponent placeholder="Card Number" />
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{flexDirection: 'row'}}>
            <SelectComponent
              onSelect={() => {}}
              label={
                <Typography category="c1" status="basic">
                  Valid thru
                </Typography>
              }
              placeholder="MM"
              options={Array(12)
                .fill()
                .map((_, index) => ({title: index + 1}))}
            />
            <SelectComponent
              style={{marginHorizontal: themeConfig.margin}}
              label={<Typography category="c1" status="basic" />}
              onSelect={() => {}}
              placeholder="YY"
              options={Array(20)
                .fill()
                .map((_, index) => ({title: index + 2021}))}
            />
          </View>
          <View style={{marginTop: themeConfig.margin + 3}}>
            <InputComponent
              placeholder="CVV"
              leftIcon={true}
              iconType="Question"
            />
          </View>
        </View>
      </View>
    );
  };

  const CardList = () => {
    return (
      <View style={{flex: 1}}>
        {creditCards && creditCards.length > 0 ? (
          <ScrollView bounces={false}>
            {creditCards &&
              creditCards.map((card, i) => {
                return (
                  <View key={card.number} style={styles.navigationButton}>
                    <Typography
                      status="basic"
                      category="s2"
                      style={{fontWeight: '400'}}>
                      {`xxxx xxxx xxxx ${card.last4}`}
                    </Typography>
                    <TouchableOpacity onPress={() => confirmRemoveCards(card)}>
                      <SVGIcon type="Delete" width={16} height={16} />
                    </TouchableOpacity>
                  </View>
                );
              })}
          </ScrollView>
        ) : (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Typography
              status="basic"
              category="s2"
              style={{
                fontWeight: '500',
                fontSize: 14,
                marginHorizontal: themeConfig.margin * 2,
              }}>
              {strings('no_card_found')}
            </Typography>
          </View>
        )}

        <ButtonComponent
          onPress={() => setShowAddcard(true)}
          appearance="outline"
          style={{
            flex: 1,
            marginRight: themeConfig.margin,
            marginVertical: themeConfig.margin * 2,
            width: '60%',
            borderRadius: themeConfig.radius * 4,
            backgroundColor: 'transparent',
            alignSelf: 'center',
          }}
          size="small">
          <Typography category="s2">{strings('add_card')}</Typography>
        </ButtonComponent>
      </View>
    );
  };
  const loadData = async () => {
    setloading(true);
    const postData = {
      userId: userProfile.id,
    };
    const {data, error, message, status} = await postDataToServer(
      `${Api.getCardDeatils}`,
      postData,
    );
    if (status) {
      if (data && data.data && data.data.data && data.data.data.length > 0) {
        setCreditCard(data.data.data);
      }
      setloading(false);
    } else {
      setloading(false);
      if (error) {
        let errorMessage = error ? error : message;
        toast.current.show(errorMessage);
      }
    }
  };
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });
    return () => {
      unsubscribe;
    };
  }, [navigation]);

  return (
    <Layout style={{flex: 1, backgroundColor: '#F6F6F6'}} level="1">
      <HeaderComponent showBackButton />
      {loading && (
        <>
          <CustomSkeletonList />
          <CustomSkeletonList />
        </>
      )}

      {!loading && (
        <>
          <View
            style={{
              flexDirection: 'row',
              marginHorizontal: themeConfig.margin * 2,
              margin: themeConfig.margin,
              alignItems: 'center',
            }}>
            <SVGIcon
              type="Card"
              color={themeConfig.colors.primary}
              width={themeConfig.margin * 6}
              height={themeConfig.margin * 6}
            />
            <Typography
              status="basic"
              category="h3"
              style={{
                fontWeight: '500',
                color: themeConfig.colors.primary,
                fontSize: 16,
                marginHorizontal: themeConfig.margin * 2,
              }}>
              {strings('my_card')}
            </Typography>
          </View>
          <ScrollView bounces={false}>
            <Layout
              level="1"
              style={[
                styles.container,
                {
                  marginTop: themeConfig.margin,
                  borderRadius: themeConfig.radius * 2,
                  padding: themeConfig.padding * 2,
                  shadowColor: '#000000',
                  shadowOffset: {width: 0, height: 1},
                  shadowOpacity: 0.2,
                  shadowRadius: 2,
                  elevation: 2,
                },
                styles.boxStyle,
              ]}>
              {showAddCard ? <AddNewCard /> : <CardList />}
            </Layout>

            <Layout
              style={{
                backgroundColor: '#F6F6F6',
                margin: themeConfig.margin * 2,
              }}>
              <Divider />
              <View
                style={[
                  styles.boxStyle,
                  {
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                ]}>
                <ButtonComponent
                  onPress={() => navigation.goBack()}
                  style={{
                    marginRight: themeConfig.margin,
                    borderRadius: themeConfig.radius * 4,
                    flex: 1,
                  }}
                  size="large">
                  {strings('cancel')}
                </ButtonComponent>

                <ButtonComponent
                  onPress={() => setShowAddcard(!showAddCard)}
                  style={{
                    marginRight: themeConfig.margin,
                    borderRadius: themeConfig.radius * 4,
                    flex: 1,
                  }}
                  size="large">
                  {strings('save')}
                </ButtonComponent>
              </View>
            </Layout>
          </ScrollView>
        </>
      )}
      <Toast
        ref={toast} //eslint-disable-line
        position="bottom"
        defaultCloseDelay={8000}
        positionValue={200}
      />
    </Layout>
  );
};
export default CardDetailsScreen;

const styles = StyleSheet.create({
  container: {flex: 1},
  boxStyle: {
    marginHorizontal: themeConfig.margin,
  },
  leftSection: {
    width: 100,
    marginBottom: themeConfig.margin / 2,
  },
  rightSection: {
    flex: 1,
    marginBottom: themeConfig.margin / 2,
  },
  navigationButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: themeConfig.radius * 4,
    borderWidth: themeConfig.borderWidth,
    borderColor: themeConfig.colors.borderColor,
    padding: themeConfig.padding + 4,
    marginBottom: themeConfig.margin,
    marginVertical: themeConfig.margin,
  },
});
