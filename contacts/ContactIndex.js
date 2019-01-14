import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import {ContactList} from './ContactList'
import {ContactStore} from './ContactStore'
import {WebSocketService} from '../services/WebSocket'

export class ContactIndex extends Component {
  constructor(props) {
    super(props);
    this.state=
    {
      webSocket:null
    }
  }

  componentDidMount()
  {
    if(this.state.webSocket==null)
    {
      var ws=new WebSocketService();
      ws.startConnection("User");
      this.setState({webSocket:ws});
    }
  }

  render() {
   console.log("contact index");
    return (
    <ContactStore navigation={this.props.navigation}>
        <ContactList navigation={this.props.navigation} webSocket={this.state.webSocket}/>
    </ContactStore>
    );
  }
}