import React, {useState} from 'react';
import {Divider, Layout} from '@ui-kitten/components';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Image,
} from 'react-native';
import HeaderComponent from 'components/Header';
import themeConfig from 'configurations/Theme.configuration';
import Typography from 'components/Typography';
import ButtonComponent from 'components/Button';
import {ScrollView} from 'react-native-gesture-handler';
import SecondaryHeader from 'components/SecondaryHeader';
import InputComponent from 'components/Input';
import * as Yup from 'yup';
import {Formik} from 'formik';
//API
import Api from 'services/Api';
import {postDataToServer} from 'services/AuthApi';
//Translation
import {strings} from 'i18n/i18n';
import {requestMultiplePermission} from 'resources/permission.service';
import ImageSelectorComponent from './ImageSelector.component';
import ImagePicker from 'react-native-image-crop-picker';
import Toast from 'react-native-easy-toast';
import {List} from '@ui-kitten/components';
import Loader from 'components/Loader';
import {useSelector} from 'react-redux';

const mobileNoRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const propertySchema = Yup.object().shape({
  propertyName: Yup.string()
    .min(1, 'Too_short')
    .max(50, 'Too_long')
    .required('require_field'),
  city: Yup.string().min(1, 'Too_short').required('require_field'),
  fullName: Yup.string().min(1, 'Too_short').required('require_field'),
  mobileNo: Yup.string()
    .matches(mobileNoRegExp, 'ValidmobileNo')
    .min(9, 'Too_short')
    .max(9, 'Too_long')
    .required('require_field'),
  email: Yup.string().email('email_error').required('require_field'),
});

