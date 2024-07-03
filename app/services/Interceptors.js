import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';

export default {
  setupInterceptors: async () => {
    axios.interceptors.request.use(
      async config => {
        const configuration = config;
        // if ((configuration.url.indexOf('employees/create') > -1) || configuration.url.indexOf('employees/create') > -1) {
        //   // configuration.headers['Content-Type'] = 'multipart/form-data'; // eslint-disable-line
        // } else {
        //   configuration.headers['Content-Type'] = 'application/json'; // eslint-disable-line
        // }
      configuration.headers['Content-Type'] = 'application/json'; // eslint-disable-line
        configuration.headers.Accept = '*/*';
        configuration.headers.source = 'app';
        const token = await AsyncStorage.getItem('auth-token');
        if (token) {
          configuration.headers['x-access-token'] = `${token}`;
        }
        return configuration;
      },
      error => Promise.reject(error),
    );
    axios.interceptors.response.use(
      response => response,
      error => Promise.reject(error),
    );
  },
};
