import React, {Component} from 'react';
import {Text, View, ScrollView, ActivityIndicator, StyleSheet, Button, TouchableOpacity, Image } from 'react-native';
import {getLogger, issueToText} from '../core/utils'
import {Consumer} from './context';
import {ContactView} from './ContactView'
import {List, ListItem, Right} from 'native-base'
import { StackActions, NavigationActions } from 'react-navigation';
import { AsyncStorage } from "react-native"
// import RNShakeEvent from 'react-native-shake-event'
// import  {
//     DeviceEventEmitter // will emit events that you can listen to
//   } from 'react-native';
  
//   import { SensorManager } from 'NativeModules';
//   import {
//     accelerometer,
//     gyroscope,
//     setUpdateIntervalForType,
//     SensorTypes
//   } from "react-native-sensors";

const log=getLogger('ContactList');


export class ContactList extends Component
{
    constructor(props)
    {
        super(props);
        this.state={
            updateFunction:null,
            
        }
    }

    
    

        componentWillUnmount() 
        {
            // RNShakeEvent.removeEventListener('shake');
          }

    render()
    {
        console.log('contact list render')
        return(
            <Consumer>
             {(state)=>{

if(this.props.webSocket!==null && !this.state.messageRequested){
    this.props.webSocket.messageNotification((message) => {
        console.log("Message from backend", message);
        state.load(state.eTag);
    });
    this.setState({messageRequested:true});
}
     return(
                <ScrollView>
                    {console.log("state",state.contacts)}
                    <ActivityIndicator size="large" animating={state.isLoading}/>
                    {state.issue && <Text>{issueToText(state.mapissue)}</Text>}
                    <List>
                        {state.contacts && Object.values(state.contacts).map((contact,key) => <ContactView key={key} contact={contact} updateFunction={state.editFunction} toEdit={this.toEdit}/>)}
                    </List>
                    <Button
                        style={styles.buttonLogin}
                            onPress={() => this.logout()}
                        title="Logout"
                        >
                    </Button>
                </ScrollView>

             )}
            }
            </Consumer>
        );


    }
    
    toEdit=(contact,updateFunction)=>{
        console.log("edit pressed");
        console.log(updateFunction);
        this.props.navigation.navigate('ContactEdit',{
            contact:contact,
            updateFunction: updateFunction
        });
    }

    logout=()=>{
        Promise.all([
        this.removeItemValue('token'),
        this.removeItemValue('contacts'),
        this.removeItemValue('eTag')
        ]).then(()=>{
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'MainApp' })],
          });
          this.props.navigation.dispatch(resetAction);
        })
    }

    async removeItemValue(key) {
        try {
          await AsyncStorage.removeItem(key);
        }
        catch(exception) {
            console.log("error remove item "+exception);
        }
      }
}

const styles = StyleSheet.create({
    bold: {
        fontWeight: 'bold'
    },
    header: {
        flex: 1
    },
    label: {
        width: '100%'
    },
    listItem: {
        marginLeft: 0,
        paddingLeft: 10,
        flexDirection: 'column',
        height:70
    }

    
});