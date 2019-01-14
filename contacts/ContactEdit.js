import React, { Component } from 'react';
import {Text, TextInput, View,ScrollView, ActivityIndicator, StyleSheet, Button, TouchableOpacity, Image } from 'react-native';


export class ContactEdit extends Component {
    constructor(props) {
      super(props);
      var contact = this.props.navigation.getParam('contact','');
      this.state={
          Firstname:contact.Firstname,
          Lastname:contact.Lastname,
          PhoneNumber:contact.PhoneNumber,
          WorkNumber: contact.WorkNumber,
          Id: contact.Id
      }
    }
  
    onEdit(){
        var edit = this.props.navigation.getParam('updateFunction');
        edit(this.state.Id,this.state.Firstname,this.state.Lastname,this.state.PhoneNumber,this.state.WorkNumber);
    }

    render() {
      
        
      return (
        
        <View style={{marginTop:30}}>
            <Text> Contact Details </Text>

            <Text> First Name: </Text>
            <TextInput
                style={{height: 40, marginBottom:10}}
                onChangeText={(text) => this.setState({Firstname:text})}
                value={this.state.Firstname}
            />

            <Text> Last Name: </Text>
            <TextInput
                style={{height: 40, marginBottom:10}}
                onChangeText={(text) => this.setState({Lastname:text})}
                value={this.state.Lastname}
            />

            <Text> Phone Number: </Text>
            <TextInput
                style={{height: 40, marginBottom:10}}
                onChangeText={(text) => this.setState({PhoneNumber:text})}
                value={this.state.PhoneNumber}
            />

            <Text> Work Number: </Text>
            <TextInput
                style={{height: 40, marginBottom:10}}
                onChangeText={(text) => this.setState({WorkNumber:text})}
                value={this.state.WorkNumber}
            />
            <Button
                style={styles.buttonLogin}
                    onPress={() => this.onEdit()}
                title ="Save"
                >
            </Button>
        </View>
      );
    }
  }
  
const styles = StyleSheet.create({
    buttonLogin:{
        width:120,
        height:50,
        backgroundColor:125125125,
        
    },
    buttonImage:{
        width:120,
        height:50
        
    },

    view:{
        padding:20
    },

    textInput:{
        height: 80,
        marginTop: 10,
        marginLeft:0
    }
});