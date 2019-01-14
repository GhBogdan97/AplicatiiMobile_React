import { httpApiUrl, wsApiUrl } from '../core/api';
import React, {Component} from 'react';
import {Provider} from './context';
import {getLogger} from "../core/utils";
import {Login} from "./Login";
import { AsyncStorage } from "react-native";

const log = getLogger('AuthProvider');

export class AuthProvider extends Component{
    constructor(props){
        super(props);
        this.state = {
            isLoading: false,
            contacts: null,
            issue: null,
            token: null
        };
    }

    componentDidMount=async()=>{
        log("componentDidMount");
        var tokenValue = await AsyncStorage.getItem('token');
        console.log(tokenValue);
        if(tokenValue==null)
        {
            this.setState({token:null});
        }
        else
        {
            this.setState({token:tokenValue});
        }
    }

    storeData = async(token)=>{
        try{
            await AsyncStorage.setItem('token',JSON.stringify({token:token}));
        } catch(error){
            console.log("error saving token");
        }

    }

    handleLogin = (username, password) => {
        console.log("login function");
        console.log(JSON.stringify({username, password}));
        fetch(`${httpApiUrl}/user/authenticate`, {
          method: "POST", 
          headers: {
              "Content-Type": "application/json; charset=utf-8",
          },
          body: JSON.stringify({username, password,token:""}), 
        })
        .then(response => response.json()) 
        .then(({ Token }) =>{
            console.log(Token);
            this.storeData(Token);
            this.setState({ isLoading: false, token:Token });

             
        })
        .catch(error => {console.log(error);this.setState({ isLoading: false, issue: error })});   
      };

    render(){
        console.log("auth provider");
        const {issue, isLoading, token} = this.state;
        console.log(isLoading);
        console.log(token);
        return (
            <Provider value={{ token }}>
              { token && !isLoading
                ? this.props.children
                : <Login 
                    isLoading={ isLoading}
                    issue={ issue}
                    onSubmit={ (username,password)=> this.handleLogin(username,password) }/>} 
            </Provider>
          );
    }
}