const ListOfPropertyScreen = ({navigation}) => {
  const [loading, setloading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [openModal, setOpenModal] = useState(false);
  const [changeLaneg, setchangeLaneg] = useState(false);
  const [uploadPhoto, setUploadPhoto] = useState([]);
  const [language] = useSelector(state => [state.globalReducerData.language]);

  const toast = React.useRef('');
  React.useEffect(async () => {
    const data = await requestMultiplePermission();
    if (data.complete) {
      // operation after sync up
    }
    const unsubscribe = navigation.addListener('focus', () => {
      forceUpdate();
      // loadData();
      // loaderUserData()
    });
    return () => {
      unsubscribe;
    };
  }, [navigation]);

  const onSubmit = async values => {
    if (uploadPhoto.length === 0) {
      toast.current.show(strings('selectImage'));
    } else {
      setloading(true);
      const imagrArray = [];
      const imageData = uploadPhoto.map(e => imagrArray.push(e.base64));
      const postData = {
        propertyName: values.propertyName,
        city: values.city,
        country: '',
        fullName: values.fullName,
        mobile: values.mobileNo,
        email: values.email,
        photos: imagrArray,
      };
      const {data, message, status} = await postDataToServer(
        `${Api.registerProperty}`,
        postData,
      );
      if (status) {
        toast.current.show(message);
        navigation.navigate('Dashboard');
        setloading(false);
      } else {
        setloading(false);
        let errorMessage = error ? error : message;
        setError(errorMessage);
      }
    }
  };

  const onPhotoSelect = async () => {
    const ImageList = [];
    setOpenModal(false);
    const data = await requestMultiplePermission();
    if (data.complete) {
      ImagePicker.openCamera({
        includeBase64: true,
        multiple: true,
      })
        .then(response => {
          ImageList.push({
            id: ImageList.length,
            filename: response.filename || '1',
            path: response.path,
            type: response.mime,
            data: response.data,
            base64: `data:image/jpeg;base64,${response.data}`,
          });
          setUploadPhoto([...uploadPhoto, ...ImageList]);
        })
        .catch(e => {
          console.log(e);
          // Alert.alert(e);
        });
    } else {
      toast.current.show(strings('allowPermission'));
    }
  };

  const onGallerySelect = async () => {
    const ImageList = [];
    setOpenModal(false);
    const data = await requestMultiplePermission();
    if (data.complete) {
      ImagePicker.openPicker({
        includeBase64: true,
        multiple: true,
        mediaType: 'photo',
      })
        .then(response => {
          response.map(image => {
            ImageList.push({
              id: ImageList.length,
              filename: image.filename || '1',
              path: image.path,
              type: image.mime,
              data: image.data,
              base64: `data:image/jpeg;base64,${image.data}`,
            });
            setUploadPhoto(ImageList);
          });
        })
        .catch(e => {
          console.log(e);
          // Alert.alert(e);
        });
    } else {
      toast.current.show(strings('allowPermission'));
    }
  };

  return (
    <Layout style={{flex: 1}} level="1">
      <HeaderComponent showBackButton />
      <ImageSelectorComponent
        open={openModal}
        onClose={() => setOpenModal(false)}
        onPhotoSelect={onPhotoSelect}
        onGallerySelect={onGallerySelect}
      />

      <Formik
        validationSchema={propertySchema}
        initialValues={{}}
        onSubmit={values => onSubmit(values)}>
        {({handleChange, handleBlur, handleSubmit, values, errors}) => (
          <>
            <ScrollView bounces={false}>
              <Layout
                level="1"
                style={[
                  styles.container,
                  {marginTop: themeConfig.margin},
                  styles.boxStyle,
                ]}>
                <InputComponent
                  label={strings('nameofproperty')}
                  caption={
                    errors.propertyName ? strings(`${errors.propertyName}`) : ''
                  }
                  onBlur={handleBlur('propertyName')}
                  status={errors.propertyName ? 'danger' : ''}
                  onChangeText={handleChange('propertyName')}
                />
                <InputComponent
                  label={strings('city')}
                  caption={errors.city ? strings(`${errors.city}`) : ''}
                  onBlur={handleBlur('city')}
                  status={errors.city ? 'danger' : ''}
                  onChangeText={handleChange('city')}
                />

                <InputComponent
                  label={strings('fullname')}
                  caption={errors.fullName ? strings(`${errors.fullName}`) : ''}
                  onBlur={handleBlur('fullName')}
                  status={errors.fullName ? 'danger' : ''}
                  onChangeText={handleChange('fullName')}
                />

                <InputComponent
                  label={strings('mobile_number')}
                  caption={errors.mobileNo ? strings(`${errors.mobileNo}`) : ''}
                  status={errors.mobileNo ? 'danger' : ''}
                  onBlur={handleBlur('mobileNo')}
                  onChangeText={handleChange('mobileNo')}
                  keyboardType="phone-pad"
                />

                <InputComponent
                  label={strings('email')}
                  caption={errors.email ? strings(`${errors.email}`) : ''}
                  onBlur={handleBlur('email')}
                  status={errors.email ? 'danger' : ''}
                  onChangeText={handleChange('email')}
                  keyboardType="email-address"
                />

                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={() => setOpenModal(true)}>
                  <Typography category="s1" style={styles.uploadText}>
                    {strings('uploadphotos')}
                  </Typography>
                </TouchableOpacity>
              </Layout>
              <Layout>
                <View
                  style={[
                    styles.boxStyle,
                    {
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: 'white',
                    },
                  ]}>
                  <List
                    horizontal
                    style={{backgroundColor: '#fff'}}
                    data={uploadPhoto}
                    renderItem={({item, index}) => {
                      return (
                        <Layout style={styles.itemParentContainer}>
                          <Image
                            style={{width: 50, height: 50}}
                            source={{
                              uri: `data:${item.type};base64,${item.data}`,
                            }}
                          />
                        </Layout>
                      );
                    }}
                    keyExtractor={(item, index) => index.toString()}
                  />
                </View>
              </Layout>

              <View
                style={{
                  alignSelf: 'center',
                  justifyContent: 'center',
                  flex: 1,
                }}>
                <Typography category="p1" status="danger">
                  {error}
                </Typography>
              </View>
            </ScrollView>

            <Layout>
              <Divider />
              <View
                style={[
                  styles.boxStyle,
                  {flexDirection: 'row', alignItems: 'center'},
                ]}>
                <View style={{flex: 1}}>
                  <ButtonComponent onPress={handleSubmit}>
                    {loading ? (
                      <ActivityIndicator
                        animating={loading}
                        style={{
                          alignSelf: 'center',
                          justifyContent: 'center',
                          flex: 1,
                        }}
                        size="large"
                        color="#fff"
                      />
                    ) : (
                      <>
                        <Typography
                          status="control"
                          category="h6"
                          style={{fontWeight: '400'}}>
                          {strings('save')}
                        </Typography>
                      </>
                    )}
                  </ButtonComponent>
                </View>
              </View>
            </Layout>
          </>
        )}
      </Formik>
      <Loader color="#fff" visible={changeLaneg} />
      <Toast
        ref={toast} //eslint-disable-line
        position="bottom"
        defaultCloseDelay={8000}
        positionValue={200}
      />
    </Layout>
  );
};
export default ListOfPropertyScreen;

const styles = StyleSheet.create({
  container: {flex: 1},
  boxStyle: {
    marginHorizontal: themeConfig.margin * 2,
  },
  navigationButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: themeConfig.radius,
    borderWidth: themeConfig.borderWidth,
    borderColor: themeConfig.colors.borderColor,
    padding: themeConfig.padding + 4,
    marginBottom: themeConfig.margin,
  },
  uploadButton: {
    borderRadius: themeConfig.radius * 4,
    borderColor: '#919191',
    backgroundColor: themeConfig.colors.primary,
    padding: 10,
    borderRadius: themeConfig.radius * 4,
    borderWidth: 1,
    marginTop: themeConfig.margin * 2,
  },
  uploadText: {
    marginHorizontal: themeConfig.margin,
    color: themeConfig.colors.white,
  },
  itemParentContainer: {
    flexDirection: 'column',
    marginRight: themeConfig.margin,
    padding: themeConfig.padding,
    marginTop: themeConfig.margin,
    backgroundColor: '#fff',
    borderWidth: themeConfig.borderWidth,
    borderColor: themeConfig.colors.primary,
  },
  itemContainer: {
    width: 130,
    borderRadius: themeConfig.radius / 2,
    overflow: 'hidden',
    marginRight: themeConfig.margin,
    position: 'relative',
    height: 80,
  },
  container: {
    marginVertical: themeConfig.margin,
  },
});
