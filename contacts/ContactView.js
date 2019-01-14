import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';

export class ContactView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    // console.log("view", this.props)
    return (
      <View >
        <TouchableOpacity style={{marginBottom:10}} onPress={()=>{var contact= this.props.contact;this.props.toEdit(contact,this.props.updateFunction)}}>
          <Text style={styles.todoText}>{this.props.contact.Id}  {this.props.contact.Firstname} {this.props.contact.Lastname} {this.props.contact.PhoneNumber}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  todoItemPriority3: {
    flexDirection: 'row',
    height: 50,
    padding: 10,
    borderBottomColor:'white',
    borderBottomWidth: 1
  },

  todoText: {
    flex: 1,
    fontSize: 19
  },
});