/**
 * @format
 */
import 'react-native-gesture-handler';
import {AppRegistry, TextInput, LogBox} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
LogBox.ignoreAllLogs = true;
LogBox.ignoreLogs(['VirtualizedLists Should Never Be Nested']);
AppRegistry.registerComponent(appName, () => App);
