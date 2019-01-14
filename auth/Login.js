import React, { Component } from 'react';
import {Button, Text, View, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import { Label } from 'native-base';

export class Login extends Component{
    constructor(props){
        super(props);
        this.state = {
            username: '',
            password: ''
        };
    }

    render(){
        return(
            <View style={styles.view}>
               
                <TextInput
                    style={styles.textInput}
                    placeholder="username"
                    onChangeText={(username) => this.setState({username})}
                />
                
                <TextInput
                    style={styles.textInput}
                    placeholder="password"
                    secureTextEntry={true}
                    onChangeText={(password) => this.setState({password})}
                />
                <Button
                style={styles.buttonLogin}
                    onPress={() => this.props.onSubmit(this.state.username, this.state.password)}
                title="Login"
                >
                </Button>
            </View>
        )
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