import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {ContactIndex as ContactsView} from "./contacts/ContactIndex"
import { Login as LoginView} from './auth/Login';
import { createStackNavigator } from 'react-navigation';
import { AuthProvider } from './auth/AuthProvider';
import {ContactEdit as EditView} from "./contacts/ContactEdit"


export default class App extends React.Component {
  render() {
      return (
      <AuthProvider>
        <RootStack/>
       </AuthProvider>
      )
  }
}

const RootStack = createStackNavigator(
  {
    Contacts: {
      screen:ContactsView,
      navigationOptions: {
      header: null,
      }},
    ContactEdit:{
      screen:EditView,
      navigationOptions:{
        header:null,
      }},
    Login:{
      screen:LoginView,
      navigationOptions: {
        header: null,
        }},
    MainApp:{
      screen:App,
      navigationOptions: {
        header: null,
        }},
  },
  {
    initialRouteName: 'Contacts',
  }
);
