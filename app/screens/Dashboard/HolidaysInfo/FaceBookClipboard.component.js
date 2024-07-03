import React from 'react';
import {Layout} from '@ui-kitten/components';
import {StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import themeConfig from 'configurations/Theme.configuration';
import SVGIcon from 'components/Icon';
import Clipboard from '@react-native-clipboard/clipboard';
import {ShareDialog} from 'react-native-fbsdk';

//API

import * as Yup from 'yup';
import {Formik} from 'formik';

const Schema = Yup.object().shape({
  email: Yup.string().email('email_error').required('emailVal'),
});

const FaceBookClipboardComponent = ({onSumbit = () => {}}) => {
  const [copiedText, setCopiedText] = React.useState('');

  const copyToClipboard = () => {
    console.log('click');
    Clipboard.setString(
      'Hello, Please check our page for Italian holidays ideas and summary \n \n Thank you..!!',
    );
  };

  const fetchCopiedText = async () => {
    const text = await Clipboard.getString();
    setCopiedText(text);
  };

  //facebook
  const shareLinkContent = {
    contentType: 'link',
    contentUrl: 'https://development.summerbooking.it/home',
    quote:
      'Hello, Please check our page for Italian holidays ideas and summary \nThank You..!!',
  };
  return (
    <Formik
      validationSchema={Schema}
      initialValues={{}}
      onSubmit={values => onSumbit(values)}>
      {({handleChange, handleBlur, handleSubmit, values, errors}) => (
        <ScrollView bounces={false}>
          <Layout id="fbClipboard" style={styles.subscibeBoxStyle}>
            <Layout style={styles.sendBoxStyle}>
              <TouchableOpacity
                style={[
                  styles.icon,
                  {
                    width: 45,
                    height: 45,
                    margin: 15,
                    borderRadius: 25,
                  },
                ]}
                onPress={() => ShareDialog.show(shareLinkContent)}>
                <SVGIcon type="FacebookRound" width={25} height={25} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.icon,
                  {
                    width: 45,
                    height: 45,
                    margin: 15,
                    borderRadius: 25,
                  },
                ]}
                onPress={() => copyToClipboard()}>
                <SVGIcon type="Clipboard" width={25} height={25} />
              </TouchableOpacity>
            </Layout>
          </Layout>
        </ScrollView>
      )}
    </Formik>
  );
};
export default FaceBookClipboardComponent;

const styles = StyleSheet.create({
  subscibeBoxStyle: {
    backgroundColor: '#FFF',
    padding: themeConfig.padding * 2,
    // justifyContent:"center"
  },
  sendBoxStyle: {
    flexDirection: 'row',
  },
});
